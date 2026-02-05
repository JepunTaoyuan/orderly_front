import { FC, useEffect, useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, Flex, TabPanel, Tabs } from "@orderly.network/ui";
import { LeaderboardTab } from "../../../type";
import { formatUpdateDate } from "../../../utils";
import { useTradingLeaderboardContext } from "../../provider";

type LeaderboardTabsProps = {
  isMobile?: boolean;
  className?: string;
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
};

export const LeaderboardTabs: FC<LeaderboardTabsProps> = (props) => {
  const { t } = useTranslation();
  const { updatedTime, currentCampaign } = useTradingLeaderboardContext();

  const updateTime = useMemo(() => {
    if (updatedTime && currentCampaign) {
      return formatUpdateDate(updatedTime);
    }
    return "";
  }, [props.isMobile, updatedTime, currentCampaign]);

  const { showVolume, showPnl, showPoints } = useMemo(() => {
    const metrics = currentCampaign?.prize_pools?.map((item) => item.metric);
    const isMobileGeneral = props.isMobile && !currentCampaign;
    const showVolume = isMobileGeneral
      ? true
      : metrics?.includes(LeaderboardTab.Volume);
    const showPnl = isMobileGeneral
      ? true
      : metrics?.includes(LeaderboardTab.Pnl);

    // Always show points if not in a specific campaign (general leaderboard), or if explicitly included
    const showPoints = isMobileGeneral
      ? true
      : (metrics as string[])?.includes(LeaderboardTab.Points) ||
        !currentCampaign;

    return {
      showVolume,
      showPnl,
      showPoints,
    };
  }, [currentCampaign, props.activeTab, props.isMobile]);

  useEffect(() => {
    // set default tab logic
    if (props.activeTab === LeaderboardTab.Points && !showPoints) {
      // If currently on Points but it shouldn't be shown, switch to others
      if (showVolume) props.onTabChange(LeaderboardTab.Volume);
      else if (showPnl) props.onTabChange(LeaderboardTab.Pnl);
    } else if (props.activeTab === LeaderboardTab.Volume && !showVolume) {
      if (showPnl) props.onTabChange(LeaderboardTab.Pnl);
      else if (showPoints) props.onTabChange(LeaderboardTab.Points);
    } else if (props.activeTab === LeaderboardTab.Pnl && !showPnl) {
      if (showVolume) props.onTabChange(LeaderboardTab.Volume);
      else if (showPoints) props.onTabChange(LeaderboardTab.Points);
    }
  }, [currentCampaign, showVolume, showPnl, showPoints]);

  const renderTabs = () => {
    const tabs = [];
    if (showVolume) {
      tabs.push(
        <TabPanel
          key={LeaderboardTab.Volume}
          title={t("tradingLeaderboard.tradingVolume")}
          value={LeaderboardTab.Volume}
        ></TabPanel>,
      );
    }
    if (showPnl) {
      tabs.push(
        <TabPanel
          key={LeaderboardTab.Pnl}
          title={t("common.pnl")}
          value={LeaderboardTab.Pnl}
        ></TabPanel>,
      );
    }
    if (showPoints) {
      tabs.push(
        <TabPanel
          key={LeaderboardTab.Points}
          title={t("common.points", "Total Points")}
          value={LeaderboardTab.Points}
        ></TabPanel>,
      );
    }

    if (tabs.length === 0) return <div></div>;

    return (
      <Tabs
        value={props.activeTab}
        onValueChange={props.onTabChange as (tab: string) => void}
        variant="contained"
        size="lg"
        key={currentCampaign?.campaign_id}
      >
        {tabs}
      </Tabs>
    );
  };

  return (
    <Flex
      width="100%"
      py={3}
      justify="between"
      className={cn(
        "oui-trading-leaderboard-ranking-tabs",
        "oui-border-b oui-border-line",
        props.className,
      )}
    >
      {renderTabs()}
      {updateTime && (
        <Flex
          itemAlign="start"
          direction={props.isMobile ? "column" : "row"}
          gap={1}
          className={cn(
            props.isMobile ? "oui-text-3xs" : "oui-text-sm",
            "oui-text-base-contrast-36",
          )}
        >
          <span>{t("tradingLeaderboard.lastUpdate")}:</span>
          <span>{updateTime}</span>
        </Flex>
      )}
    </Flex>
  );
};
