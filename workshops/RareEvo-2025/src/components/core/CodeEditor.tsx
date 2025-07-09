'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { CodeBlock } from '@/types';

export const CodeComponent: React.FC<{ content: CodeBlock }> = ({ content }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const showCopyButton = content.showCopyButton !== false; // Default to true unless explicitly set to false

    return (
        <div className="relative mb-6">
            <SyntaxHighlighter
                language={content.language || 'javascript'}
                style={oneDark}
                showLineNumbers
                customStyle={{
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    backgroundColor: '#1e293b',
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                    border: '1px solid #334155',
                }}
                lineNumberStyle={{ 
                    color: '#64748b',
                    paddingRight: '1rem',
                    minWidth: '2.5rem'
                }}
            >
                {content.code}
            </SyntaxHighlighter>
            {showCopyButton && (
                <button
                    onClick={() => copyToClipboard(content.code)}
                    className="absolute top-4 right-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4 mr-2" /> 
                            <span className="text-sm">Copied!</span>
                        </>
                    ) : (
                        <>
                            <ClipboardCopyIcon className="w-4 h-4 mr-2" /> 
                            <span className="text-sm">Copy</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};