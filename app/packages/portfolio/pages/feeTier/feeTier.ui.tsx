/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Box,
  Flex,
  Text,
  Card,
  Divider,
  DataTable,
  Column,
  useScreen,
  cn,
  TanstackColumn,
} from "@orderly.network/ui";
import { numberToHumanStyle } from "@orderly.network/utils";
import type { FeeDataType, useFeeTierScriptReturn } from "./feeTier.script";
import { MobileHeaderItem } from "./feeTierHeader";

const LazyFeeTierHeader = React.lazy(() =>
  import("./feeTierHeader").then((mod) => {
    return { default: mod.FeeTierHeader };
  }),
);

export type FeeTierProps = useFeeTierScriptReturn;

export type FeeTierHeaderProps = {
  tier?: number;
  vol?: number;
};

type FeeTierTableProps = {
  columns: Column<any>[];
  dataSource?: any[];
  page?: number;
  pageSize?: number;
  dataCount?: number;
  tier?: number | null;
  vol?: number | null;
  onRow?: (
    record: any,
    index: number,
  ) => {
    normal?: any;
    active?: any;
  };
  onCell?: (
    column: TanstackColumn<any>,
    record: any,
    index: number,
  ) => {
    normal?: any;
    active?: any;
  };
};

export const FeeTierTable: React.FC<FeeTierTableProps> = (props) => {
  const { isMobile } = useScreen();

  const { tier, columns, dataSource, onRow, onCell } = props;

  const internalOnRow = useCallback(
    (record: FeeDataType, index: number) => {
      const config =
        typeof onRow === "function"
          ? onRow(record, index)
          : { normal: undefined, active: undefined };
      const active = tier !== undefined && tier !== null && tier === index + 1;
      if (active) {
        return {
          "data-state": "active",
          className: cn(
            "oui-pointer-events-none oui-h-[54px] oui-text-[rgba(0,0,0,0.88)] oui-gradient-brand",
          ),
          ...config.active,
        };
      } else {
        return {
          "data-state": "none",
          className: cn("oui-h-[54px]"),
          ...config.normal,
        };
      }
    },
    [tier, onRow],
  );

  const internalOnCell = useCallback(
    (
      column: TanstackColumn<FeeDataType>,
      record: FeeDataType,
      index: number,
    ) => {
      const config =
        typeof onCell === "function"
          ? onCell(column, record, index)
          : { normal: undefined, active: undefined };
      const active = tier !== undefined && tier !== null && tier === index + 1;
      const isFirstColumn = column.getIsFirstColumn();
      const isLastColumn = column.getIsLastColumn();
      if (active) {
        return {
          className: cn(
            isFirstColumn && "oui-rounded-l-lg",
            isLastColumn && "oui-rounded-r-lg",
          ),
          ...config.active,
        };
      } else {
        return {
          className: "",
          ...config.normal,
        };
      }
    },
    [tier, onCell],
  );

  return (
    <Box className={cn("oui-relative oui-border-b oui-border-line-4")}>
      <DataTable
        bordered
        className="oui-font-semibold"
        classNames={{ root: "oui-bg-transparent oui-pt-4" }}
        onRow={internalOnRow}
        onCell={internalOnCell}
        columns={columns}
        dataSource={dataSource}
      />
    </Box>
  );
};

const CardTitle: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  if (isMobile) {
    return (
      <Flex itemAlign={"center"} justify={"center"} gap={2}>
        <Text size="xs" intensity={54}>
          {t("portfolio.feeTier.updatedDailyBy")}
        </Text>
        <Text size="xs" intensity={80}>
          ~2:15 UTC
        </Text>
      </Flex>
    );
  }
  return (
    <Flex itemAlign={"center"} justify={"between"}>
      <Text size={"sm"}>{t("portfolio.feeTier")}</Text>
      <Flex itemAlign={"center"} justify={"center"} gap={1}>
        <Text size="xs" intensity={54}>
          {t("portfolio.feeTier.updatedDailyBy")}
        </Text>
        <Text size="xs" intensity={80}>
          ~2:15 UTC
        </Text>
      </Flex>
    </Flex>
  );
};

const FeeTierCard: React.FC<{ data: FeeDataType; isActive?: boolean }> = ({
  data,
  isActive,
}) => {
  const { t } = useTranslation();

  const items = [
    {
      label: t("portfolio.feeTier.column.tier"),
      value: data.tier,
      interactive: false,
    },
    {
      label: t("portfolio.feeTier.column.30dVolume"),
      value:
        data.volume_min && data.volume_max
          ? `${numberToHumanStyle(data.volume_min)} - ${numberToHumanStyle(data.volume_max)}`
          : data.volume_min
            ? t("portfolio.feeTier.column.30dVolume.above", {
                volume: numberToHumanStyle(data.volume_min),
              })
            : "--",
      interactive: false,
    },
    {
      label: t("portfolio.feeTier.column.maker"),
      value: data.maker_fee,
      interactive: false,
    },
    {
      label: t("portfolio.feeTier.column.taker"),
      value: data.taker_fee,
      interactive: false,
    },
  ];

  return (
    <Box
      width="100%"
      r="lg"
      className={cn("oui-bg-base-9", isActive && "custom-fee-tier-bg")}
      style={{ padding: "10px" }}
    >
      <Flex direction="column">
        {items.map((item, index) => (
          <MobileHeaderItem key={index} {...item} />
        ))}
      </Flex>
    </Box>
  );
};

export const FeeTier: React.FC<FeeTierProps> = (props) => {
  const { columns, dataSource, tier, vol, headerDataAdapter, onRow, onCell } =
    props;
  const { isMobile } = useScreen();
  const isSmallScreen = useMediaQuery("(max-width: 390px)");
  if (isMobile) {
    return (
      <Card
        title={<CardTitle />}
        id="oui-portfolio-fee-tier"
        className="oui-p-5 w-full"
        classNames={{
          root: isMobile ? "oui-bg-transparent oui-p-2" : "oui-bg-base-9",
        }}
      >
        {!isMobile && <Divider />}
        <Flex direction="column" gap={2}>
          <React.Suspense fallback={null}>
            <LazyFeeTierHeader
              vol={vol}
              tier={tier}
              headerDataAdapter={headerDataAdapter}
            />
          </React.Suspense>
          {/* 根據寬度條件渲染不同樣式 */}
          {isSmallScreen ? (
            <Flex direction="column" gap={2} width="100%">
              {dataSource?.map((item, index) => (
                <FeeTierCard
                  key={item.tier || index}
                  data={item}
                  isActive={tier === index + 1}
                />
              ))}
            </Flex>
          ) : (
            <FeeTierTable
              dataSource={dataSource}
              columns={columns}
              vol={vol}
              tier={tier}
              onRow={onRow}
              onCell={onCell}
            />
          )}
        </Flex>
      </Card>
    );
  }
  return (
    <Card
      title={<CardTitle />}
      id="oui-portfolio-fee-tier"
      className="oui-p-5 w-full"
      classNames={{
        root: isMobile ? "oui-bg-transparent oui-p-2" : "oui-bg-base-9",
      }}
    >
      {!isMobile && <Divider />}
      <Flex direction="row" gap={4}>
        <React.Suspense fallback={null}>
          <LazyFeeTierHeader
            vol={vol}
            tier={tier}
            headerDataAdapter={headerDataAdapter}
          />
        </React.Suspense>
        <FeeTierTable
          dataSource={dataSource}
          columns={columns}
          vol={vol}
          tier={tier}
          onRow={onRow}
          onCell={onCell}
        />
      </Flex>
    </Card>
  );
};
