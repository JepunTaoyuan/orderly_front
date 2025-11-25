import React from "react";
import { useGridHeaderScript } from "./gridHeader.script";
import { GridHeader } from "./gridHeader.ui";

export const GridHeaderWidget: React.FC<{
  symbol?: string;
  showAllSymbol?: boolean;
  setShowAllSymbol?: (show: boolean) => void;
}> = (props) => {
  const state = useGridHeaderScript(props);
  return <GridHeader {...state} />;
};

export { GridHeader } from "./gridHeader.ui";
export type { GridHeaderState } from "./gridHeader.script";
