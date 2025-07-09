'use client';

import React, { useCallback, useEffect, useState } from "react";
import '../app/index.css';
import { Store } from "@/types";
import { AgentProvider } from "@trust0/identus-react";
import { StepComponent, WithContext } from "@/components/core/StepComponent";
import dynamic from "next/dynamic";
import { isEqualIgnoringFunctions } from "@/utils";
import introduction from "@/steps/introduction";
import did from "@/steps/did";
import oobIssuer from "@/steps/oobIssuer";
import credentials from "@/steps/credentials";
import issuance from "@/steps/issuance";
import oobHolder from "@/steps/oobHolder";
import presentationRequest from "@/steps/presentationRequest";
import present from "@/steps/present";
import presentationVerify from "@/steps/presentationVerify";

const HookConsumer = dynamic(() => import('@/components/core/HookConsumer').then((e) => e.HookConsumer), {
  ssr: false,
});



const Home: React.FC<{}> = (props) => {
  const [store, setStore] = useState<Store>({} as Store)
  const [ready, setReady] = useState(false)
  const [issuerContext, setIssuerContext] = useState<any>(null)
  const [holderContext, setHolderContext] = useState<any>(null)
  const [verifierContext, setVerifierContext] = useState<any>(null)
  
  // Memoize the callback functions to prevent infinite re-renders
  const handleIssuerContextUpdate = useCallback((ctx: any) => {
    if (!isEqualIgnoringFunctions(issuerContext, ctx)) {
      setIssuerContext(ctx)
    }
  }, [issuerContext])

  const handleHolderContextUpdate = useCallback((ctx: any) => {
    if (!isEqualIgnoringFunctions(holderContext, ctx)) {
      setHolderContext(ctx)
    }
  }, [holderContext])

  const handleVerifierContextUpdate = useCallback((ctx: any) => {
    if (!isEqualIgnoringFunctions(verifierContext, ctx)) {
      setVerifierContext(ctx)
    }
  }, [verifierContext])

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <div className="w-full p-8 font-sans bg-gray-50 min-h-screen">
      {
        ready && <>
          <AgentProvider>
            <HookConsumer callback={handleIssuerContextUpdate} />
          </AgentProvider>
          <AgentProvider>
            <HookConsumer callback={handleHolderContextUpdate} />
          </AgentProvider>
          <AgentProvider>
            <HookConsumer callback={handleVerifierContextUpdate} />
          </AgentProvider>
          
          <WithContext context={issuerContext}>
            <StepComponent step={introduction}  />
            <StepComponent step={did}  />
            <StepComponent step={oobIssuer}  />
          </WithContext>

          <WithContext context={holderContext}>
            <StepComponent step={oobHolder}  />
          </WithContext>

          <WithContext context={issuerContext}>
            <StepComponent step={issuance}  />
          </WithContext>

          <WithContext context={holderContext}>
            <StepComponent step={credentials}  />
          </WithContext>
          
          <WithContext context={verifierContext}>
            <StepComponent step={presentationRequest}  />
          </WithContext> 

          <WithContext context={holderContext}>
            <StepComponent step={present}  />
          </WithContext>

          <WithContext context={verifierContext}>
            <StepComponent step={presentationVerify}  />
          </WithContext> 
        </>
      }
    </div>
  )
}
export default Home;
