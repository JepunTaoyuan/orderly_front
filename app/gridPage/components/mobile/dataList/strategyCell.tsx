import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Badge,
  Divider,
  Flex,
  Grid,
  Text,
  Button,
  Spinner,
  modal,
} from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import type { UserGridStrategy } from "@/services/gridBot.client";

interface StrategyCellProps {
  item: UserGridStrategy;
  index: number;
  className?: string;
  onStop: (session_id: string) => void;
  stopping: boolean;
}

// Statistic component for consistent styling with PositionCell
const Statistic: React.FC<{
  label: string;
  value: React.ReactNode;
  coloring?: boolean;
}> = ({ label, value, coloring }) => {
  return (
    <Flex direction="column" itemAlign="start" className="oui-text-xs">
      <Text size="2xs" intensity={54}>
        {label}
      </Text>
      {coloring ? (
        value
      ) : (
        <Text size="xs" weight="medium" intensity={80}>
          {value}
        </Text>
      )}
    </Flex>
  );
};

export const StrategyCell: React.FC<StrategyCellProps> = ({
  item,
  index,
  className,
  onStop,
  stopping,
}) => {
  const { t } = useTranslation();

  const handleStopClick = () => {
    modal.confirm({
      title: t("strategy.closeConfirm"),
      content: t("strategy.closeConfirm"),
      onOk: async () => {
        await onStop(item.session_id);
      },
    });
  };

  const gridProfit = parseFloat(
    item.status?.profit_statistics?.grid_profit || "0",
  );
  const marginUsed = parseFloat(
    item.status?.profit_statistics?.total_margin_used || "0",
  );
  const capitalUtilization = parseFloat(
    item.status?.profit_statistics?.capital_utilization || "0",
  );
  const currentPosition = parseFloat(
    item.status?.profit_statistics?.current_position_qty || "0",
  );
  const activeOrdersCount = item.status?.active_orders_count || 0;

  const profitColor = gridProfit >= 0 ? "trade-profit" : "trade-loss";

  return (
    <Flex
      direction="column"
      width="100%"
      gap={2}
      p={2}
      r="xl"
      className={`${className} oui-bg-base-9 hover:bg-base-8/50 transition-all duration-200 ease-in-out`}
    >
      {/* Header - following PositionCell pattern exactly */}
      <Flex justify="between" width="100%" className="items-center">
        <Flex className="items-center gap-2">
          <Text.formatted size="2xs" weight="semibold">
            {item.ticker}
          </Text.formatted>
          <Badge color={item.is_running ? "success" : "neutral"} size="xs">
            {item.is_running ? t("strategy.running") : t("strategy.stopped")}
          </Badge>
        </Flex>
        <Text.numeral
          size="sm"
          dp={2}
          rm={Decimal.ROUND_DOWN}
          className={`oui-text-${profitColor}`}
          weight="medium"
        >
          {gridProfit}
        </Text.numeral>
      </Flex>

      <Divider intensity={6} className="oui-w-full" />

      {/* Body - 3x2 Grid following PositionCell pattern exactly */}
      <Grid cols={3} rows={2} gap={2} width="100%">
        {/* Row 1 */}
        <Statistic
          label={t("strategy.activeOrders")}
          value={activeOrdersCount}
        />

        <Statistic
          label={t("strategy.totalMarginUsed")}
          value={
            <Text.numeral
              size="xs"
              dp={2}
              rm={Decimal.ROUND_DOWN}
              intensity={80}
            >
              {marginUsed}
            </Text.numeral>
          }
        />

        <Statistic
          label={t("strategy.capitalUtilization")}
          value={
            <Text.numeral
              size="xs"
              dp={1}
              rule="percentages"
              rm={Decimal.ROUND_DOWN}
              intensity={80}
            >
              {capitalUtilization / 100}
            </Text.numeral>
          }
        />

        {/* Row 2 */}
        <Statistic
          label={t("strategy.currentPosition")}
          value={
            <Text.numeral
              size="xs"
              dp={4}
              rm={Decimal.ROUND_DOWN}
              intensity={80}
            >
              {currentPosition}
            </Text.numeral>
          }
        />

        <Statistic
          label={t("strategy.gridProfit")}
          value={
            <Text.numeral
              size="xs"
              dp={2}
              rm={Decimal.ROUND_DOWN}
              className={`oui-text-${profitColor}`}
              coloring
            >
              {gridProfit}
            </Text.numeral>
          }
          coloring
        />

        <Statistic
          label={t("strategy.sessionIdShort")}
          value={
            <Text
              size="2xs"
              weight="medium"
              intensity={80}
              className="font-mono"
            >
              {item.session_id.slice(-8)}...
            </Text>
          }
        />
      </Grid>

      {/* Buttons - following PositionCell button pattern exactly */}
      <Grid cols={2} width="100%" gap={2}>
        <Button
          variant="outlined"
          color="danger"
          size="sm"
          onClick={handleStopClick}
          disabled={stopping || !item.is_running}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          {stopping ? <Spinner size="xs" /> : t("strategy.close")}
        </Button>
        <Button
          variant="text"
          size="sm"
          onClick={() =>
            window.open(`/grid-strategy/${item.session_id}`, "_blank")
          }
          className="hover:opacity-80 transition-opacity duration-200"
        >
          {t("strategy.details")}
        </Button>
      </Grid>
    </Flex>
  );
};
