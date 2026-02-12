import { useMemo } from "react";
import { MetaFunction } from "@remix-run/node";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { Box, useScreen } from "@orderly.network/ui";
import { PageTitleMap, PathEnum } from "@/constant";
import { Campaign, LeaderboardWidget } from "@/packages/trading-leaderboard";
import { useScaffoldContext } from "@/packages/ui-scaffold";
import { getSymbol } from "@/storage";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Leaderboard]) }];
};

function getCampaigns() {
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const dateRange = [
    // ongoing
    { startTime: addDays(new Date(), -1), endTime: addDays(new Date(), 30) },
    // future
    { startTime: addDays(new Date(), 1), endTime: addDays(new Date(), 30) },
    // past
    { startTime: addDays(new Date(), -30), endTime: addDays(new Date(), -1) },
  ];

  return dateRange.map(
    (date) =>
      ({
        title: i18n.t("leaderboard.riseAbove"),
        description: i18n.t("leaderboard.riseAboveDescription"),
        image: "/images/leaderboard/campaign.jpg",
        href: "https://orderly.network/",
        ...date,
      }) as Campaign,
  );
}

export default function MarketsPage() {
  const { isMobile } = useScreen();
  const { topNavbarHeight, footerHeight, announcementHeight } =
    useScaffoldContext();

  const tradingUrl = useMemo(() => {
    const symbol = getSymbol();
    return `/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`;
  }, []);

  return (
    <Box
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "hidden",
        height: isMobile
          ? "100%"
          : `calc(100vh - ${topNavbarHeight}px - ${footerHeight}px - ${
              announcementHeight ? announcementHeight + 12 : 0
            }px)`,
      }}
    >
      <LeaderboardWidget
        campaigns={getCampaigns()}
        href={{
          trading: tradingUrl,
        }}
        className="oui-py-5"
      />
    </Box>
  );
}
