import SDK from "@hyperledger/identus-sdk";
import { useCallback, useEffect, useState } from "react";
import { useMessages, useVerifier } from "@trust0/identus-react/hooks";
import { Step } from "@/types";

function Presentation({ presentation }: { presentation: SDK.Domain.Message }) {
    const {verifyPresentation, agent, state: agentState} = useVerifier();
    const [verified, setVerified] = useState<boolean | null>(null);
    const onHandleVerify = useCallback(async () => {
        if (!agent || agentState !== SDK.Domain.Startable.State.RUNNING) {
            throw new Error("Agent not running");
        }
        try {
            const verify = await verifyPresentation(presentation);
            setVerified(verify);
        } catch (error) {
            setVerified(false);
        }
    }, [agent, agentState, presentation, verifyPresentation]);
    return <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-slate-50">
        <h2>Verify Presentation</h2>
        {
            verified !== null && <>
            {verified && <p>Presentation is Valid</p>}
            {!verified && <p>Presentation is Invalid</p>}
            </>
        }
        {
            verified === null && <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onHandleVerify}>Verify</button>
        }
    </div>

}
const VerifyPresentation = () => {
    const [presentations, setPresentations] = useState<SDK.Domain.Message[]>([]);
    const { receivedMessages } = useMessages();
    useEffect(() => {
        const presentations = receivedMessages.filter(({ piuri }) => piuri === SDK.ProtocolType.DidcommPresentation);
        setPresentations(presentations);
    }, [receivedMessages]);
    return <div>
        {
            presentations.length === 0 && <p>No presentations found</p>
        }
        {presentations.length > 0 && presentations.map((presentation) => (
            <Presentation key={`verify-presentation-${presentation.uuid}`} presentation={presentation} />
        ))}
    </div>
}

const step: Step = {
    type: "verifier",
    title: "Verify Presentation",
    description: "",
    content: VerifyPresentation
}

export default step;