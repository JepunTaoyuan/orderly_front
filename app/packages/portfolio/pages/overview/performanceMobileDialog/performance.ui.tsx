/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Tabs,
  TabPanel,
  Flex,
  Text,
  Select,
  SelectItem,
  Box,
  Divider,
  cn,
} from "@orderly.network/ui";
import {
  AssetLineChart,
  PnlAreaChart,
  PnLBarChart,
  PnlAreaChartMobile,
  PnLBarChartMobile,
  PnlLineChartProps,
} from "@/packages/chart";
import type { UsePerformanceScriptReturn } from "../performance/performance.script";
import {
  PeriodType,
  useAssetsHistoryDataReturn,
} from "../shared/useAssetHistory";

const responsiveProps: PnlLineChartProps["responsiveContainerProps"] = {
  width: "100%",
  minHeight: 144,
  aspect: 2.5,
};

export const PerformanceMobileUI: React.FC<
  Pick<
    useAssetsHistoryDataReturn & UsePerformanceScriptReturn,
    | "data"
    | "curPeriod"
    | "aggregateValue"
    | "onPeriodChange"
    | "invisible"
    | "visible"
    | "createFakeData"
    | "period"
  >
> = (props) => {
  const { t } = useTranslation();
  const {
    data,
    aggregateValue,
    visible,
    invisible,
    curPeriod,
    period,
    onPeriodChange,
    createFakeData,
  } = props;

  const mergedData = data.length
    ? data
    : (createFakeData?.(
        { account_value: 0, pnl: 0 },
        { account_value: 500, pnl: 500 },
      ) as any[]);
  const optionRenderer = (option: any) => {
    const isActive = option.value === period;

    return (
      <SelectItem
        key={option.value}
        value={option.value}
        className={cn(
          "oui-cursor-pointer hover:oui-bg-base-8",
          isActive && "oui-bg-base-10",
        )}
      >
        {option.label}
      </SelectItem>
    );
  };
  return (
    <div className="oui-w-full oui-h-screen">
      {/* 新增：下拉選單 */}
      <Box className="oui-bg-base-9 oui-p-4">
        <Flex className="oui-w-full" gap={4} justify={"between"}>
          <Text size="md" className="oui-mr-2">
            {t("portfolio.overview.performance")}
          </Text>
          <div className=" oui-min-w-14">
            <Select.options
              size={"xs"}
              value={period}
              onValueChange={onPeriodChange}
              classNames={{ trigger: "oui-px-2" }}
              contentProps={{
                align: "end",
                className: `oui-bg-base-10`,
              }}
              options={[
                { value: PeriodType.WEEK, label: t("common.select.7d") },
                { value: PeriodType.MONTH, label: t("common.select.30d") },
                { value: PeriodType.QUARTER, label: t("common.select.90d") },
              ]}
              optionRenderer={optionRenderer}
            />
          </div>
        </Flex>
        <Flex justify="between" itemAlign="center" my={2}>
          <Flex
            gap={1}
            direction="column"
            itemAlign="start"
            className="oui-w-1/2 oui-rounded-lg oui-py-1.5"
          >
            <Text className="oui-truncate" intensity={36} size="2xs">
              {t("portfolio.overview.performance.roi", { period: curPeriod })}
            </Text>
            <Text.numeral
              size="sm"
              visible={visible}
              rule="percentages"
              coloring
            >
              {invisible ? "--" : aggregateValue.roi}
            </Text.numeral>
          </Flex>
          <Flex
            gap={1}
            direction="column"
            itemAlign="start"
            className="oui-w-1/2 oui-rounded-lg oui-py-1.5"
          >
            <Text className="oui-truncate" intensity={36} size="2xs">
              {t("portfolio.overview.performance.pnl", { period: curPeriod })}
            </Text>
            <Text.numeral size="sm" visible={visible} coloring showIdentifier>
              {invisible ? "--" : aggregateValue.pnl}
            </Text.numeral>
          </Flex>
        </Flex>
        <Divider intensity={16} className="oui-mt-1 oui-mb-1" />
        <Flex
          gap={1}
          direction="column"
          itemAlign="start"
          className="oui-w-1/3 oui-rounded-lg oui-py-1.5"
        >
          <Text className="oui-truncate" intensity={36} size="2xs">
            {t("portfolio.overview.performance.volume", { period: curPeriod })}
          </Text>
          <Text.numeral size="sm" visible={visible} coloring={false}>
            {invisible ? "--" : aggregateValue.vol}
          </Text.numeral>
        </Flex>
      </Box>
      <Box className="oui-bg-base-9 oui-p-4 oui-mb-2 oui-mt-2">
        <Text as="div" size="sm" className="oui-text-base-contrast-54 ">
          {t("portfolio.overview.performance.dailyPnl")}
        </Text>
        <Box className="">
          <PnLBarChartMobile
            data={mergedData}
            invisible={invisible || (mergedData?.length ?? 0) <= 2}
            responsiveContainerProps={responsiveProps}
          />
        </Box>
      </Box>
      <Box className="oui-bg-base-9 oui-p-4">
        <Text as="div" size="sm" className="oui-text-base-contrast-54 ">
          {t("portfolio.overview.performance.cumulativePnl")}
        </Text>
        <Box className="">
          <PnlAreaChartMobile
            data={mergedData}
            invisible={invisible || (mergedData?.length ?? 0) <= 2}
            responsiveContainerProps={responsiveProps}
          />
        </Box>
      </Box>
    </div>
    // 原始版本
    // <div>
    //   <Tabs
    //     value={period}
    //     defaultValue={PeriodType.WEEK}
    //     classNames={{ tabsList: "oui-justify-between", trigger: "oui-w-1/3" }}
    //     onValueChange={(value) => onPeriodChange(value as PeriodType)}
    //   >
    //     <TabPanel
    //       title={t("common.select.7d")}
    //       value={PeriodType.WEEK}
    //       className="oui-min-h-40"
    //     >
    //       <AssetLineChart
    //         data={mergedData}
    //         invisible={invisible || (data?.length ?? 0) < 2}
    //         responsiveContainerProps={responsiveProps}
    //       />
    //     </TabPanel>
    //     <TabPanel
    //       title={t("common.select.30d")}
    //       value={PeriodType.MONTH}
    //       className="oui-min-h-40"
    //     >
    //       <AssetLineChart
    //         data={mergedData}
    //         invisible={invisible || (data?.length ?? 0) < 2}
    //         responsiveContainerProps={responsiveProps}
    //       />
    //     </TabPanel>
    //     <TabPanel
    //       title={t("common.select.90d")}
    //       value={PeriodType.QUARTER}
    //       className="oui-min-h-40"
    //     >
    //       <AssetLineChart
    //         data={mergedData}
    //         invisible={invisible || (data?.length ?? 0) < 2}
    //         responsiveContainerProps={responsiveProps}
    //       />
    //     </TabPanel>
    //   </Tabs>
    //   <Flex justify="between" itemAlign="center" gap={2} my={4}>
    //     <Flex
    //       gap={1}
    //       direction="column"
    //       itemAlign="start"
    //       className="oui-w-1/3 oui-rounded-lg oui-bg-base-7 oui-px-2 oui-py-1.5"
    //     >
    //       <Text className="oui-truncate" intensity={36} size="2xs">
    //         {t("portfolio.overview.performance.roi", { period: curPeriod })}
    //       </Text>
    //       <Text.numeral size="sm" visible={visible} rule="percentages" coloring>
    //         {invisible ? "--" : aggregateValue.roi}
    //       </Text.numeral>
    //     </Flex>
    //     <Flex
    //       gap={1}
    //       direction="column"
    //       itemAlign="start"
    //       className="oui-w-1/3 oui-rounded-lg oui-bg-base-7 oui-px-2 oui-py-1.5"
    //     >
    //       <Text className="oui-truncate" intensity={36} size="2xs">
    //         {t("portfolio.overview.performance.pnl", { period: curPeriod })}
    //       </Text>
    //       <Text.numeral size="sm" visible={visible} coloring showIdentifier>
    //         {invisible ? "--" : aggregateValue.pnl}
    //       </Text.numeral>
    //     </Flex>
    //     <Flex
    //       gap={1}
    //       direction="column"
    //       itemAlign="start"
    //       className="oui-w-1/3 oui-rounded-lg oui-bg-base-7 oui-px-2 oui-py-1.5"
    //     >
    //       <Text className="oui-truncate" intensity={36} size="2xs">
    //         {t("portfolio.overview.performance.volume", { period: curPeriod })}
    //       </Text>
    //       <Text.numeral size="sm" visible={visible} coloring={false}>
    //         {invisible ? "--" : aggregateValue.vol}
    //       </Text.numeral>
    //     </Flex>
    //   </Flex>
    //   <Tabs defaultValue={"dailyPnl"}>
    //     <TabPanel
    //       value={"dailyPnl"}
    //       title={t("portfolio.overview.performance.dailyPnl")}
    //       className="oui-min-h-40"
    //     >
    //       <PnLBarChart
    //         data={mergedData}
    //         invisible={invisible || (mergedData?.length ?? 0) <= 2}
    //         responsiveContainerProps={responsiveProps}
    //       />
    //     </TabPanel>
    //     <TabPanel
    //       value={"cumulativePnl"}
    //       title={t("portfolio.overview.performance.cumulativePnl")}
    //       className="oui-min-h-40"
    //     >
    //       <PnlAreaChart
    //         data={mergedData}
    //         invisible={invisible || (mergedData?.length ?? 0) <= 2}
    //         responsiveContainerProps={responsiveProps}
    //       />
    //     </TabPanel>
    //   </Tabs>
    // </div>
  );
};
