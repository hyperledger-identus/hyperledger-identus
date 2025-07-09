



export const TabNavigation = ({
    activeTab,
    setActiveTab,
    flowsCount
}: {
    activeTab: 'existing' | 'create';
    setActiveTab: (tab: 'existing' | 'create') => void;
    flowsCount: number;
}) => (
    <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
            <button
                onClick={() => setActiveTab('existing')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'existing'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
            >
                Existing Flows ({flowsCount})
            </button>
            <button
                onClick={() => setActiveTab('create')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'create'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
            >
                Create New
            </button>
        </nav>
    </div>
);
