
import { Step } from "@/types";
import React, { useCallback, useEffect, useMemo, useState  } from "react";
import { useDatabase, useIssuer, useMessages, usePrismDID } from "@trust0/identus-react/hooks";
import SDK from '@hyperledger/identus-sdk';
import { useWorkshop } from "@/pages/_app";


import { Request } from "@/types";
import { FlowCard } from "@/components/core/FlowCard";

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
        const { getIssuanceFlow, updateDIDStatus } = useDatabase();
        const { receivedMessages,sentMessages, deleteMessage } = useMessages();
        const [credentialRequests, setCredentialRequests] = useState<{message: SDK.Domain.Message, request: Request}[]>([]);
        const [approveBusy, setApproveBusy] = useState(false);
        const [rejectBusy, setRejectBusy] = useState(false);
        const { isPublished: isPublishedPrismDID } = usePrismDID();

        const withFlow = useCallback(async (messages: SDK.Domain.Message[]) => {
            const withFlows: {message: SDK.Domain.Message, request: Request}[] = [];
            const newCredentialRequests = receivedMessages
            .filter(m => m.piuri === SDK.ProtocolType.DidcommRequestCredential)
            .filter(( message ) => {
                const issuedCredential = sentMessages.find(({ thid, piuri }) => piuri === SDK.ProtocolType.DidcommIssueCredential && thid === message.thid);
                return !issuedCredential; 
            });
            for (const message of newCredentialRequests) {
                const flow = await getIssuanceFlow(message.thid!);
                if (flow) {
                    withFlows.push({
                        message,
                        request: flow
                    })
                }
            }
            return withFlows;
        }, [getIssuanceFlow, receivedMessages, sentMessages]);



        useEffect(() => {
            withFlow(receivedMessages).then((withFlows) => {
                setCredentialRequests(prev => {
                    if (prev.length !== withFlows.length) {
                        return withFlows;
                    }
                    // Check if any request IDs have changed
                    const prevIds = prev.map(r => r.message.id).sort();
                    const newIds = withFlows.map(r => r.message.id).sort();
                    if (prevIds.join(',') !== newIds.join(',')) {
                        return withFlows;
                    }
                    return prev;
                });
            })
        }, [getIssuanceFlow, receivedMessages, sentMessages, withFlow]);

        const onReject = useCallback(async (message: SDK.Domain.Message) => {
            setRejectBusy(true);
            await deleteMessage(message);
            setRejectBusy(false);
        }, [deleteMessage]);

        const onApprove = useCallback(async (message: SDK.Domain.Message) => {
            setApproveBusy(true);
            const issuanceFlow = await getIssuanceFlow(message.thid!);
            if (!issuanceFlow) {
                throw new Error("No issuance flow found");
            }
            const issuerDID = await isPublishedPrismDID(SDK.Domain.DID.fromString(issuanceFlow.issuingDID)) ? 
            SDK.Domain.DID.fromString(issuanceFlow.issuingDID) : 
            SDK.Domain.DID.fromString(issuanceFlow.issuingDID);
            
            if (issuanceFlow.credentialFormat === SDK.Domain.CredentialType.JWT || issuanceFlow.credentialFormat === SDK.Domain.CredentialType.SDJWT) {
                await issueCredential(
                    issuanceFlow.credentialFormat,
                    message,
                    issuanceFlow.claims,
                    issuerDID,
                    message.from!
                );
                setStore({ ...store,  issuerAccepted:true });
            }
            setApproveBusy(false);
        }, [getIssuanceFlow, isPublishedPrismDID, issueCredential, setStore, store]);

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

<FlowCard
                    isSelected={false}
                    key={request.request.id}
                    flow={request.request}
                    index={index}
                    busy={true}
                />

                            <div className="mt-4">
                            {
                                isRequestPending(request.message) && <div className="flex space-x-3">
                                    <button
                                        disabled={approveBusy || rejectBusy}
                                        onClick={() => onApprove(request.message)}
                                        className={`flex-1 font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
                                            approveBusy || rejectBusy
                                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                                : 'bg-emerald-500 hover:bg-emerald-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg cursor-pointer'
                                        }`}
                                    >
                                        {approveBusy ? 'Issuing...' : 'Issue Credential'}
                                    </button>
                                    <button
                                        disabled={approveBusy || rejectBusy}
                                        onClick={() => onReject(request.message)}
                                        className={`flex-1 font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
                                            approveBusy || rejectBusy
                                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                                : 'bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg cursor-pointer'
                                        }`}
                                    >
                                        {rejectBusy ? 'Rejecting...' : 'Reject'}
                                    </button>
                                </div>
                            }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    }
}

export default step;