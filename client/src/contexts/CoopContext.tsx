import React, { createContext, useContext, useState, ReactNode } from "react";
import { CoopBlueprint } from "@shared/types";

interface CoopContextValue {
  blueprint: CoopBlueprint | null;
  setBlueprint: (blueprint: CoopBlueprint | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CoopContext = createContext<CoopContextValue | undefined>(undefined);

export function CoopProvider({ children }: { children: ReactNode }) {
  const [blueprint, setBlueprint] = useState<CoopBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("3d-view");

  return (
    <CoopContext.Provider value={{
      blueprint,
      setBlueprint,
      isLoading,
      setIsLoading,
      activeTab,
      setActiveTab
    }}>
      {children}
    </CoopContext.Provider>
  );
}

export function useCoopContext() {
  const context = useContext(CoopContext);
  if (context === undefined) {
    throw new Error("useCoopContext must be used within a CoopProvider");
  }
  return context;
}
