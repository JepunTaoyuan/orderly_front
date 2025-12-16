import React, { useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Box, cn, TabPanel, Tabs } from "@orderly.network/ui";
import { FavoritesIcon } from "../../icons";
import { MarketsTabName } from "../../type";
import { ExpandMarketsWidget } from "../expandMarkets";
import { RwaTab } from "../rwaTab";
import { useFavoritesProps } from "../shared/hooks/useFavoritesExtraProps";
import type { HorizontalMarketsScriptReturn } from "./horizontalMarkets.script";

const LazySearchInput = React.lazy(() =>
  import("../searchInput").then((mod) => {
    return { default: mod.SearchInput };
  }),
);

const LazyMarketsListWidget = React.lazy(() =>
  import("../marketsList").then((mod) => {
    return { default: mod.MarketsListWidget };
  }),
);

export type HorizontalMarketsProps = HorizontalMarketsScriptReturn & {
  className?: string;
};

const cls = "oui-h-[calc(100%_-_36px)]";

export const HorizontalMarkets = React.memo<HorizontalMarketsProps>((props) => {
  const { activeTab, onTabChange, tabSort, onTabSort, className } = props;

  const { t } = useTranslation();

  const { getFavoritesProps, renderEmptyView } = useFavoritesProps();

  const renderTab = (type: MarketsTabName) => {
    return (
      <div className={cls}>
        <React.Suspense fallback={null}>
          <LazyMarketsListWidget
            type={type}
            initialSort={tabSort[type]}
            onSort={onTabSort(type)}
            tableClassNames={{
              scroll: cn(
                "oui-px-1",
                type === MarketsTabName.Favorites ? "oui-pb-9" : "oui-pb-2",
              ),
            }}
            {...getFavoritesProps(type)}
            emptyView={renderEmptyView({
              type,
              onClick: () => {
                onTabChange(MarketsTabName.All);
              },
            })}
          />
        </React.Suspense>
      </div>
    );
  };

  return (
    <Box
      className={cn(
        "oui-horizontal-markets",
        "oui-overflow-hidden oui-font-semibold",
        "oui-bg-base-9 oui-rounded-[12px]",
        className,
      )}
      height="100%"
    >
      <Box px={3} pb={2}>
        <React.Suspense fallback={null}>
          <LazySearchInput />
        </React.Suspense>
      </Box>
      <Tabs
        variant="text"
        size="sm"
        value={activeTab}
        onValueChange={onTabChange}
        classNames={{
          tabsList: cn("oui-my-[6px]"),
          tabsContent: "oui-h-full",
          scrollIndicator: "oui-mx-3",
        }}
        className={cls}
        showScrollIndicator
      >
        <TabPanel title={<FavoritesIcon />} value={MarketsTabName.Favorites}>
          {renderTab(MarketsTabName.Favorites)}
        </TabPanel>
        <TabPanel title={t("common.all")} value={MarketsTabName.All}>
          {renderTab(MarketsTabName.All)}
        </TabPanel>
        <TabPanel title={<RwaTab />} value={MarketsTabName.Rwa}>
          {renderTab(MarketsTabName.Rwa)}
        </TabPanel>
        <TabPanel
          title={t("markets.newListings")}
          value={MarketsTabName.NewListing}
        >
          {renderTab(MarketsTabName.NewListing)}
        </TabPanel>
        <TabPanel title={t("markets.recent")} value={MarketsTabName.Recent}>
          {renderTab(MarketsTabName.Recent)}
        </TabPanel>
      </Tabs>
    </Box>
  );
});

if (process.env.NODE_ENV !== "production") {
  HorizontalMarkets.displayName = "HorizontalMarkets";
}
