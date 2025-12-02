import { API } from "@orderly.network/types";
import { SharePnLConfig } from "@orderly.network/ui-share";
import { TabType } from "../../orders.widget";
import { useOrderCellScript } from "./orderCell.script";
import { OrderCell } from "./orderCell.ui";

export const OrderCellWidget = (props: {
  item: API.AlgoOrderExt;
  index: number;
  className?: string;
  type: TabType;
  sharePnLConfig?: SharePnLConfig;
  onSymbolChange?: (symbol: API.Symbol) => void;
}) => {
  const { className, ...rest } = props;

  const state = useOrderCellScript(rest);
  return <OrderCell {...state} className={className} />;
};
