'use client'
import { AgentType, NextFnProps } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { useAgent, useDatabase } from "@trust0/identus-react/hooks";
import { BLOCKFROST_KEY, MEDIATOR_DID, RESOLVER_URL } from "@/config";
import SDK from "@hyperledger/identus-sdk";
import { Mnemonics } from "./Mnemonics";
import { StorageType } from "@trust0/ridb";

export function AgentWorkFlow({children, type: agentType}: {children: React.ReactNode, type: AgentType} & NextFnProps) {
    const [step, setStep] = useState<'disconnected'|'seed' | 'ready' | 'busy'>('disconnected')
    const { 
        state: dbState,
        getSeed,
        getMediator,
        setMediator,
        getSettingsByKey,
        storeSettingsByKey,
        getResolverUrl,
        setResolverUrl,
        start,
    } = useDatabase();

    const {
        start:startAgent,
    } = useAgent();

    const configure = useCallback(async () => {
        const mediator = await getMediator();
        if (!mediator) {
            await setMediator(SDK.Domain.DID.fromString(MEDIATOR_DID));
        }
        const blockfrost = await getSettingsByKey('blockfrost-key');
        if (!blockfrost && BLOCKFROST_KEY) {
            await storeSettingsByKey('blockfrost-key', BLOCKFROST_KEY);
        }
        const resolverUrl = await getResolverUrl();
        if (!resolverUrl && RESOLVER_URL) {
            await setResolverUrl(RESOLVER_URL);
        }
    }, [getMediator, setMediator, getSettingsByKey, storeSettingsByKey, getResolverUrl, setResolverUrl]);

    const onHandleMnemonicsNext = useCallback(async () => {
        if (dbState === "loaded") {
            const seed = await getSeed();
            if (!seed) {
                return setStep('seed');     
            }
            setStep('ready');
            await configure()
            await startAgent();
        }
    }, [dbState, getSeed, configure, startAgent]);

    useEffect(() => {
        let internal: NodeJS.Timeout;
         function check() {
            internal = setTimeout(() => {
                if (dbState === "loaded") {
                    getSeed().then((seed) => {
                        if (seed && step === 'seed') {
                            setStep('ready');
                        } else {
                            check();
                        }
                    })
                }
            }, 150);
        }
        check();
        return () => clearTimeout(internal);
    });
    useEffect(() => {
        async function load()  {
            if (dbState === "disconnected") {
                return start({
                    dbName: `rare-evo-${agentType}`,
                    storageType: StorageType.IndexDB,
                    password: 'password'
                });
            }
            const shouldLoad = step !== 'busy' && step !== 'ready' && step !== 'seed';
            if (dbState === "loaded" && shouldLoad) {
                setStep('busy');
                const seed = await getSeed();
                if (!seed) {
                    return setStep('seed');     
                }
                await configure()
                await startAgent();
                return setStep('ready');
            }
        }
        load();
    }, [dbState, step, agentType, start, getSeed, configure, startAgent]);

    if (dbState === "error") {
        return (
            <div className="py-6 px-4 bg-white rounded-xl border border-red-200 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-red-900">Database Error</h3>
                        <p className="text-sm text-red-700">
                            Database error occurred. Please refresh the page. If that doesn&apos;t work, clear storage and try again.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (dbState === "loading" || dbState === "disconnected") {
        return (
            <div className="py-6 px-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-900">Loading Database</h3>
                        <p className="text-sm text-slate-600">
                            Please wait while we initialize your database connection...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'seed') {
        return <div className="py-6 px-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent Seed
                </h3>
                <div className="max-w-md mx-auto space-y-3">
                    <p className="text-base text-slate-700">Each instance of the agent will need to have a seed to work and derive the corresponding keys.</p>
                    <p className="text-sm text-slate-600">For this example, just generate a new seed and click continue.</p>
                </div>
            </div>
            <Mnemonics onNext={onHandleMnemonicsNext} />
        </div>       
    }
    
    return children;
} 