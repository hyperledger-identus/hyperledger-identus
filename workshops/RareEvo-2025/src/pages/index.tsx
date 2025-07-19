'use client';

import React, { useCallback, useEffect, useState } from "react";
import '../app/index.css';
import { ContentItem, Store } from "@/types";
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
import Scroll from "@/components/core/Scroll";

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

  const defaultContent: ContentItem[] = [
    {
      name: 'Hyperledger Identus & RareEvo',
      type: introduction.type,
      content: <WithContext context={issuerContext}>
      <StepComponent step={introduction}  />
    </WithContext>
    },
    {
      name: 'Prism DID Create / Publish',
      type: did.type,
      content: <WithContext context={issuerContext}>
      <StepComponent step={did}  />
    </WithContext>
    },
    {
      name: 'OOB Issuer',
      type: oobIssuer.type,
      content: <WithContext context={issuerContext}>
      <StepComponent step={oobIssuer}  />
    </WithContext>
    },
    {
      name: 'OOB Holder',
      type: oobHolder.type,
      content: <WithContext context={holderContext}>
      <StepComponent step={oobHolder}  />
    </WithContext>
    },
    {
      name: 'Issuance',
      type: issuance.type,
      content: <WithContext context={issuerContext}>
      <StepComponent step={issuance}  />
    </WithContext>
    },
    {
      name: 'Credentials',
      type: credentials.type,
      content: <WithContext context={holderContext}>
      <StepComponent step={credentials}  />
    </WithContext>
    },
    {
      name: 'Presentation Request',
      type: presentationRequest.type,
      content: <WithContext context={verifierContext}>
      <StepComponent step={presentationRequest}  />
    </WithContext>
    },
    {
      name: 'Present',
      type: present.type,
      content: <WithContext context={holderContext}>
      <StepComponent step={present}  />
    </WithContext>
    },
    {
      name: 'Presentation Verify',
      type: presentationVerify.type,
      content: <WithContext context={verifierContext}>
      <StepComponent step={presentationVerify}  />
    </WithContext>
    }
  ]

  return ready && <>
          <AgentProvider><HookConsumer callback={handleIssuerContextUpdate} /></AgentProvider>
          <AgentProvider><HookConsumer callback={handleHolderContextUpdate} /></AgentProvider>
          <AgentProvider><HookConsumer callback={handleVerifierContextUpdate} /></AgentProvider>
          
          <Scroll content={defaultContent} />
          {/* <WithContext context={issuerContext}>
            <StepComponent step={introduction}  />
            <StepComponent step={did}  />
            <StepComponent step={oobIssuer}  />
          </WithContext> */}
{/* 
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
          </WithContext>  */}
  </>
}
export default Home;
