import { useAgent, useDatabase, useMessages } from "@trust0/identus-react/hooks";


export function Status() {
    const { state: agentState } = useAgent();
    const { state: dbState } = useDatabase();
    const { receivedMessages, sentMessages } = useMessages();
    return  <div className="flex space-x-2">
        <span className="text-sm text-slate-500">DB: {dbState}</span>
        <span className="text-sm text-slate-500">Agent: {agentState}</span>
        <span className="text-sm text-slate-500">Received: {receivedMessages.length}</span>
        <span className="text-sm text-slate-500">Sent: {sentMessages.length}</span>
    </div>
}