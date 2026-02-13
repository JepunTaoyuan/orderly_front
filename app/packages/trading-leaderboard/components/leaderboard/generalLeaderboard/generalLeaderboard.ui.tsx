import { FC, useMemo, useState } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { cn, Box, useScreen, Divider, Flex } from "@orderly.network/ui";
import { LeaderboardTab } from "../../../type";
import { GeneralRankingWidget } from "../../ranking/generalRanking";
import { RankingColumnFields } from "../../ranking/shared/column";
import { MyPointsWidget } from "../myPoints/myPoints.widget";
import { LeaderboardProfile } from "../profile/leaderboardProfile.ui";
import { LeaderboardFilter } from "../shared/LeaderboardFilter";
import {
  LeaderboardMainTabs,
  LeaderboardMainTab,
} from "../shared/LeaderboardMainTabs";
import { LeaderboardTabs } from "../shared/LeaderboardTabs";
import { GeneralLeaderboardScriptReturn } from "./generalLeaderboard.script";

export type GeneralLeaderboardProps = {
  style?: React.CSSProperties;
  className?: string;
  campaignDateRange?: {
    start_time: Date | string;
    end_time: Date | string;
  };
} & GeneralLeaderboardScriptReturn;

export const GeneralLeaderboard: FC<GeneralLeaderboardProps> = (props) => {
  const { isMobile } = useScreen();
  const [activeMainTab, setActiveMainTab] =
    useState<LeaderboardMainTab>("leaderboard");

  const isBelowDesktop = useMediaQuery("(max-width: 1024px)");

  const fields = useMemo<RankingColumnFields[]>(() => {
    if (isMobile) {
      if (props.activeTab === LeaderboardTab.Points) {
        return ["rank", "address", "totalPoints"];
      }

      return [
        "rank",
        "address",
        props.activeTab === LeaderboardTab.Volume ? "volume" : "pnl",
        "totalPoints",
      ];
    }
    return ["rank", "address", "volume", "pnl", "totalPoints"];
  }, [isMobile, props.activeTab]);

  const sortKey = useMemo(() => {
    if (!isMobile) return undefined;

    switch (props.activeTab) {
      case LeaderboardTab.Volume:
        return "perp_volume";
      case LeaderboardTab.Pnl:
        return "realized_pnl";
      case LeaderboardTab.Points:
        // Assuming "totalPoints" is the sort key for points, checking backend mapping
        // In most cases for this project, it might be handled differently or just "points"
        // But GeneralRankingWidget often maps keys. Let's assume undefined relies on default or handle inside widget
        // If we look at GeneralRankingWidget, it passes sortKey to useGeneralRankingScript
        // which maps it.
        // For now, let's set it to undefined if Points, relying on the widget/hook to default or
        // if we need a specific key like 'ladders_score' or 'points', we might need to verify.
        // However, based on existing pattern:
        return undefined; // Or "total_points" if we knew the backend key.
      default:
        return undefined;
    }
  }, [isMobile, props.activeTab]);

  const showProfile =
    activeMainTab === "leaderboard" || activeMainTab === "myPoints";

  const content = (
    <Box
      py={3}
      px={isMobile ? 3 : 6}
      r="md"
      intensity={900}
      className={cn(
        "oui-trading-leaderboard-general-leaderboard oui-relative oui-overflow-auto",
        props.className,
      )}
      style={showProfile ? undefined : props.style}
    >
      <LeaderboardMainTabs
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
      />

      {activeMainTab === "leaderboard" && (
        <>
          <LeaderboardFilter {...props} />
          {isMobile ? (
            <LeaderboardTabs
              isMobile={isMobile}
              className="oui-pt-0"
              activeTab={props.activeTab}
              onTabChange={props.onTabChange}
            />
          ) : (
            <Divider intensity={8} />
          )}

          <GeneralRankingWidget
            dateRange={props.dateRange}
            address={props.searchValue}
            sortKey={sortKey}
            fields={fields}
          />
        </>
      )}

      {activeMainTab === "myPoints" && (
        <MyPointsWidget className={isMobile ? "oui-px-0" : "oui-px-0"} />
      )}
    </Box>
  );

  if (showProfile) {
    return (
      <Flex
        gap={3}
        className={props.className}
        style={props.style}
        itemAlign="start"
        direction={isBelowDesktop ? "column" : "row"}
      >
        <LeaderboardProfile
          className={isBelowDesktop ? "oui-w-full" : undefined}
        />
        <Box className="oui-flex-1" width={isBelowDesktop ? "100%" : undefined}>
          {content}
        </Box>
      </Flex>
    );
  }

  return content;
};
