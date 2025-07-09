import SDK from "@hyperledger/identus-sdk";
import { useCallback, useEffect, useState } from "react";
import { useVerifier } from "@trust0/identus-react/hooks";
import { Step } from "@/types";
import OOBCode from "@/components/core/OOBCode";
import { useWorkshop } from "@/pages/_app";

const PresentationRequest = () => {
    const { setStore } = useWorkshop()
    const { issueOOBPresentationRequest, agent } = useVerifier();
    const [presentationClaims, setPresentationClaims] = useState<SDK.Domain.PresentationClaims>({} as SDK.Domain.PresentationClaims);
    const [requiredFields, setRequiredFields] = useState<string>("emailAddress=test@email.com")
    const [trustIssuers, setTrustIssuers] = useState<string>("did:prism:a0209ebd691c5ec20636f206b3e101c726fdc1c22b9b850b4b811ac4a82e28d8")
    const [code, setCode] = useState<string>("")
    
    const onHandleInitiate = useCallback(async ()=> {
        if (!agent) {
            throw new Error("Start agent first")
        }
        const code = await issueOOBPresentationRequest(
            SDK.Domain.CredentialType.SDJWT,
            presentationClaims
        )
        setCode(`${window.location.href}?oob=${code}`)
        setStore({ verifierRequestOOB: `${window.location.href}?oob=${code}` })  
    }, [presentationClaims, agent, issueOOBPresentationRequest, setStore])

    useEffect(() => {
        const claims = requiredFields.split(",").reduce((all, requiredField) => {
            const [varName, varValue] = requiredField.split("=");
            if (typeof varValue === "string") {
                all[varName] = {
                    type: 'string',
                    pattern: varValue
                }
            } else {
                all[varName] = {
                    type: 'string',
                    value: varValue
                }
            }
            return all
        }, {})
        setPresentationClaims({claims})
    }, [requiredFields, setPresentationClaims])
    
    return <div>
        <label htmlFor="requiredJWTClaims">Required claims<span style={{ fontSize: 11 }}>(variable=value split by ,)</span></label>
        <input
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="requiredJWTClaims"
            type="text"
            value={requiredFields}
            onChange={(e) => { setRequiredFields(e.target.value) }}
        />
        <label htmlFor="issuedByJWT">Issuer</label>
        <input
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="issuedByJWT"
            type="text"
            value={trustIssuers}
            onChange={(e) => { setTrustIssuers(e.target.value) }}
        />
        <button
            className="my-5 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            style={{ width: 120 }}
            onClick={onHandleInitiate}>
            Initiate
        </button>
        {code && <OOBCode code={code} type="presentation" />}

    </div>
}

const step: Step = {
    type: "verifier",
    title: "Create OOB Presentation Request",
    description: "",
    content: PresentationRequest
}

export default step;