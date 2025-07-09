
import React, { useState, useEffect } from "react";
import { CodeBlock } from "@/types";
import dynamic from "next/dynamic";

const CodeComponent = dynamic(() => import('@/components/core/CodeEditor').then((e) => e.CodeComponent), {
    ssr: false,
});

export interface CodesProps {
    codes: { [key: string]: CodeBlock };
}

export const Codes: React.FC<CodesProps> = ({ codes }) => {
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [selectedCode, setSelectedCode] = useState<CodeBlock>(Object.values(codes)[0]);
    const [selectedLabel, setSelectedLabel] = useState<string>(Object.keys(codes)[0]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsCodeModalOpen(false);
            }
        };

        if (isCodeModalOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isCodeModalOpen]);
    
    const openCodeModal = (label: string, code: CodeBlock) => {
        setSelectedLabel(label);
        setSelectedCode(code);
        setIsCodeModalOpen(true);
    };
    
    const closeCodeModal = () => {
        setIsCodeModalOpen(false);
    };
    
    const codeKeys = Object.keys(codes);
    
    if (codeKeys.length === 0) {
        return null;
    }
    
    return (
        <>
            <div className="flex flex-wrap gap-3 mt-4">
                {codeKeys.map((key) => (
                    <button
                        key={key}
                        className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        onClick={() => openCodeModal(key, codes[key])}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            {key}
                        </span>
                    </button>
                ))}
            </div>
            
            {/* Code Modal */}
            {isCodeModalOpen && selectedCode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                {selectedLabel}
                            </h2>
                            <button
                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                onClick={closeCodeModal}
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            <CodeComponent content={selectedCode} />
                        </div>
                        
                        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                            <p className="text-xs text-slate-500 text-center">Press ESC to close</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};