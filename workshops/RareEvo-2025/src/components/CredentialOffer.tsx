import { NextFnProps } from "@/types";
import SDK from "@hyperledger/identus-sdk";
import { useDatabase, useHolder, useMessages } from "@trust0/identus-react/hooks";
import { useCallback, useState } from "react";
import { useMessageStatus } from "@/utils";

export function CredentialOffer(props: { credentialOffer: SDK.Domain.Message  } & NextFnProps) {
    const { credentialOffer } = props;
    const { agent, acceptOOBOffer, state:agentState } = useHolder();
    const { deleteMessage, state:dbState } = useDatabase();
    const { load: loadMessages } = useMessages();
    const { hasAnswered } = useMessageStatus(credentialOffer);
    const [acceptBusy, setAcceptBusy] = useState(false);
    const [rejectBusy, setRejectBusy] = useState(false);
    const body = credentialOffer.body;

    const onHandleAccept = useCallback(async function onHandleAccept(credentialOffer: SDK.Domain.Message) {
        if (!agent || agentState !== SDK.Domain.Startable.State.RUNNING) {
            throw new Error("Start the agent first");
        }
        if (!credentialOffer) {
            throw new Error("Create a peer DID first");
        }
        setAcceptBusy(true);
        await acceptOOBOffer(credentialOffer);
        await loadMessages();
        setAcceptBusy(false);
    }, [acceptOOBOffer, agent, agentState, loadMessages]);

    const onHandleReject = useCallback(async function onHandleReject(credentialOffer: SDK.Domain.Message) {
        if (dbState !== 'loaded') {
            throw new Error("Start the agent first");
        }
        setRejectBusy(true);
        await deleteMessage(credentialOffer);
        await loadMessages();
        setRejectBusy(false);
    }, [dbState, deleteMessage, loadMessages]);
    
    return <div className="mt-4 space-y-4">
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
                <h4 className="text-lg font-medium text-slate-900">
                    Credential Offer
                </h4>
                {
    hasAnswered ?    
    <p>You already accepted this credential offer.</p>
:     <p>Issuer of offering you a Credential with the following claims:</p>

}
            <div className="flex flex-wrap gap-3 mt-2">
                {
                    body.credential_preview.body.attributes.map((field: { name: string, value: string }, i: number) => {
                        return (
                            <div key={i} className="flex-auto min-w-fit">
                                <span className="text-sm font-medium text-slate-600">{field.name}: </span>
                                <p className="text-md font-normal text-gray-500 lg:text-xl dark:text-gray-400 break-all inline">
                                    {field.value}
                                </p>
                            </div>
                        );
                    })
                }
            </div>
            </div>
        </div>

    {!hasAnswered && <div className="flex space-x-3">
            <button
                disabled={acceptBusy || rejectBusy}
                onClick={() => onHandleAccept(credentialOffer)}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
                    acceptBusy || rejectBusy
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg cursor-pointer'
                }`}
            >
                {acceptBusy ? 'Accepting...' : 'Accept'}
            </button>
            <button
                disabled={acceptBusy || rejectBusy}
                onClick={() => onHandleReject(credentialOffer)}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
                    acceptBusy || rejectBusy
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg cursor-pointer'
                }`}
            >
                {rejectBusy ? 'Rejecting...' : 'Reject'}
            </button>
        </div>}
    </div>
</div>
}