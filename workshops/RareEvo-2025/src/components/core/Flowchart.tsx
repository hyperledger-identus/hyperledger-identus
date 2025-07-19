'use client';

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import Image from "next/image";

// Define a type for the stepType prop
type StepType = 'introduction' | 'did' | 'oobIssuer' | 'oobHolder' | 'issuance' | 'credentials' | 'presentationRequest' | 'present' | 'presentationVerify';

interface FlowchartProps {
  stepType: StepType;
}

const Flowchart = ({ stepType }: FlowchartProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: "#ADD8E6", // light blue
        secondaryColor: "#9370DB", // purple
        tertiaryColor: "#90EE90", // light green
        success: "#228B22", // green
      },
      // Add configuration for full width rendering
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      }
    });
  }, []);

  // Re-render diagram when stepType changes
  useEffect(() => {
    if (mermaidRef.current) {
      const renderDiagram = async () => {
        const diagram = getDiagram(stepType);
        if (diagram) {
          // Clear existing content
          mermaidRef.current!.innerHTML = '';
          
          // Generate unique ID for this diagram
          const diagramId = `mermaid-${stepType}-${Date.now()}`;
          
          try {
            // Render the new diagram
            const { svg } = await mermaid.render(diagramId, diagram);
            mermaidRef.current!.innerHTML = svg;
            
            // Ensure SVG fills the container width
            const svgElement = mermaidRef.current!.querySelector('svg');
            if (svgElement) {
              svgElement.style.width = '100%';
              svgElement.style.height = 'auto';
              svgElement.removeAttribute('width');
              svgElement.removeAttribute('height');
            }
          } catch (error) {
            console.error('Error rendering mermaid diagram:', error);
            // Fallback: set innerHTML directly and let mermaid process it
            mermaidRef.current!.innerHTML = diagram;
            mermaid.contentLoaded();
            
            // Apply the same SVG styling for fallback
            setTimeout(() => {
              const svgElement = mermaidRef.current!.querySelector('svg');
              if (svgElement) {
                svgElement.style.width = '100%';
                svgElement.style.height = 'auto';
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');
              }
            }, 100);
          }
        }
      };

      renderDiagram();
    }
  }, [stepType]);

  // Define different diagrams based on stepType
  const getDiagram = (step: StepType) => {
    switch (step) {
      case 'introduction':
        return `
        graph LR
          Issuer[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Issuer"/> Issuer] -- "Publish Prism DID (DID document to chain via Lace Wallet)" --> Blockchain[<img src="/cardano-ada-logo.webp" height="20" style="vertical-align:middle" alt="Blockchain"/> Cardano Blockchain]
          Issuer -- "Send OOB Credential Offer (QR/URL for SD-JWT)" --> Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder]
          Holder -- "Send Credential Request" --> Issuer
          Issuer -- "Approve and Issue Credential" --> Holder
          Verifier[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Verifier"/> Verifier] -- "Send Presentation Request (QR/URL for SD-JWT)" --> Holder
          Holder -- "Present Verifiable Presentation (select and send credential)" --> Verifier
          Verifier -- "Resolve Issuer's Prism DID and Verify (DID resolution on Cardano)" --> Blockchain

          style Issuer fill:none,stroke:#ccc,stroke-width:2px
          style Blockchain fill:none,stroke:#ccc,stroke-width:2px,color:#000
          style Holder fill:none,stroke:#ccc,stroke-width:2px
          style Verifier fill:none,stroke:#ccc,stroke-width:2px,color:#000
        `;
      case 'did':
        return `
        graph LR
          Issuer[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Issuer"/> Issuer] -- "Create and Publish Prism DID (DID document to chain via Lace Wallet)" --> Blockchain[<img src="/cardano-ada-logo.webp" height="20" style="vertical-align:middle" alt="Blockchain"/> Cardano Blockchain]

          style Issuer fill:none,stroke:#ccc,stroke-width:2px
          style Blockchain fill:none,stroke:#ccc,stroke-width:2px,color:#000
        `;
      case 'oobIssuer':
        return `
        graph LR
          Issuer[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Issuer"/> Issuer] -- "Send OOB Credential Offer (QR/URL for SD-JWT)" --> Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder]

          style Issuer fill:none,stroke:#ccc,stroke-width:2px
          style Holder fill:none,stroke:#ccc,stroke-width:2px
        `;
      case 'oobHolder':
        return `
        graph LR
          Issuer[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Issuer"/> Issuer] -- "Send OOB Credential Offer (QR/URL for SD-JWT)" --> Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder]
          Holder -- "Send Credential Request" --> Issuer

          style Issuer fill:none,stroke:#ccc,stroke-width:2px
          style Holder fill:none,stroke:#ccc,stroke-width:2px
        `;
      case 'issuance':
        return `
        graph LR
          Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder] -- "Send Credential Request" --> Issuer[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Issuer"/> Issuer]
          Issuer -- "Approve and Issue Credential" --> Holder

          style Issuer fill:none,stroke:#ccc,stroke-width:2px
          style Holder fill:none,stroke:#ccc,stroke-width:2px
        `;
      case 'credentials':
        return `
        graph LR
          Issuer[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Issuer"/> Issuer] -- "Approve and Issue Credential" --> Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder]

          style Issuer fill:none,stroke:#ccc,stroke-width:2px
          style Holder fill:none,stroke:#ccc,stroke-width:2px
        `;
      case 'presentationRequest':
        return `
        graph LR
          Verifier[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Verifier"/> Verifier] -- "Send Presentation Request (QR/URL for SD-JWT)" --> Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder]

          style Verifier fill:none,stroke:#ccc,stroke-width:2px,color:#000
          style Holder fill:none,stroke:#ccc,stroke-width:2px
        `;
      case 'present':
        return `
        graph LR
          Verifier[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Verifier"/> Verifier] -- "Send Presentation Request (QR/URL for SD-JWT)" --> Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder]
          Holder -- "Present Verifiable Presentation (select and send credential)" --> Verifier

          style Verifier fill:none,stroke:#ccc,stroke-width:2px,color:#000
          style Holder fill:none,stroke:#ccc,stroke-width:2px
        `;
      case 'presentationVerify':
        return `
        graph LR
          Holder[<img src="/lace.svg" height="20" style="vertical-align:middle" alt="Holder"/> Holder] -- "Present Verifiable Presentation (select and send credential)" --> Verifier[<img src="/identus-logo.svg" height="20" style="vertical-align:middle" alt="Verifier"/> Verifier]
          Verifier -- "Resolve Issuer's Prism DID and Verify (DID resolution on Cardano)" --> Blockchain[<img src="/cardano-ada-logo.webp" height="20" style="vertical-align:middle" alt="Blockchain"/> Cardano Blockchain]

          style Holder fill:none,stroke:#ccc,stroke-width:2px
          style Verifier fill:none,stroke:#ccc,stroke-width:2px,color:#000
          style Blockchain fill:none,stroke:#ccc,stroke-width:2px,color:#000
        `;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 w-full">
      <div 
        className="mermaid w-full mb-8" 
        ref={mermaidRef}
        style={{ 
          width: '100%',
          overflow: 'hidden'
        }}
      >
      </div>
    </div>
  );
};

export default Flowchart; 