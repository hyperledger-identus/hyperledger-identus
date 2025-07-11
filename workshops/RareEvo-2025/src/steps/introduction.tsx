/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */

import { Step } from "@/types";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const CodeComponent = dynamic(() => import('@/components/core/CodeEditor').then((e) => e.CodeComponent), {
    ssr: false,
});
const step: Step = {
    type: 'issuer',
    disableCondition: (store) => !store.issuerStarted,
    title: '',
    description: '',
    content() {
        return <div>
            <div className="prose prose-slate max-w-none">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1">
                        <Image 
                            src="/identus-logo.svg" 
                            alt="Hyperledger Identus Logo" 
                            width={400}
                            height={120}
                            style={{objectFit:'contain', height:120, width:'100%'}}
                        />
                    </div>
                    <div className="flex-1">
                        <Image 
                            src="/rareEvo.png"
                            alt="RareEvo Conference Logo" 
                            width={400}
                            height={120}
                            style={{objectFit:'contain', height:120, width:'100%'}}
                        />
                    </div>
                </div>

                <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        RareEvo 2025
                    </h2>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Build Decentralized Identity Applications
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Master the complete verifiable credential ecosystem using Hyperledger Identus SDK, TypeScript, and React.
                    </p>
                    
                    <p className="text-base text-slate-600 leading-relaxed">
                        In this hands-on workshop, you'll build three interconnected agents that form the foundation of decentralized identity: an <strong>Issuer</strong>, a <strong>Holder</strong>, and a <strong>Verifier</strong>. By the end, you'll have a fully functional identity ecosystem running on Cardano.
                    </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-6">What You'll Learn & Build</h3>

                <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">⚙️</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Agent Setup & Configuration</h4>
                            <p className="text-sm text-slate-600">Create and configure Identus agents with proper initialization and startup procedures.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">🆔</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Decentralized Identity (DID) Management</h4>
                            <p className="text-sm text-slate-600">Create PRISM DIDs and publish them on-chain using Lace Wallet integration.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">📜</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Credential Issuance</h4>
                            <p className="text-sm text-slate-600">Implement the complete credential issuance flow from schema creation to credential delivery.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-sm">📱</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Holder Workflows</h4>
                            <p className="text-sm text-slate-600">Build holder functionality to receive, review, accept credential offers, and manage personal credentials.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-semibold text-sm">✅</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Verification & Validation</h4>
                            <p className="text-sm text-slate-600">Create a verifier that requests and validates credential presentations, completing the trust triangle.</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">🛠️ Tech Stack</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Identus SDK <Link target="_blank" className="text-blue-500" href="https://hyperledger-identus.github.io/docs/sdk-ts/sdk/">[DOCS]</Link></li>
                            <li>• Identus Mediator <Link target="_blank" className="text-blue-500" href="https://hyperledger-identus.github.io/docs/home/identus/mediator">[DOCS]</Link></li>
                            <li>• @trust0/identus-store <Link target="_blank" className="text-blue-500" href="https://trust0.id/identus/@trust0/identus-store/README.md">[DOCS]</Link></li>
                            <li>• @trust0/identus-react <Link target="_blank" className="text-blue-500" href="https://trust0.id/identus/@trust0/identus-react/README.md">[DOCS]</Link></li>
                        </ul>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                        <h4 className="font-semibold text-emerald-900 mb-2">🎯 Learning Outcome</h4>
                        <p className="text-sm text-emerald-800">
                            Build decentralized identity applications with the Identus SDK in Typescript.
                        </p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                    <p className="text-base font-medium text-slate-900 mb-2">
                        🚀 Ready to get started?
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                        This workshop requires two main components: the workshop application and a local Identus Mediator. Follow these steps to set up your development environment.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">📋 Step 1: Clone the Repository</h4>
                            <p className="text-sm text-slate-600 mb-2">
                                Clone the main Identus repository that contains this workshop:
                            </p>
                            <CodeComponent content={{
                                language: 'bash',
                                code: `git clone https://github.com/hyperledger/identus.git`,
                                showCopyButton: false
                            }} />
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">🏗️ Step 2: Set Up the Workshop</h4>
                            <p className="text-sm text-slate-600 mb-2">
                                Navigate to the workshop directory and install dependencies:
                            </p>
                            <CodeComponent content={{
                                language: 'bash',
                                code: `cd identus/workshops/RareEvo-2025
yarn install`,
                                showCopyButton: false
                            }} />
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">🔧 Step 3: Start the Local Mediator</h4>
                            <p className="text-sm text-slate-600 mb-2">
                                The workshop uses a local <Link target="_blank" className="text-blue-500 hover:underline" href="https://github.com/hyperledger/identus-mediator">Hyperledger Identus Mediator</Link> for DIDComm messaging. Start it using Docker Compose:
                            </p>
                            <p className="text-sm text-slate-600 mb-2">
                                If you want to use a different mediator (not local one we provide), you will need to configure MEDIATOR_DID, skip this step and use the Mediator of your choice.
                            </p>
                            <CodeComponent content={{
                                language: 'bash',
                                code: `# Make sure you're in the workshop directory
git@github.com:hyperledger-identus/mediator.git

# Start the mediator and its dependencies
docker compose up -d`,
                                showCopyButton: false
                            }} />
                            <p className="text-xs text-slate-500 mt-1">
                                💡 The mediator will be available at <code className="bg-slate-200 px-1 rounded">http://localhost:8080</code>
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">🌐 Step 4: (optional) Configure the environment variables</h4>
                            <p className="text-sm text-slate-600 mb-2">
                                Create .env file inside the workshop directory and configure the env variables.
                            </p>
                            <p className="text-sm text-slate-600 mb-2">
                                If you want to publish DIDs on-chain in mainnet, you will need to configure BLOCKFROST_KEY and RESOLVER_URL.
                            </p>
                            <p className="text-sm text-slate-600 mb-2">
                                If you want to use a different mediator (not local one we provide), you will need to configure MEDIATOR_DID.
                            </p>
                            <CodeComponent content={{
                                language: 'bash',
                                code: `# Optional PeerDID, required if u want to use a different mediator (not local one we provide)
# NEXT_PUBLIC_MEDIATOR_DID=
# Optional, used to fetch public Cardano network data + required if publishing DIDS wants to be used
# NEXT_PUBLIC_BLOCKFROST_KEY=
# Optional, required only to resolve DIDS written onchain in mainnet and requires a PrismDID universal resolver endpoint
# NEXT_PUBLIC_RESOLVER_URL=`,
                                showCopyButton: false
                            }} />
                            <p className="text-xs text-slate-500 mt-1">
                                🎉 The workshop will be running at <Link target="_blank" className="text-blue-500 hover:underline" href="http://localhost:3000">http://localhost:3000</Link>
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">🌐 Step 4: Launch the Workshop</h4>
                            <p className="text-sm text-slate-600 mb-2">
                                Start the development server to begin the workshop:
                            </p>
                            <CodeComponent content={{
                                language: 'bash',
                                code: `yarn dev`,
                                showCopyButton: false
                            }} />
                            <p className="text-xs text-slate-500 mt-1">
                                🎉 The workshop will be running at <Link target="_blank" className="text-blue-500 hover:underline" href="http://localhost:3000">http://localhost:3000</Link>
                            </p>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">🔍 Verification</h4>
                            <p className="text-xs text-blue-800 mb-2">
                                Before proceeding, verify that both services are running:
                            </p>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>• Workshop: <Link target="_blank" className="text-blue-600 hover:underline" href="http://localhost:3000">http://localhost:3000</Link></li>
                                <li>• Mediator: <Link target="_blank" className="text-blue-600 hover:underline" href="http://localhost:8080">http://localhost:8080</Link></li>
                            </ul>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <h4 className="text-sm font-semibold text-amber-900 mb-2">⚠️ Prerequisites</h4>
                            <ul className="text-xs text-amber-800 space-y-1">
                                <li>• Docker and Docker Compose installed</li>
                                <li>• Node.js LTS (≥20.x) and Yarn</li>
                                <li>• <Link target="_blank" className="text-amber-600 hover:underline" href="https://www.lace.io/">Lace Wallet</Link> browser extension (for DID publishing)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default step;