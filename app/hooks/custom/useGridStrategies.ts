import { useEffect } from "react";
import { useGridStrategiesGlobal } from "@/contexts/GridStrategiesContext";
import type { ProfitReport } from "@/services/gridBot.client";

/**
 * @deprecated Use useGridStrategiesGlobal instead. This hook is provided for backward compatibility.
 * It now uses the global state to avoid duplicate API calls.
 */
export const useGridStrategies = () => {
  const globalState = useGridStrategiesGlobal();

  // This hook now simply forwards to the global state
  // This maintains backward compatibility while using the optimized global state
  return globalState;
};

// Export types for backward compatibility
export type { ProfitReport } from "@/services/gridBot.client";
