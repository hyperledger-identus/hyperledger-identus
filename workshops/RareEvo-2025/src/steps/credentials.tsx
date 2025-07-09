
import { Step } from "@/types";
import React from "react";
import { useCredentials } from "@trust0/identus-react/hooks";
import { Credential } from "@/components/Credential";

const step: Step = {
    type: 'holder',
    title: 'Receive & Store Credential',
    description: 'Complete the credential issuance flow from the holder perspective. Automatically receive the issued SD-JWT credential, validate its authenticity, and store it securely in the holder\'s digital wallet.',
    content() {
        const { credentials } = useCredentials();
        return credentials.map((credential, index) => (
            <div key={index} className="my-2 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                <Credential credential={credential} />
            </div>
        ))
    }
}

export default step;