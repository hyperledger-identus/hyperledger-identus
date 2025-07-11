import { Step } from "@/types";
import SDK from "@hyperledger/identus-sdk";
import { useCredentials, useDatabase, useHolder, useMessages } from "@trust0/identus-react/hooks";
import { useCallback, useEffect, useState } from "react";
import { useWorkshop } from "@/pages/_app";
import { useMessageStatus } from "@/utils";


function CredentialSelector({ request }: { request: SDK.RequestPresentation }) {
    const { credentials } = useCredentials()
    const [selectedCredential, setSelectedCredential] = useState<SDK.Domain.Credential | null>(credentials.length > 0 ? credentials[0] : null);
    const { handlePresentationRequest, state: agentState, agent } = useHolder();
    const { deleteMessage, load: loadMessages } = useMessages();
    const { state: dbState } = useDatabase();
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const requestPresentation = request.decodedAttachments.at(0);

    const claims: any[] = requestPresentation?.presentation_definition ?
        requestPresentation.presentation_definition.input_descriptors.at(0)?.constraints.fields ?? [] :
        [];

    const fields = claims.reduce<any>((all, claim) => [
        ...all,
        {
            name: claim.name,
            type: claim.filter.type,
            value: claim.filter.pattern
        }
    ], []);

    const availableCredentials = credentials.filter((credential) => {
        const hasFields = fields.every((field) => {
            if (field.name === 'issuer') {
                return credential.issuer.includes(field.value);
            }
            return credential.claims.some((claim) => {
                const keys = Object.keys(claim);
                return keys.includes(field.name);
            })
        })
        return hasFields;
    })

    const onHandleAccept = useCallback(async () => {
        if (!agent || agentState !== SDK.Domain.Startable.State.RUNNING) {
            return;
        }
        if (!selectedCredential) {
            throw new Error("No credential selected");
        }
        try {
            setIsAccepting(true);
            await handlePresentationRequest(request.makeMessage(), selectedCredential);
        } finally {
            setIsAccepting(false);
        }
    }, [agent, agentState, selectedCredential, handlePresentationRequest, request]);

    const onHandleReject = useCallback(async () => {
        if (dbState === 'loaded') {
            try {
                setIsRejecting(true);
                await deleteMessage(request.makeMessage());
                await loadMessages();
            } finally {
                setIsRejecting(false);
            }
        }
    }, [dbState, deleteMessage, request, loadMessages]);

    return <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4">

            <h2>Choose your Credential</h2>
            {
                availableCredentials.length === 0 ?
                    <>
                        <p>You have no credentials that match the request</p>
                        <button 
                            className="mt-4 mx-2 bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
                            onClick={onHandleReject}
                            disabled={dbState !== 'loaded' || isRejecting}
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </button>

                    </> :
                    <>

                        <select
                            value={selectedCredential?.id}
                            onChange={(e) => {
                                const credential = credentials.find((c) => c.id === e.target.value);
                                if (credential) {
                                    setSelectedCredential(credential);
                                }
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        >
                            {availableCredentials.map((credential) => {
                                const credentialClaimKeys = credential.claims.reduce((allClaims, claim) => {
                                    const claimKeys = Object.keys(claim)
                                        .filter((key) => !['iss', 'sub', 'iat', 'jti'].includes(key))
                                        .map((key) => `${key}: ${claim[key].value}`)
                                        .slice(0, 2)
                                    return `${allClaims}${claimKeys.join(', ')}`
                                }, '')
                                return <option key={credential.id} value={credential.id}>
                                   Credential[{credential.credentialType}] {credentialClaimKeys}
                                </option>
                            })}
                        </select>

                        <button 
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
                            onClick={onHandleAccept}
                            disabled={!agent || agentState !== SDK.Domain.Startable.State.RUNNING || !selectedCredential || isAccepting || isRejecting}
                        >
                            {isAccepting ? 'Accepting...' : 'Accept'}
                        </button>
                        <button 
                            className="mt-4 mx-2 bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
                            onClick={onHandleReject}
                            disabled={dbState !== 'loaded' || isAccepting || isRejecting}
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </button>

                    </>




            }
        </div>
    </div>
}


function PresentationRequest({ request }: { request: SDK.RequestPresentation }) {
    const message = request.makeMessage();
    const { hasAnswered } = useMessageStatus(message);


    return hasAnswered ?
        <p>You already accepted this offer.</p> :
        <CredentialSelector request={request} />
}

function PresentCredential() {
    const { setStore, ...store } = useWorkshop();
    const { pluto } = useDatabase();
    const { parseOOB, agent, state: agentState } = useHolder();
    const { receivedMessages, sentMessages, load: loadMessages } = useMessages();
    const [presentationRequests, setPresentationRequests] = useState<SDK.RequestPresentation[]>([]);

    useEffect(() => {
        const presentationRequests = receivedMessages.filter(({ piuri }) => piuri === SDK.ProtocolType.DidcommRequestPresentation);
        const presentations = sentMessages.filter(({ piuri }) => piuri === SDK.ProtocolType.DidcommPresentation);
        setPresentationRequests(
            presentationRequests
                .filter((m) => !presentations.some(({ thid }) => thid === m.thid))
                .map((m) => SDK.RequestPresentation.fromMessage(m))
        );
    }, [receivedMessages, sentMessages]);

    useEffect(() => {
        if (agent && agentState === SDK.Domain.Startable.State.RUNNING) {
            const url = new URL(store.verifierRequestOOB ?? window.location.href);
            const oob = url.searchParams.get('oob');
            if (store.verifierRequestOOB && oob) {
                setStore({ verifierRequestOOB: undefined })
                parseOOB(store.verifierRequestOOB).then(async (message) => {
                    setPresentationRequests((prev) => [...prev, SDK.RequestPresentation.fromMessage(message)]);
                    await pluto.storeMessage(message);
                    loadMessages();
                })
            }
        }
    }, [agentState, store, parseOOB, setStore, agent, loadMessages, pluto])

    return <div>
        {
            presentationRequests.length === 0 && <p>No presentation requests found</p>
        }
        {presentationRequests.length > 0 && presentationRequests.map((request) => (
            <PresentationRequest key={`presentation-request-${request.id}`} request={request} />
        ))}
    </div>
}






const step: Step = {
    type: "holder",
    title: "Present Credential",
    description: "",
    content: PresentCredential
}

export default step;