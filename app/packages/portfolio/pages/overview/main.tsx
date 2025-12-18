import React from "react";
import { Grid, useMediaQuery, useScreen } from "@orderly.network/ui";
import HistoryPage from "@/routes/$lang.portfolio.history";
import { MobileOverview } from "./mobile";
import { OverviewProvider } from "./provider/overviewProvider";

const LazyAssetWidget = React.lazy(() =>
  import("./assets").then((mod) => {
    return { default: mod.AssetWidget };
  }),
);

const LazyAssetsChartWidget = React.lazy(() =>
  import("./assetChart").then((mod) => {
    return { default: mod.AssetsChartWidget };
  }),
);

const LazyPerformanceWidget = React.lazy(() =>
  import("./performance").then((mod) => {
    return { default: mod.PerformanceWidget };
  }),
);

const LazyHistoryDataGroupWidget = React.lazy(() =>
  import("./historyDataGroup").then((mod) => {
    return { default: mod.HistoryDataGroupWidget };
  }),
);

export const OverviewPage: React.FC = () => {
  const { isMobile } = useScreen();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  return (
    <OverviewProvider>
      {isDesktop ? (
        <HistoryPage />
      ) : isMobile ? (
        <MobileOverview />
      ) : (
        <Grid cols={2} gap={1}>
          <React.Suspense fallback={null}>
            <LazyAssetWidget />
          </React.Suspense>
          <React.Suspense fallback={null}>
            <LazyAssetsChartWidget />
          </React.Suspense>
          <Grid.span colSpan={2}>
            <React.Suspense fallback={null}>
              <LazyPerformanceWidget />
            </React.Suspense>
          </Grid.span>
          <Grid.span colSpan={2}>
            <React.Suspense fallback={null}>
              <LazyHistoryDataGroupWidget />
            </React.Suspense>
          </Grid.span>
        </Grid>
      )}
    </OverviewProvider>
  );
};
