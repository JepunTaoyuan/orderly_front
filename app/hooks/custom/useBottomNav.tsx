import { useMemo } from "react";
import { i18n, useTranslation } from "@orderly.network/i18n";
import {
  TradingActiveIcon,
  TradingInactiveIcon,
  PortfolioActiveIcon,
  PortfolioInactiveIcon,
  LeaderboardActiveIcon,
  LeaderboardInactiveIcon,
  MarketsActiveIcon,
  MarketsInactiveIcon,
} from "@orderly.network/ui";
import type { BottomNavProps } from "@/packages/ui-scaffold";

export const useBottomNav = (): BottomNavProps => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      mainMenus: [
        {
          name: t("common.markets"),
          href: "/markets",
          activeIcon: <MarketsActiveIcon />,
          inactiveIcon: <MarketsInactiveIcon />,
        },
        {
          name: t("common.trading"),
          href: "/",
          activeIcon: <TradingActiveIcon />,
          inactiveIcon: <TradingInactiveIcon />,
        },
        {
          name: t("tradingLeaderboard.arena"),
          href: "/leaderboard",
          activeIcon: <LeaderboardActiveIcon />,
          inactiveIcon: <LeaderboardInactiveIcon />,
        },
        {
          name: t("common.portfolio"),
          href: "/portfolio",
          activeIcon: <PortfolioActiveIcon />,
          inactiveIcon: <PortfolioInactiveIcon />,
        },
      ],
    }),
    [t],
  );
};
