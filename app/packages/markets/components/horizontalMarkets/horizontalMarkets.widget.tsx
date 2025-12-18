import React from "react";
import { MarketsTabName } from "../../type";
import { MarketsProvider, MarketsProviderProps } from "../marketsProvider";
import { useHorizontalMarketsScript } from "./horizontalMarkets.script";
import type { HorizontalMarketsProps } from "./horizontalMarkets.ui";

const LazyHorizontalMarkets = React.lazy(() =>
  import("./horizontalMarkets.ui").then((mod) => {
    return { default: mod.HorizontalMarkets };
  }),
);

export type HorizontalMarketsWidgetProps = MarketsProviderProps &
  Partial<Pick<HorizontalMarketsProps, "className">> & {
    activeTab?: MarketsTabName;
    onTabChange?: (tab: MarketsTabName) => void;
  };

const HorizontalMarketsInner: React.FC<
  Pick<HorizontalMarketsWidgetProps, "activeTab" | "onTabChange" | "className">
> = (props) => {
  const { activeTab, onTabChange, className } = props;
  const state = useHorizontalMarketsScript({
    activeTab,
    onTabChange,
  });
  return (
    <React.Suspense fallback={null}>
      <LazyHorizontalMarkets {...state} className={className} />
    </React.Suspense>
  );
};

export const HorizontalMarketsWidget: React.FC<HorizontalMarketsWidgetProps> = (
  props,
) => {
  const { activeTab, onTabChange, className, ...providerProps } = props;

  return (
    <MarketsProvider {...providerProps}>
      <HorizontalMarketsInner
        activeTab={activeTab}
        onTabChange={onTabChange}
        className={className}
      />
    </MarketsProvider>
  );
};
