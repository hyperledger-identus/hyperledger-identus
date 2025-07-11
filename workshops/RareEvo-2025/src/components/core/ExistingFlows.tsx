import { FlowCard } from "./FlowCard";
import { Request } from "@/types";

// Existing Flows Component
export const ExistingFlows = ({
    flows,
    selectedFlowId,
    onSelectFlow,
    onCreateNew,
    busy,
}: {
    flows: Request[];
    busy: boolean;
    selectedFlowId?: string;
    onSelectFlow: (flow: Request) => void;
    onCreateNew: () => void;
}) => {
    if (flows.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Issuance Flows Yet</h3>
                <p className="text-slate-600 mb-4">Create your first issuance flow to get started</p>
                <button
                    disabled={busy}
                    onClick={onCreateNew}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Create Your First Flow
                </button>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {flows.map((flow, index) => (
                <FlowCard
                    isSelected={selectedFlowId === flow.id}
                    key={flow.id}
                    flow={flow}
                    index={index}
                    busy={busy}
                    onSelect={(flow) => {
                        onSelectFlow(flow);
                    }}
                />
            ))}
        </div>
    );
};