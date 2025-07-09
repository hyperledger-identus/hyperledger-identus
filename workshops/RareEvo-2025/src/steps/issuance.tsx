
import { Step } from "@/types";
import React, { useCallback, useEffect, useMemo, useState  } from "react";
import { useDatabase, useIssuer, useMessages } from "@trust0/identus-react/hooks";
import SDK from '@hyperledger/identus-sdk';
import { useWorkshop } from "@/pages/_app";


import {
    OEA,
} from '@hyperledger/identus-sdk/plugins/oea';
import * as ddd2 from '@hyperledger/identus-sdk/plugins/dif';



const step: Step = {
    type: 'issuer',
    disableCondition: (store) => !store.issuerAccepted,
    title: 'Review & Issue Credentials',
    description: 'Return to the issuer perspective to review incoming credential requests from holders. Approve or reject requests and issue SD-JWT credentials with the configured claims to complete the issuance process.',
    content() {
        const {
            setStore, ...store
        } = useWorkshop();     
        const { issueCredential } = useIssuer();
        const { getIssuanceFlow } = useDatabase();
        const { receivedMessages,sentMessages, deleteMessage } = useMessages();
        const [credentialRequests, setCredentialRequests] = useState<SDK.Domain.Message[]>([]);

        useEffect(() => {
            const newCredentialRequests = receivedMessages
                .filter(m => m.piuri === SDK.ProtocolType.DidcommRequestCredential)
                .filter(( message ) => {
                    const issuedCredential = sentMessages.find(({ thid, piuri }) => piuri === SDK.ProtocolType.DidcommIssueCredential && thid === message.thid);
                    return !issuedCredential; 
                });
            
            // Only update state if requests have actually changed
            setCredentialRequests(prev => {
                if (prev.length !== newCredentialRequests.length) {
                    return newCredentialRequests;
                }
                // Check if any request IDs have changed
                const prevIds = prev.map(r => r.id).sort();
                const newIds = newCredentialRequests.map(r => r.id).sort();
                if (prevIds.join(',') !== newIds.join(',')) {
                    return newCredentialRequests;
                }
                return prev;
            });
        }, [receivedMessages, sentMessages]);

        const onReject = useCallback(async (message: SDK.Domain.Message) => {
            deleteMessage(message);
        }, [deleteMessage]);

        const onApprove = useCallback(async (message: SDK.Domain.Message) => {
            const issuanceFlow = await getIssuanceFlow(message.thid!);
            if (!issuanceFlow) {
                throw new Error("No issuance flow found");
            }
            const issuerDID = SDK.Domain.DID.fromString(issuanceFlow.issuingDID);
            if (issuanceFlow.credentialFormat === SDK.Domain.CredentialType.JWT || issuanceFlow.credentialFormat === SDK.Domain.CredentialType.SDJWT) {
               debugger;
                await issueCredential(
                    issuanceFlow.credentialFormat,
                    message,
                    issuanceFlow.claims,
                    issuerDID,
                    message.from!
                );
                setStore({ ...store,  issuerAccepted:true });
            }
        }, [getIssuanceFlow, setStore, store, issueCredential]);

        const isRequestPending = useCallback((message: SDK.Domain.Message) => {
            const hasSentIssuance = sentMessages
                .some(m =>
                    m.piuri === SDK.ProtocolType.DidcommIssueCredential &&
                    m.direction === SDK.Domain.MessageDirection.SENT &&
                    (m.thid === message.id || m.thid === message.thid)
                );

            return !hasSentIssuance;
        }, [sentMessages]);

        return <div>

            {credentialRequests.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500">No pending credential requests available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {credentialRequests.map((request, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h4 className="text-lg font-medium text-slate-900">
                                        Request #{index + 1}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        From: {request.from?.toString().slice(0, 74) || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        To: {request.to?.toString() || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        ID: {request.id || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            {
                                isRequestPending(request) && <div className="flex space-x-3">
                                    <button
                                        onClick={() => onApprove(request)}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => onReject(request)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Reject
                                    </button>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    }
}

export default step;