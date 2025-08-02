import { useAgent, useDatabase, useMessages } from "@trust0/identus-react/hooks";
import { PaperAirplaneIcon, InboxIcon } from "@heroicons/react/24/outline";
import SDK from "@hyperledger/identus-sdk";

export function Status({ type }: { type: string }) {
    const { state: agentState } = useAgent();
    const { receivedMessages, sentMessages } = useMessages();
    
    // Determine status circle color based on agent state
    const getStatusColor = () => {
        if (agentState === SDK.Domain.Startable.State.RUNNING) {
            return "bg-green-500";
        } else if (agentState === SDK.Domain.Startable.State.STARTING) {
            return "bg-yellow-500";
        } else if (agentState === SDK.Domain.Startable.State.STOPPING) {
            return "bg-orange-500";
        } else {
            return "bg-red-500";
        }
    };
    
    // Get human-readable status text
    const getStatusText = () => {
        if (agentState === SDK.Domain.Startable.State.RUNNING) {
            return "Running";
        } else if (agentState === SDK.Domain.Startable.State.STARTING) {
            return "Starting";
        } else if (agentState === SDK.Domain.Startable.State.STOPPING) {
            return "Stopping";
        } else {
            return "Stopped";
        }
    };
    
    return (
        <div className="flex items-center space-x-4">
            {/* Agent Status */}
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <span className="text-sm font-medium text-slate-700">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Agent
                </span>
                <span className="text-sm text-slate-500">
                    {getStatusText()}
                </span>
            </div>
            
            {/* Messages */}
            <div className="flex items-center space-x-4">
                {/* Received Messages */}
                <div className="flex items-center space-x-1">
                    <InboxIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-600">{receivedMessages.length}</span>
                </div>
                
                {/* Sent Messages */}
                <div className="flex items-center space-x-1">
                    <PaperAirplaneIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-slate-600">{sentMessages.length}</span>
                </div>
            </div>
        </div>
    );
}