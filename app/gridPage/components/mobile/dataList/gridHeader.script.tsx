import { useGridStrategies } from "../../../../hooks/custom/useGridStrategies";

export const useMobileGridHeaderScript = (inputs: {
  symbol?: string;
  showAllSymbol?: boolean;
  setShowAllSymbol?: (show: boolean) => void;
}) => {
  const { symbol, showAllSymbol, setShowAllSymbol } = inputs;
  const {
    loading,
    error,
    refetch,
    totalGridProfit,
    strategyCount: totalStrategies,
    strategiesBySymbol,
  } = useGridStrategies();

  return {
    totalStrategies,
    totalGridProfit,
    strategiesBySymbol,
    loading,
    error,
    refetch,
    symbol,
    showAllSymbol,
    setShowAllSymbol,
  };
};

export type MobileGridHeaderState = ReturnType<
  typeof useMobileGridHeaderScript
>;
