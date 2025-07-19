import SDK from "@hyperledger/identus-sdk";
import { useCallback, useEffect, useState } from "react";
import { useMessages, useVerifier } from "@trust0/identus-react/hooks";
import { Step } from "@/types";
import dynamic from "next/dynamic";
import { ExistingPresentations } from "@/components/core/ExistingPresentations";

const Flowchart = dynamic(() => import("@/components/core/Flowchart"), { ssr: false });

const VerifyPresentation = () => {
    const [presentations, setPresentations] = useState<SDK.Domain.Message[]>([]);
    const [verified, setVerified] = useState<{ [key: string]: boolean | null }>({});
    const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
    const [errors, setErrors] = useState<{ [key: string]: Error | null }>({});
    const [busy, setBusy] = useState(false);
    
    const { receivedMessages } = useMessages();
    const { verifyPresentation, agent, state: agentState } = useVerifier();

    useEffect(() => {
        const presentations = receivedMessages.filter(({ piuri }) => piuri === SDK.ProtocolType.DidcommPresentation);
        setPresentations(presentations);
    }, [receivedMessages]);

    const handleVerifyPresentation = useCallback(async (presentation: SDK.Domain.Message) => {
        if (!agent || agentState !== SDK.Domain.Startable.State.RUNNING) {
            throw new Error("Agent not running");
        }
        
        try {
            setVerifying(prev => ({ ...prev, [presentation.uuid]: true }));
            setErrors(prev => ({ ...prev, [presentation.uuid]: null }));
            
            const verify = await verifyPresentation(presentation);
            setVerified(prev => ({ ...prev, [presentation.uuid]: verify }));
        } catch (error) {
            setErrors(prev => ({ ...prev, [presentation.uuid]: error as Error }));
            setVerified(prev => ({ ...prev, [presentation.uuid]: false }));
        } finally {
            setVerifying(prev => ({ ...prev, [presentation.uuid]: false }));
        }
    }, [agent, agentState, verifyPresentation]);

    return (
        <div className="space-y-6">
            <Flowchart stepType="presentationVerify" />
            
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Verify Presentations</h2>
                <p className="text-slate-600 text-sm mb-6">
                    Verify received presentations to ensure their authenticity and validity. Click the verify button next to each presentation to validate it.
                </p>

                <ExistingPresentations
                    presentations={presentations}
                    onVerifyPresentation={handleVerifyPresentation}
                    busy={busy}
                    verified={verified}
                    verifying={verifying}
                    errors={errors}
                />
            </div>
        </div>
    );
}

const step: Step = {
    type: "verifier",
    title: "Verify Presentation",
    description: "Verify received presentations to ensure their authenticity and validity",
    content: VerifyPresentation
}

export default step;