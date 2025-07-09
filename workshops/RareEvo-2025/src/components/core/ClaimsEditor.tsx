import { Claim } from "@/types";
import { useMemo } from "react";



export const ClaimsEditor = ({
    claims,
    onClaimChange,
}: {
    claims: Claim[];
    onClaimChange: (index: number, field: keyof Claim, value: string) => void;
}) => {
    const hasInvalidClaims = useMemo(() => {
        return claims.some(claim => claim.isValid === false);
    }, [claims]);
    return <div>
        <div className="flex items-center justify-between mb-4">
            <div>
                <h4 className="text-lg font-medium text-slate-900">Claims Configuration</h4>
                <p className="text-sm text-slate-600">Define the claims for this credential</p>
            </div>
        </div>

        <div className="space-y-3">
            {claims.map((claim, index) => (
                <div key={claim.id} className="flex gap-3 items-start p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Claim Name</label>
                        <input
                            type="text"
                            value={claim.name}
                            disabled
                            onChange={(e) => onClaimChange(index, "name", e.target.value)}
                            placeholder="e.g., name, age, location"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 ${claim.isValid === false
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-300'
                                }`}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Claim Value</label>
                        <input
                            type={claim.type === 'date' ? 'date' : claim.type === 'number' ? 'number' : 'text'}
                            value={claim.value}
                            onChange={(e) => onClaimChange(index, "value", e.target.value)}
                            placeholder="Enter value"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 ${claim.isValid === false
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-300'
                                }`}
                            required
                        />
                    </div>
                    <div className="w-24">
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
                        <select
                            disabled
                            value={claim.type}
                            onChange={(e) => onClaimChange(index, "type", e.target.value)}
                            className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 text-sm"
                        >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="date">Date</option>
                        </select>
                    </div>

                </div>
            ))}
        </div>

        {hasInvalidClaims && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-600">
                        Please fill in all claim names and values before submitting.
                    </span>
                </div>
            </div>
        )}
    </div>
};