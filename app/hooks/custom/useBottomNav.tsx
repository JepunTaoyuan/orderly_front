import { useMemo } from "react";
import { i18n, useTranslation } from "@orderly.network/i18n";
// import {
//   TradingActiveIcon,
//   TradingInactiveIcon,
//   PortfolioActiveIcon,
//   PortfolioInactiveIcon,
//   LeaderboardActiveIcon,
//   LeaderboardInactiveIcon,
//   MarketsActiveIcon,
//   MarketsInactiveIcon,
// } from "@orderly.network/ui";
import type { BottomNavProps } from "@/packages/ui-scaffold";
import {
  LeaderboardIcon,
  LeaderboardActiveIcon,
} from "../../components/icons/leaderboardIcon";
import {
  MarketsIcon,
  MarketsActiveIcon,
} from "../../components/icons/marketsIcon";
import {
  PortfolioIcon,
  PortfolioActiveIcon,
} from "../../components/icons/portfolioIcon";
import {
  RewardsIcon,
  RewardsActiveIcon,
} from "../../components/icons/rewardsIcon";
import { SwapIcon, SwapActiveIcon } from "../../components/icons/swapIcon";
import {
  TradingIcon,
  TradingActiveIcon,
} from "../../components/icons/tradingIcon";

export const useBottomNav = (): BottomNavProps => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      mainMenus: [
        {
          name: t("common.portfolio"),
          href: "/portfolio",
          activeIcon: <PortfolioActiveIcon />,
          inactiveIcon: <PortfolioIcon />,
        },
        {
          name: t("common.trading"),
          href: "/",
          activeIcon: <TradingActiveIcon />,
          inactiveIcon: <TradingIcon />,
        },
        {
          name: t("common.markets"),
          href: "/markets",
          activeIcon: <MarketsActiveIcon />,
          inactiveIcon: <MarketsIcon />,
        },
        {
          name: t("common.affiliate"),
          href: "/rewards/affiliate",
          activeIcon: <RewardsActiveIcon />,
          inactiveIcon: <RewardsIcon />,
        },
        {
          name: t("tradingLeaderboard.leaderboard"),
          href: "/leaderboard",
          activeIcon: <LeaderboardActiveIcon />,
          inactiveIcon: <LeaderboardIcon />,
        },
        {
          name: t("common.swap"),
          href: "/swap",
          activeIcon: <SwapActiveIcon />,
          inactiveIcon: <SwapIcon />,
        },
      ],
    }),
    [t],
  );
};
