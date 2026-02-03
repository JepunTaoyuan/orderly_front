// Points ranking widget component
import { FC, useCallback, useMemo } from "react";
import { useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  cn,
  DataTable,
  Column,
  Flex,
  Spinner,
  Text,
  Box,
  TabPanel,
  Tabs,
  useScreen,
} from "@orderly.network/ui";
import {
  LeaderboardEntry,
  WeeklyLeaderboardEntry,
} from "@/services/api-refer-client";
import {
  usePointsLeaderboard,
  PointsLeaderboardType,
} from "../../../hooks/usePointsLeaderboard";

export type PointsRankingWidgetProps = {
  style?: React.CSSProperties;
  className?: string;
  limit?: number;
};

type PointsRowData = {
  rank: number;
  user_id: string;
  points: number;
};

export const PointsRankingWidget: FC<PointsRankingWidgetProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const [leaderboardType, setLeaderboardType] =
    useState<PointsLeaderboardType>("total");

  const { data, isLoading, error, totalUsers } = usePointsLeaderboard({
    type: leaderboardType,
    limit: props.limit || 100,
  });

  const dataSource = useMemo<PointsRowData[]>(() => {
    return data.map((item, index) => ({
      rank: index + 1,
      user_id: item.user_id,
      points:
        leaderboardType === "weekly"
          ? (item as WeeklyLeaderboardEntry).weekly_points
          : (item as LeaderboardEntry).total_points,
    }));
  }, [data, leaderboardType]);

  const columns: Column<PointsRowData>[] = useMemo(
    () => [
      {
        title: t("tradingLeaderboard.rank", "Rank"),
        dataIndex: "rank",
        width: 80,
        render: (value: number) => (
          <Text
            className={cn(
              value <= 3 && "oui-font-bold",
              value === 1 && "oui-text-warning",
              value === 2 && "oui-text-base-contrast-54",
              value === 3 && "oui-text-[#A0652E]",
            )}
          >
            {value}
          </Text>
        ),
      },
      {
        title: t("tradingLeaderboard.address", "Address"),
        dataIndex: "user_id",
        render: (value: string) => {
          // Truncate wallet address for display
          const truncated =
            value.length > 12
              ? `${value.slice(0, 6)}...${value.slice(-4)}`
              : value;
          return <Text className="oui-font-mono">{truncated}</Text>;
        },
      },
      {
        title: t("common.points", "Points"),
        dataIndex: "points",
        align: "right" as const,
        render: (value: number) => (
          <Text className="oui-font-semibold">
            {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
        ),
      },
    ],
    [t],
  );

  const onRow = useCallback((record: PointsRowData) => {
    const isFirst = record.rank === 1;
    const isSecond = record.rank === 2;
    const isThird = record.rank === 3;
    const showBg = isFirst || isSecond || isThird;

    return {
      className: cn(
        "oui-h-[40px] md:oui-h-[48px]",
        showBg && "oui-border-b-2 oui-border-b-transparent",
        isFirst &&
          "oui-bg-[linear-gradient(270deg,rgba(241,215,121,0.0225)_-2.05%,rgba(255,203,70,0.45)_100%)]",
        isSecond &&
          "oui-bg-[linear-gradient(270deg,rgba(255,255,255,0.0225)_-2.05%,rgba(199,199,199,0.45)_100%)]",
        isThird &&
          "oui-bg-[linear-gradient(270deg,rgba(255,233,157,0.0225)_-1.3%,rgba(160,101,46,0.45)_100%)]",
      ),
    };
  }, []);

  if (error) {
    return (
      <Flex
        className={props.className}
        style={props.style}
        itemAlign="center"
        justify="center"
        height={200}
      >
        <Text className="oui-text-danger">
          {t("common.error", "Error")}: {error.message}
        </Text>
      </Flex>
    );
  }

  return (
    <Box
      pt={2}
      px={isMobile ? 3 : 6}
      r="2xl"
      intensity={900}
      className={cn(
        "oui-trading-leaderboard-points-ranking oui-relative",
        !isMobile && "oui-mx-auto oui-max-w-[992px]",
        props.className,
      )}
      style={props.style}
    >
      {/* Header with tabs */}
      <Flex
        width="100%"
        py={3}
        justify="between"
        className="oui-border-b oui-border-line"
      >
        <Tabs
          value={leaderboardType}
          onValueChange={(value) =>
            setLeaderboardType(value as PointsLeaderboardType)
          }
          variant="contained"
          size="lg"
        >
          <TabPanel
            title={t("tradingLeaderboard.totalPoints", "Total Points")}
            value="total"
          />
          <TabPanel
            title={t("tradingLeaderboard.weeklyPoints", "Weekly Points")}
            value="weekly"
          />
        </Tabs>

        <Flex gap={2} className="oui-text-sm oui-text-base-contrast-36">
          <span>{t("tradingLeaderboard.totalUsers", "Total Users")}:</span>
          <span>{totalUsers}</span>
        </Flex>
      </Flex>

      {/* Data table */}
      <DataTable
        loading={isLoading}
        columns={columns}
        bordered
        dataSource={dataSource}
        generatedRowKey={(record: PointsRowData) => record.user_id}
        classNames={{
          root: "oui-trading-leaderboard-points-table",
          scroll: isMobile
            ? "oui-overflow-y-hidden oui-h-full"
            : "oui-min-h-[400px] oui-max-h-[800px]",
          body: isMobile ? "oui-text-2xs" : undefined,
        }}
        onRow={onRow}
      />
    </Box>
  );
};
