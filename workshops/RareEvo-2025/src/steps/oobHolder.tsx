
import {  Step } from "@/types";
import React, { useEffect, useState } from "react";
import SDK from '@hyperledger/identus-sdk';
import { useDatabase, useHolder, useMessages } from "@trust0/identus-react/hooks";
import { useWorkshop } from "@/pages/_app";
import { CredentialOffer } from "@/components/CredentialOffer";




const step: Step = {
    type: 'holder',
    disableCondition: (store) =>  !store.holderAccepted,
    title: 'Accept Credential Offer',
    description: 'Switch to the holder perspective to process the Out-of-Band credential offer. Parse the OOB invitation, review the credential details, and accept the offer to initiate the credential request process.',
    content() {
        const {
            setStore,
            ...store
        } = useWorkshop();   
        
        const  { sentMessages, receivedMessages, load: loadMessages } = useMessages();
        const { pluto } = useDatabase();
        const { parseOOBOffer, state:agentState, agent } = useHolder();
        const [hasCheckedOOB, setHasCheckedOOB] = useState(false);
        const [credentialOffers, setCredentialOffers] = useState<SDK.Domain.Message[]>([]);

        useEffect(() => {
            const credentialOffers = receivedMessages.filter(({ piuri }) => piuri === SDK.ProtocolType.DidcommOfferCredential);
            const credentialRequests = sentMessages.filter(({ piuri }) => piuri === SDK.ProtocolType.DidcommRequestCredential);
            const pendingOffers = credentialOffers
            setCredentialOffers((prev) => {
                return [
                    ...prev.filter(({ id:prevId }) => !pendingOffers.some(({ id:offerId }) => prevId === offerId)),
                    ...pendingOffers,
                ].filter(({ thid:offerThid }) => !credentialRequests.some(({ thid:requestThid }) => offerThid === requestThid));
            });
        }, [sentMessages, receivedMessages])

        useEffect(() => {
            if(agent && agentState === SDK.Domain.Startable.State.RUNNING) {
                const url = new URL(store.issuerRequestOOB ?? window.location);
                const oob = url.searchParams.get('oob');
                if (store.issuerRequestOOB && oob) {
                    setStore({ issuerRequestOOB: undefined })
                    parseOOBOffer(store.issuerRequestOOB).then((message) => {
                        setCredentialOffers((prev) => [...prev, message]);
                    })
                } 
            }
        }, [agentState, store, parseOOBOffer, setStore, agent, loadMessages])

        if (credentialOffers.length === 0) {
            return <div>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Waiting to scan OOB Link</span>
                </div>
                <p className="text-sm text-slate-600">
                    TIP: Choose the OOB link from the previous step.
                </p>
            </div>
        </div>;
        }

        return <div>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Pending Credential Offers</span>
                </div>
                {credentialOffers.map((offer) => (
                        <CredentialOffer key={offer.id} credentialOffer={offer} />
                    ))}
            </div>
        </div>
    }
}

export default step;