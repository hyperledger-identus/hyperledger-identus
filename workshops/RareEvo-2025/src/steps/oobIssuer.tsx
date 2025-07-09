
import { Step } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { useDatabase, useIssuer } from "@trust0/identus-react/hooks";
import SDK from "@hyperledger/identus-sdk";
import OOBCode from "@/components/core/OOBCode";
import { TabNavigation } from "@/components/core/TabNavigation";
import { Request } from "@/types";
import { ExistingFlows } from "@/components/core/ExistingFlows";
import { CreateFlowForm } from "@/components/core/CreateFlowForm";
import { useWorkshop } from "@/pages/_app";

const step: Step = {
    type: 'issuer',
    disableCondition: (store) => !store.issuerRequest || !store.issuerRequestOOB,
    title: 'Generate Out-of-Band Credential Offer',
    description: 'Create an Out-of-Band (OOB) credential offer for SD-JWT credentials. Configure claims, select issuing DIDs, and generate shareable URLs that holders can use to initiate the credential issuance process.',
    content() {
        const {
            setStore,
            ...store
        } = useWorkshop();
        const { getOOBURL, state: agentState } = useIssuer();
        const [issuanceFlows, setIssuanceFlows] = useState<Request[]>([]);
        const { getIssuanceFlows, state: dbState } = useDatabase();
        const [activeTab, setActiveTab] = useState<'existing' | 'create'>('existing');
        const [busy, setBusy] = useState(false);
        const [oobUrl, setOobUrl] = useState<string | null>(null);
        const [oobFlow, setOobFlow] = useState<Request | null>(null);
        
        useEffect(() => {
            async function loadIssuanceFlows() {
                const flows = await getIssuanceFlows();
                setIssuanceFlows(flows);
            }
            if (dbState === "loaded") {
                loadIssuanceFlows();
            }
        }, [dbState, getIssuanceFlows]);

        const handleSelectFlow = useCallback(async (flow: Request) => {
            if (agentState === SDK.Domain.Startable.State.RUNNING) {
                try {
                    setBusy(true);
                    const oob = await getOOBURL(flow);
                    if (!oob) return;
                    setOobUrl(oob);
                    setOobFlow(flow);
                    setBusy(false);
                    setStore({
                        issuerRequest: flow,
                        issuerRequestOOB: oob
                    });
                } catch {
                    setBusy(false);
                }
            }
        }, [agentState, getOOBURL, setStore]);

        const onCreate = useCallback(async (issuerRequest: Request) => {
            setIssuanceFlows([...issuanceFlows, issuerRequest]);
            setActiveTab('existing');
        }, [issuanceFlows, setIssuanceFlows, setActiveTab]);

        return (
            <div>

                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    flowsCount={issuanceFlows.length}
                />
                {activeTab === 'existing' && (
                    <div className="mt-4 space-y-4">
                        <ExistingFlows
                            busy={busy}
                            flows={issuanceFlows}
                            selectedFlowId={oobFlow?.id}
                            onSelectFlow={handleSelectFlow}
                            onCreateNew={() => setActiveTab('create')}
                        />
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="space-y-6">
                        <CreateFlowForm
                            onCreate={onCreate}
                            onBackToExisting={() => setActiveTab('existing')}
                        />
                    </div>
                )}

                {store.issuerRequestOOB &&
                    <OOBCode code={store.issuerRequestOOB} type="offer" />
                }

            </div>
        );
    }
}

export default step;