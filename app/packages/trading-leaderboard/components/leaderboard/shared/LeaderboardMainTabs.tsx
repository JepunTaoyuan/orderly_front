import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, TabPanel, Tabs, useScreen } from "@orderly.network/ui";

export type LeaderboardMainTab = "leaderboard" | "myPoints";

export type LeaderboardMainTabsProps = {
  activeTab: LeaderboardMainTab;
  onTabChange: (tab: LeaderboardMainTab) => void;
  className?: string;
};

export const LeaderboardMainTabs: FC<LeaderboardMainTabsProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  return (
    <Tabs
      value={props.activeTab}
      onValueChange={(value) => props.onTabChange(value as LeaderboardMainTab)}
      variant="text"
      size={isMobile ? "sm" : "sm"}
      className={cn("oui-pt-2", props.className)}
    >
      <TabPanel
        title={t("tradingLeaderboard.leaderboard", "Leaderboard")}
        value="leaderboard"
      />
      <TabPanel
        title={t("tradingLeaderboard.myPoints", "My Points")}
        value="myPoints"
      />
    </Tabs>
  );
};
