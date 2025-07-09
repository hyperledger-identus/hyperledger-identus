'use client';

import React, { useEffect } from "react";
import { Hooks, NextFnProps, Step } from "@/types";
import { AgentWorkFlow } from "../AgentWorkFlow";
import { DatabaseContext, AgentContext, ConnectionsContext, CredentialsContext, HolderContext, IssuerContext, MessagesContext, PeerDIDContext, PrismDIDContext, VerifierContext } from "@trust0/identus-react/context";
import { Status } from "../Status";
import { CredentialsProvider, MessagesProvider, ConnectionsProvider, PeerDIDProvider, PrismDIDProvider, IssuerProvider, HolderProvider, VerifierProvider } from "@trust0/identus-react";
import { useDatabase, useMessages } from "@trust0/identus-react/hooks";



export function WithContext({ context, children }: { context: Partial<Hooks>, children?: React.ReactNode }) {
    if (!context) return null;
    const {
        useAgent,
        useDatabase,
        useConnections,
        useCredentials,
        useHolder,
        useIssuer,
        useMessages,
        usePeerDID,
        usePrismDID,
        useVerifier,
    } = context;
    return (
        <DatabaseContext.Provider value={useDatabase}>
            <CredentialsContext.Provider value={useCredentials}>
                <AgentContext.Provider value={useAgent}>
                    <HolderContext.Provider value={useHolder}>
                        <IssuerContext.Provider value={useIssuer}>
                            <VerifierContext.Provider value={useVerifier}>
                                <MessagesContext.Provider value={useMessages}>
                                    <ConnectionsContext.Provider value={useConnections}>
                                        <PeerDIDContext.Provider value={usePeerDID}>
                                            <PrismDIDContext.Provider value={usePrismDID}>
                                                {children}
                                            </PrismDIDContext.Provider>
                                        </PeerDIDContext.Provider>
                                    </ConnectionsContext.Provider>
                                </MessagesContext.Provider>
                            </VerifierContext.Provider>
                        </IssuerContext.Provider>
                    </HolderContext.Provider>
                </AgentContext.Provider>
            </CredentialsContext.Provider>
        </DatabaseContext.Provider>
    );
}



export function StepComponent(props: { step: Step } & NextFnProps) {
    const { step } = props;
    const agentType = step.type || 'issuer';
    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'issuer':
                return 'bg-blue-50';
            case 'holder':
                return 'bg-green-50';
            case 'verifier':
                return 'bg-purple-50';
            default:
                return 'bg-gray-50';
        }
    };
    const Content = step.content;
    return <AgentWorkFlow type={agentType}>
        <div className={`${getBackgroundColor(agentType)} border border-gray-200 p-8 rounded-lg shadow-lg max-w-5xl mx-auto mb-8`}>
            {
                step.title !== '' && <div className="flex items-center justify-between mb-6">
                    <h2 className="text-4xl font-bold text-blue-700">
                        {step.title}
                    </h2>
                    <Status type={agentType}/>
                </div>
            }
            <p className="text-gray-600 leading-relaxed mb-6">
                {step.description}
                </p>
                <Content type={agentType} />
        </div>
    </AgentWorkFlow>

}