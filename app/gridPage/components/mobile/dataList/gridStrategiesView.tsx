import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Box,
  Flex,
  Text,
  Button,
  Spinner,
  ListView,
  modal,
} from "@orderly.network/ui";
import { useGridStrategies } from "@/hooks/custom/useGridStrategies";
import type { UserGridStrategy } from "@/services/gridBot.client";
import { StrategyCell } from "./strategyCell";

export const GridStrategiesView: React.FC = () => {
  const { t } = useTranslation();
  const { strategies, loading, error, refetch, stopStrategy, stopping } =
    useGridStrategies();

  const handleStopStrategy = async (sessionId: string) => {
    try {
      await stopStrategy(sessionId);
    } catch (error) {
      console.error("Failed to stop strategy:", error);
    }
  };

  const handleStopAllStrategies = async () => {
    modal.confirm({
      title: t("strategy.closeAllConfirm"),
      content: <Text size="sm">{t("strategy.closeAllConfirmContent")}</Text>,
      onOk: async () => {
        const activeStrategies = strategies.filter((s) => s.is_running);
        for (const strategy of activeStrategies) {
          try {
            await stopStrategy(strategy.session_id);
          } catch (error) {
            console.error("Failed to stop strategy:", error);
          }
        }
      },
    });
  };

  const renderStrategyItem = (item: UserGridStrategy, index: number) => {
    return (
      <StrategyCell
        key={item.session_id}
        item={item}
        index={index}
        onStop={handleStopStrategy}
        stopping={stopping}
      />
    );
  };

  if (loading) {
    return (
      <Flex
        direction="column"
        width="100%"
        height="100%"
        className="items-center justify-center"
        py={8}
      >
        <Spinner size="lg" />
        <Text size="sm" intensity={54} className="mt-3">
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
        py={8}
      >
        <Text size="sm" color="danger" intensity={80} className="mb-3">
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
        py={8}
      >
        <Text size="sm" intensity={54} className="mb-3">
          {t("strategy.noStrategies")}
        </Text>
        <Button variant="outlined" size="sm" onClick={() => refetch()}>
          {t("common.refresh")}
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      {/* Strategies List - following MobilePositionsWidget pattern */}
      <ListView
        className="oui-w-full oui-hide-scrollbar oui-overflow-y-hidden"
        contentClassName="!oui-space-y-1"
        dataSource={strategies}
        renderItem={renderStrategyItem}
        isLoading={loading}
        emptyView={
          <Flex
            direction="column"
            width="100%"
            height="100%"
            className="items-center justify-center"
            py={8}
          >
            <Text size="sm" intensity={54}>
              {t("strategy.noStrategies")}
            </Text>
          </Flex>
        }
      />
    </Flex>
  );
};
