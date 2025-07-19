
import { Step } from "@/types";
import React from "react";
import { useCredentials } from "@trust0/identus-react/hooks";
import { CompactCredentials } from "@/components/core/CompactCredentials";
import dynamic from "next/dynamic";

const Flowchart = dynamic(() => import("@/components/core/Flowchart"), { ssr: false });

const step: Step = {
    type: 'holder',
    title: 'Receive & Store Credential',
    description: 'Complete the credential issuance flow from the holder perspective. Automatically receive the issued SD-JWT credential, validate its authenticity, and store it securely in the holder\'s digital wallet.',
    content() {
        const { credentials } = useCredentials();
        return (
            <div>
                <Flowchart stepType="credentials" />
                <CompactCredentials credentials={credentials} />
            </div>
        );
    }
}

export default step;