/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Card, Divider, Flex, Text } from "@orderly.network/ui";
import { AssetAreaChart } from "@/packages/chart";
import { AssetsUI } from "../assets";
import { useAssetsChartScriptReturn } from "./assetsChart.script";

const LazyPeriodTitle = React.lazy(() =>
  import("../shared/periodHeader").then((mod) => {
    return { default: mod.PeriodTitle };
  }),
);

export type AssetsLineChartProps = {} & useAssetsChartScriptReturn;

export const AssetsChart: React.FC<AssetsLineChartProps> = (props) => {
  const { onPeriodChange, data, periodTypes, period } = props;
  const { t } = useTranslation();
  return (
    <Card
      title={
        <React.Suspense fallback={null}>
          <LazyPeriodTitle
            onPeriodChange={onPeriodChange}
            periodTypes={periodTypes}
            period={period}
            title={t("common.assets")}
          />
        </React.Suspense>
      }
      id="portfolio-overview-assets-chart"
      classNames={{ content: "oui-h-[168px] oui-pb-0" }}
    >
      <React.Suspense fallback={null}>
        <AssetAreaChart data={data as any} invisible={props.invisible} />
      </React.Suspense>
    </Card>
  );
};

// Mobile 版本
export const AssetsChartMobile: React.FC<AssetsLineChartProps> = (props) => {
  const { onPeriodChange, data, periodTypes, period } = props;
  const { t } = useTranslation();
  return (
    <Card
      title={
        <React.Suspense fallback={null}>
          <LazyPeriodTitle
            onPeriodChange={onPeriodChange}
            periodTypes={periodTypes}
            period={period}
            title={t("common.assets")}
          />
        </React.Suspense>
      }
      id="portfolio-overview-assets-chart-mobile"
      className="oui-w-full"
    >
      <React.Suspense fallback={null}>
        <AssetAreaChart
          data={data as any}
          invisible={props.invisible}
          // Mobile 特定屬性
          responsiveContainerProps={{
            width: "100%",
            height: 178,
          }}
        />
      </React.Suspense>
      <Divider intensity={16} className="oui-mt-4" />
      {/* 我現在要在這邊顯示像desktop一樣的 Unrealized Pnl Available to withdraw 跟數據 要怎麼去實現?? */}
    </Card>
  );
};
