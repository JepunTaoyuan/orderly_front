import { useState } from "react";
import { useOrderStream } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { modal, Text, toast } from "@orderly.network/ui";
import { TabType } from "@orderly.network/ui-orders";
import { SharePnLConfig } from "@orderly.network/ui-share";
import { useGridStrategies } from "@/hooks/custom/useGridStrategies";
import {
  usePendingOrderCount,
  usePositionsCount,
  useTradingLocalStorage,
} from "../../../hooks";
import { useTradingPageContext } from "../../../provider/tradingPageContext";

export enum DataListTabType {
  position = "Position",
  pending = "Pending",
  strategy = "Strategy",
  tp_sl = "TP/SL",
  history = "History",
  liquidation = "Liquidation",
  assets = "Assets",
}

export enum DataListTabSubType {
  positionHistory = "Position history",
  orderHistory = "Order history",
}

export const useDataListScript = (props: {
  symbol: string;
  className?: string;
  sharePnLConfig?: SharePnLConfig;
  current?: DataListTabType;
}) => {
  const { symbol, sharePnLConfig, current } = props;
  const [tab, setTab] = useState<DataListTabType>(
    current || DataListTabType.position,
  );
  const [subTab, setSubTab] = useState<DataListTabSubType>(
    DataListTabSubType.positionHistory,
  );
  const { t } = useTranslation();

  const { onSymbolChange } = useTradingPageContext();
  const localStorage = useTradingLocalStorage();

  const [_, { cancelAllOrders, cancelAllTPSLOrders, refresh }] = useOrderStream(
    {},
  );
  const { positionCount } = usePositionsCount(symbol);
  const { pendingOrderCount, tpSlOrderCount } = usePendingOrderCount(symbol);

  // Strategy related state
  const gridStrategies = useGridStrategies();

  const onCloseAll = (type: TabType) => {
    const title =
      type === TabType.pending
        ? t("orders.pending.cancelAll")
        : type === TabType.tp_sl
          ? t("orders.tpsl.cancelAll")
          : "";
    const content =
      type === TabType.pending
        ? t("orders.pending.cancelAll.description")
        : type === TabType.tp_sl
          ? t("orders.tpsl.cancelAll.description")
          : "";
    modal.confirm({
      title: title,
      content: <Text size="2xs">{content}</Text>,

      onOk: async () => {
        try {
          // await cancelAll(null, { source_type: "ALL" });
          if (tab === DataListTabType.tp_sl) {
            await cancelAllTPSLOrders();
          } else {
            await cancelAllOrders();
          }
          // Reload datalist to ensure the UI reflects the changes
          refresh();
          return Promise.resolve(true);
        } catch (error) {
          // @ts-ignore
          if (error?.message !== undefined) {
            // @ts-ignore
            toast.error(error.message);
          }
          return Promise.resolve(false);
        } finally {
          Promise.resolve();
        }
      },
    });
  };

  return {
    tab,
    setTab,
    subTab,
    setSubTab,
    sharePnLConfig,
    symbol,
    positionCount,
    pendingOrderCount,
    tpSlOrderCount,
    ...localStorage,
    onCloseAll,
    onSymbolChange,
    // Add strategy state
    gridStrategies,
  };
};

export type DataListState = ReturnType<typeof useDataListScript>;
