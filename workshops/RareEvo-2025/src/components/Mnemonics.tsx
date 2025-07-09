'use client'
import React, { useEffect, useState } from "react";
import { useApollo, useDatabase } from "@trust0/identus-react/hooks";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Codes } from "./core/Codes";

export function Mnemonics({ onNext }: { onNext: () => void }) {
    const apollo = useApollo();
    const { setSeed } = useDatabase();
    const [mnemonics, setMnemonics] = useState<string[]>([]);

    useEffect(() => {
        setMnemonics(apollo.createRandomMnemonics());
    }, [apollo]);

    async function regenerateClick() {
        setMnemonics(apollo.createRandomMnemonics());
    }

    async function onNextClick() {
        if (mnemonics.length === 24) {
            const seed = apollo.createSeed(mnemonics as any);
            await setSeed(seed);
            onNext();
        }
    }

    return <>
    
    <div className="bg-slate-50 rounded-lg p-4">
                <Codes
                    codes={{
                        'With React Providers': {
                            language: 'typescript',
                            code: `import React, { useEffect, useState } from "react";
import SDK from "@hyperledger/identus-sdk";
import { useApollo, useDatabase } from "@trust0/identus-react/hooks";
import { RefreshCw, ArrowRight } from "lucide-react";

/**
 * This component uses the Apollo instance of the Identus SDK to generate random bip39 mnemonics.
 * We also use the useDatabase hook to set the seed in the database.
 * If the Database is not yet started clicking next will throw exception.
 */
export function Mnemonics() {
    const apollo = useApollo();
    const { getSeed, setSeed, dbState } = useDatabase();
    const [mnemonics, setMnemonics] = useState<string[]>([]);

    useEffect(() => {
        setMnemonics(apollo.createRandomMnemonics());
    }, [apollo]);

    async function regenerateClick() {
        setMnemonics(apollo.createRandomMnemonics());
    }

    async function onNextClick() {
        if (dbState !== 'loaded') {
            throw new Error('Database is not loaded');
        }
        if (mnemonics.length === 24) {
            const seed = apollo.createSeed(mnemonics as any);
            setSeed(seed);
        }
    }

    return <div className="bg-white/95 backdrop-blur-lg py-8 px-6 shadow-xl rounded-2xl border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {mnemonics.map((word, i) => (
                <div
                    key={i}
                    className="flex items-center p-2 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                    <span className="text-emerald-500 mr-1 text-xs font-medium w-4">
                        {i + 1}.
                    </span>
                    <span className="text-slate-800 text-sm">
                        {word}
                    </span>
                </div>
            ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                className="group flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 backdrop-blur-sm text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-300 border border-slate-200"
                onClick={regenerateClick}
            >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Generate New Phrase
            </button>
            <button
                className="group flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={onNextClick}
            >
                Next
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
}`
                        },
                        'Without React': {
                            language: 'typescript',
                            code: `import SDK from "@hyperledger/identus-sdk";
const apollo = new SDK.Apollo();

/**
 * This function creates a random seed and a corresponding set of mnemonic phrases, directly using the SDK.
 */
export function createRandomSeed() {
   const seed = apollo.createRandomSeed();
   return seed;
}`
                        }
                    }} />
            </div>
            <div className="bg-white/95 backdrop-blur-lg py-8 px-6 shadow-xl rounded-2xl border border-slate-200">
        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Recovery Phrase</h3>
            <p className="text-sm text-slate-600">
                Your 24-word recovery phrase. Store it safely and never share it with anyone.
            </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {mnemonics.map((word, i) => (
                <div
                    key={`mnemonicWord${i}`}
                    className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                    <span className="text-emerald-600 mr-2 text-xs font-semibold w-6 text-center bg-emerald-100 rounded px-1 py-0.5">
                        {i + 1}
                    </span>
                    <span className="text-slate-800 text-sm font-medium">
                        {word}
                    </span>
                </div>
            ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                className="group flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 backdrop-blur-sm text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-300 border border-slate-200"
                onClick={regenerateClick}
            >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Generate New Phrase
            </button>
            <button
                className="group flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={onNextClick}
            >
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
    </>
}