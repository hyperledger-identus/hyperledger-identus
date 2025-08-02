import { Request } from "@/types";
import SDK from "@hyperledger/identus-sdk";
import { useMessages } from "@trust0/identus-react/hooks";
import { useCallback } from "react";


export const FlowCard = ({
    flow,
    index,
    isSelected,
    onSelect
}: {
    flow: Request;
    index: number;
    isSelected: boolean;
    onSelect: (flow: Request) => void;
}) => {
    const { receivedMessages, sentMessages } = useMessages();
    const getIssuanceStatus = useCallback((request: Request) => {
        const received = receivedMessages.filter((message) => message.thid === request.id);
        const sent = sentMessages.filter((message) => message.thid === request.id);
        if (sent.find(({ piuri }) => piuri === SDK.ProtocolType.DidcommIssueCredential)) {
            return 'completed'
        }
        if (received.find(({ piuri }) => piuri === SDK.ProtocolType.DidcommRequestCredential)) {
            return 'accept-pending'
        }
        return 'pending'
    }, [receivedMessages, sentMessages]);
    const status = getIssuanceStatus(flow);
    return <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Issuance Flow #{index + 1}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>
            {!isSelected && status !== 'completed' && (
                <button
                    onClick={() => {
                        onSelect(flow);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Use OOB Offer
                </button>
            )}
        </div>

        <div className="space-y-3">
            <div>
                <span className="text-sm font-medium text-slate-600">Issuing DID:</span>
                <p className="text-sm font-mono text-slate-800 px-2 py-1 mt-1 break-all">
                    {flow.issuingDID.slice(0, 74)}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <span className="text-sm text-slate-600">
                        Format: <span className="font-medium text-slate-800">{flow.credentialFormat}</span>
                    </span>
                </div>
            </div>

            {flow.claims && flow.claims.length > 0 && (
                <div>
                    <span className="text-sm font-medium text-slate-600 mb-2 block">Claims:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {flow.claims.map((claim, claimIndex) => (
                            <div key={claimIndex} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                <div className="text-xs font-medium text-emerald-700">{claim.name}</div>
                                <div className="text-sm text-emerald-600">{claim.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
};