import React, { useState, useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  modal,
  Spinner,
  Column,
  SortOrder,
} from "@orderly.network/ui";
import { AuthGuardDataTable } from "@orderly.network/ui-connector";
import { Decimal } from "@orderly.network/utils";
import { StrategyRowProvider } from "@/contexts/StrategyRowProvider";
import { useGridStrategies } from "@/hooks/custom/useGridStrategies";
import type { UserGridStrategy } from "@/services/gridBot.client";
import { StrategyActions } from "./StrategyActions";

const StatusBadge: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
  const { t } = useTranslation();

  return (
    <Text
      size="xs"
      weight="medium"
      className={isRunning ? "oui-text-success" : "oui-text-neutral"}
    >
      {isRunning ? t("strategy.running") : t("strategy.stopped")}
    </Text>
  );
};

const ProfitText: React.FC<{ value: number }> = ({ value }) => {
  return (
    <Text.numeral
      size="sm"
      dp={2}
      rm={Decimal.ROUND_DOWN}
      className={value >= 0 ? "oui-text-trade-profit" : "oui-text-trade-loss"}
    >
      {value}
    </Text.numeral>
  );
};

const StrategyRow: React.FC<{
  strategy: UserGridStrategy;
  onStop: (session_id: string) => void;
  stopping: boolean;
}> = ({ strategy, onStop, stopping }) => {
  return (
    <StrategyRowProvider
      strategy={strategy}
      onStop={onStop}
      stopping={stopping}
    >
      <div className="hover:bg-base-8/50 transition-all duration-200">
        <StrategyActions />
      </div>
    </StrategyRowProvider>
  );
};

export const GridStrategiesView: React.FC = () => {
  const { t } = useTranslation();
  const { strategies, loading, error, refetch, stopStrategy, stopping } =
    useGridStrategies();

  const columns: Column<UserGridStrategy>[] = useMemo(
    () => [
      {
        title: t("strategy.ticker"),
        dataIndex: "ticker",
        width: 120,
        align: "left",
        render: (value: string, record: UserGridStrategy) => (
          <Text size="sm" weight="medium">
            {record.ticker}
          </Text>
        ),
      },
      {
        title: t("strategy.gridProfit"),
        dataIndex: "gridProfit",
        width: 120,
        align: "left",
        render: (value: string, record: UserGridStrategy) => {
          const gridProfit = parseFloat(
            record.status?.profit_statistics?.grid_profit || "0",
          );
          return <ProfitText value={gridProfit} />;
        },
      },
      {
        title: t("strategy.activeOrders"),
        dataIndex: "activeOrders",
        width: 100,
        align: "left",
        render: (value: string, record: UserGridStrategy) => (
          <Text size="sm" intensity={80}>
            {record.status?.active_orders_count || 0}
          </Text>
        ),
      },
      {
        title: t("strategy.totalMarginUsed"),
        dataIndex: "marginUsed",
        width: 120,
        align: "left",
        render: (value: string, record: UserGridStrategy) => {
          const marginUsed = parseFloat(
            record.status?.profit_statistics?.total_margin_used || "0",
          );
          return (
            <Text.numeral
              size="sm"
              dp={2}
              rm={Decimal.ROUND_DOWN}
              intensity={80}
            >
              {marginUsed}
            </Text.numeral>
          );
        },
      },
      {
        title: t("strategy.capitalUtilization"),
        dataIndex: "capitalUtilization",
        width: 120,
        align: "left",
        render: (value: string, record: UserGridStrategy) => {
          const capitalUtilization = parseFloat(
            record.status?.profit_statistics?.capital_utilization || "0",
          );
          return (
            <Text.numeral
              size="sm"
              dp={1}
              rule="percentages"
              rm={Decimal.ROUND_DOWN}
              intensity={80}
            >
              {capitalUtilization / 100}
            </Text.numeral>
          );
        },
      },
      {
        title: t("strategy.currentPosition"),
        dataIndex: "currentPosition",
        width: 120,
        align: "left",
        render: (value: string, record: UserGridStrategy) => {
          const currentPosition = parseFloat(
            record.status?.profit_statistics?.current_position_qty || "0",
          );
          return (
            <Text.numeral
              size="sm"
              dp={4}
              rm={Decimal.ROUND_DOWN}
              intensity={80}
            >
              {currentPosition}
            </Text.numeral>
          );
        },
      },
      {
        title: t("common.actions"),
        dataIndex: "actions",
        width: 100,
        align: "center",
        render: (value: string, record: UserGridStrategy) => (
          <StrategyRow
            strategy={record}
            onStop={stopStrategy}
            stopping={stopping}
          />
        ),
      },
    ],
    [t, stopStrategy, stopping],
  );

  if (loading) {
    return (
      <Flex
        direction="column"
        width="100%"
        height="100%"
        className="items-center justify-center"
      >
        <Spinner size="lg" />
        <Text size="sm" intensity={54} className="mt-2">
          {t("strategy.loading")}
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        direction="column"
        width="100%"
        height="100%"
        className="items-center justify-center"
      >
        <Text size="sm" color="danger" intensity={80} className="mb-2">
          {t("strategy.error")}
        </Text>
        <Button variant="outlined" size="sm" onClick={() => refetch()}>
          {t("common.retry")}
        </Button>
      </Flex>
    );
  }

  if (strategies.length === 0) {
    return (
      <Flex
        direction="column"
        width="100%"
        height="100%"
        className="items-center justify-center"
      >
        <Text size="sm" intensity={54} className="mb-2">
          {t("strategy.noStrategies")}
        </Text>
        <Button variant="outlined" size="sm" onClick={() => refetch()}>
          {t("common.refresh")}
        </Button>
      </Flex>
    );
  }

  return (
    <Box className="w-full h-full">
      <AuthGuardDataTable<UserGridStrategy>
        loading={loading}
        id="oui-desktop-strategies-content"
        columns={columns}
        bordered
        dataSource={strategies}
        generatedRowKey={(record: UserGridStrategy) => record.session_id}
        renderRowContainer={(
          record: UserGridStrategy,
          index: number,
          children: any,
        ) => {
          return (
            <StrategyRowProvider
              strategy={record}
              onStop={stopStrategy}
              stopping={stopping}
            >
              {children}
            </StrategyRowProvider>
          );
        }}
        manualPagination={false}
        testIds={{
          body: "oui-testid-dataList-strategy-tab-body",
        }}
      />
    </Box>
  );
};
