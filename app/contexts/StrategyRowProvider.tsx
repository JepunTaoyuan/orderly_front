import React, { createContext, useContext } from "react";
import type { UserGridStrategy } from "@/services/gridBot.client";

interface StrategyRowContextValue {
  strategy: UserGridStrategy;
  onStop: (session_id: string) => void;
  stopping: boolean;
}

const StrategyRowContext = createContext<StrategyRowContextValue | undefined>(
  undefined,
);

export const useStrategyRow = () => {
  const context = useContext(StrategyRowContext);
  if (!context) {
    throw new Error("useStrategyRow must be used within a StrategyRowProvider");
  }
  return context;
};

interface StrategyRowProviderProps {
  strategy: UserGridStrategy;
  onStop: (session_id: string) => void;
  stopping: boolean;
  children: React.ReactNode;
}

export const StrategyRowProvider: React.FC<StrategyRowProviderProps> = ({
  strategy,
  onStop,
  stopping,
  children,
}) => {
  const value = {
    strategy,
    onStop,
    stopping,
  };

  return (
    <StrategyRowContext.Provider value={value}>
      {children}
    </StrategyRowContext.Provider>
  );
};
