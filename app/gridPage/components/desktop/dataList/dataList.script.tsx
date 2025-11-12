import type { PositionsProps } from "@/packages/ui-positions";
import { useGridStrategies } from "../../../../hooks/custom/useGridStrategies";
import {
  usePendingOrderCount,
  usePositionsCount,
  useTradingLocalStorage,
} from "../../../hooks";
import { useTradingPageContext } from "../../../provider/tradingPageContext";

export enum DataListTabType {
  positions = "Positions",
  pending = "Pending",
  strategy = "Strategy",
  tp_sl = "TP/SL",
  filled = "Filled",
  positionHistory = "Position history",
  orderHistory = "Order history",
  liquidation = "Liquidation",
  assets = "Assets",
}

export const useDataListScript = (
  inputs: { current?: DataListTabType } & PositionsProps,
) => {
  const {
    current,
    pnlNotionalDecimalPrecision,
    sharePnLConfig,
    symbol,
    includedPendingOrder,
  } = inputs;

  const localStorage = useTradingLocalStorage({ pnlNotionalDecimalPrecision });

  const { onSymbolChange } = useTradingPageContext();

  const { positionCount } = usePositionsCount(symbol);

  const { pendingOrderCount, tpSlOrderCount } = usePendingOrderCount(symbol);

  // Strategy related state
  const gridStrategies = useGridStrategies();

  return {
    current,
    sharePnLConfig,
    symbol,
    calcMode: localStorage.unPnlPriceBasis,
    includedPendingOrder,
    ...localStorage,
    positionCount,
    pendingOrderCount,
    tpSlOrderCount,
    onSymbolChange,
    // Add strategy state
    gridStrategies,
  };
};

export type DataListState = ReturnType<typeof useDataListScript>;
