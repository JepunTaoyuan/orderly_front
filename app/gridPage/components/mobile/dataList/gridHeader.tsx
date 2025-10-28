import React from "react";
import { useMobileGridHeaderScript } from "./gridHeader.script";
import { MobileGridHeader } from "./gridHeader.ui";

export const MobileGridHeaderWidget: React.FC<{
  symbol?: string;
  showAllSymbol?: boolean;
  setShowAllSymbol?: (show: boolean) => void;
}> = (props) => {
  const state = useMobileGridHeaderScript(props);
  return <MobileGridHeader {...state} />;
};

export { MobileGridHeader } from "./gridHeader.ui";
export type { MobileGridHeaderState } from "./gridHeader.script";
