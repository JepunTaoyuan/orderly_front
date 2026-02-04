import { FC, useMemo, useState } from "react";
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

  const fields = useMemo<RankingColumnFields[]>(() => {
    if (isMobile) {
      return [
        "rank",
        "address",
        props.activeTab === LeaderboardTab.Volume ? "volume" : "pnl",
        "totalPoints",
      ];
    }
    return ["rank", "address", "volume", "pnl", "totalPoints"];
  }, [isMobile, props.activeTab]);

  const showProfile = !isMobile && activeMainTab === "leaderboard";

  const content = (
    <Box
      py={3}
      px={isMobile ? 3 : 6}
      r="md"
      intensity={900}
      className={cn(
        "oui-trading-leaderboard-general-leaderboard oui-relative",
        showProfile ? "oui-h-full" : props.className,
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
            sortKey={
              isMobile
                ? props.activeTab === LeaderboardTab.Volume
                  ? "perp_volume"
                  : "realized_pnl"
                : undefined
            }
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
        align="start"
      >
        <LeaderboardProfile className="oui-h-full" />
        <Box className="oui-flex-1" height="100%">
          {content}
        </Box>
      </Flex>
    );
  }

  return content;
};
