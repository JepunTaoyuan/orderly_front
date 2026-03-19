import { useMemo } from "react";
import { MetaFunction } from "@remix-run/node";
import { useAccount, useWalletConnector } from "@orderly.network/hooks";
import { i18n, parseI18nLang, useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import { AccountStatusEnum } from "@orderly.network/types";
import { Box, useScreen } from "@orderly.network/ui";
import LeaderboardConnect from "@/components/custom/LeaderboardConnect";
import { PageTitleMap, PathEnum } from "@/constant";
import { Campaign, LeaderboardWidget } from "@/packages/trading-leaderboard";
import { useScaffoldContext } from "@/packages/ui-scaffold";
import { getSymbol } from "@/storage";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  // return [{ title: generatePageTitle(PageTitleMap[PathEnum.Leaderboard]) }];
  return [{ title: `Leaderboard | Dexless` }];
};

function getCampaigns() {
  const { t } = useTranslation();

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
        title: t("leaderboard.riseAbove"),
        description: t("leaderboard.riseAboveDescription"),
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

  // 2. 取得當前帳號狀態
  const { state } = useAccount();
  const { connect } = useWalletConnector();
  const { wrongNetwork } = useAppContext();

  const tradingUrl = useMemo(() => {
    const symbol = getSymbol();
    return `/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`;
  }, []);

  // 3. 判斷是否未連接：如果狀態小於 Connected，顯示替代畫面
  if (state.status < AccountStatusEnum.Connected || wrongNetwork) {
    return (
      <Box
        className="oui-flex oui-items-center oui-justify-center"
        style={{
          height: `calc(100vh - ${topNavbarHeight}px - ${footerHeight}px)`, // 讓它撐滿螢幕居中
        }}
      >
        <LeaderboardConnect onConnect={connect} />
      </Box>
    );
  }
  return (
    <Box
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "auto",
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
