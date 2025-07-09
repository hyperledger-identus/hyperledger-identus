'use client';
import React, { createContext, useContext, useState } from "react";
import { MeshProvider } from "@meshsdk/react";
import { Store } from "@/types";


type WorkshopContextType = Store & {
    setStore: (store: Partial<Store>) => void;
}
const WorkshopContext = createContext<WorkshopContextType| undefined>(undefined);

export function useWorkshop() {
    const context = useContext(WorkshopContext);
    if (!context) {
        throw new Error('useWorkshop must be used within a WorkshopProvider');
    }
    return context;
}   

function WorkshopProvider({ children }: { children: React.ReactNode }) {
    const [store, setStore] = useState<Store>({} as Store);
    return <WorkshopContext.Provider value={{ ...store, setStore: (store) => setStore((prev) => ({ ...prev, ...store })) }}>
        {children}
    </WorkshopContext.Provider>
}

function App({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
    return <MeshProvider>
        <WorkshopProvider>
            <Component {...pageProps} />
        </WorkshopProvider>
    </MeshProvider>;
}

export default App;