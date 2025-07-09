import { Step } from "@/types";
import SDK from "@hyperledger/identus-sdk";
import { useCredentials, useDatabase, useHolder, useMessages } from "@trust0/identus-react/hooks";
import { useCallback, useEffect, useState } from "react";
import { useWorkshop } from "@/pages/_app";
import { useMessageStatus } from "@/utils";


function CredentialSelector({ request, onSelected }: { request: SDK.RequestPresentation, onSelected: (credential: SDK.Domain.Credential) => void }) {
    const { credentials } = useCredentials()
    const [selectedCredential, setSelectedCredential] = useState<SDK.Domain.Credential | null>(credentials.length > 0 ? credentials[0] : null);

    useEffect(() => {
        if (selectedCredential) {
            onSelected(selectedCredential);
        }
    }, [selectedCredential, onSelected])

    return <div>
        <h2>Choose your Credential</h2>
        <select
            value={selectedCredential?.id}
            onChange={(e) => {
                const credential = credentials.find((c) => c.id === e.target.value);
                if (credential) {
                    setSelectedCredential(credential);
                }
            }}
        >
            {credentials.map((credential) => (
                <option key={credential.id} value={credential.id}>{credential.credentialType}</option>
            ))}
        </select>
    </div>
}


function PresentationRequest({ request }: { request: SDK.RequestPresentation }) {
    const [selectedCredential, setSelectedCredential] = useState<SDK.Domain.Credential | null>(null);
    const message = request.makeMessage();
    const { handlePresentationRequest, state: agentState, agent } = useHolder();
    const { deleteMessage, load: loadMessages } = useMessages();
    const { state: dbState } = useDatabase();
    const { hasAnswered } = useMessageStatus(message);

    const onHandleAccept = useCallback(async () => {
        if (!agent || agentState !== SDK.Domain.Startable.State.RUNNING) {
            return;
        }
        if (!selectedCredential) {
            throw new Error("No credential selected");
        }
        await handlePresentationRequest(message, selectedCredential);
    }, [agent, agentState, selectedCredential, message, handlePresentationRequest]);

    const onHandleReject = useCallback(async () => {
        if (dbState === 'loaded') {
            await deleteMessage(message);
            await loadMessages();
        }
    }, [dbState, deleteMessage, message, loadMessages]);

    return <div>
        <h2>{JSON.stringify(request)}</h2>
        {!hasAnswered && <>
            <CredentialSelector request={request} onSelected={setSelectedCredential} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onHandleAccept}>Accept</button>
            <button className="mx-2 bg-red-500 text-white px-4 py-2 rounded-md" onClick={onHandleReject}>Reject</button>
        </>}
        {hasAnswered && <p>You already accepted this offer.</p>}
    </div>
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
    }, [agentState, store, parseOOB, setStore, agent, loadMessages])

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