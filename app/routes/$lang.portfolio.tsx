import { useMemo } from "react";
import { Outlet } from "@remix-run/react";
import { useTranslation } from "@orderly.network/i18n";
import { BaseLayout } from "@/components/baseLayout";
import { CustomFooter } from "@/components/custom/customFooter";
import { VaultsIcon } from "@/components/icons/vaultsIcon";
import { PathEnum } from "@/constant";
import { useBottomNav } from "@/hooks/custom/useBottomNav";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import {
  PortfolioLayoutWidget,
  PortfolioLeftSidebarPath,
} from "@/packages/portfolio";
import { LeaderboardIcon } from "../components/icons/leaderboardIcon";
import { MarketsIcon } from "../components/icons/marketsIcon";
import { PortfolioIcon } from "../components/icons/portfolioIcon";
import { RewardsIcon } from "../components/icons/rewardsIcon";
import { StrategyIcon } from "../components/icons/strategyIcon";
import { TradingIcon } from "../components/icons/tradingIcon";

export default function PortfolioLayout() {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();

  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (path.endsWith(PathEnum.FeeTier))
      return PortfolioLeftSidebarPath.FeeTier;

    if (path.endsWith(PathEnum.ApiKey)) return PortfolioLeftSidebarPath.ApiKey;

    return path;
  }, [path]);
  const bottomNavProps = useBottomNav();

  const { t } = useTranslation();
  return (
    <PortfolioLayoutWidget
      footer={<CustomFooter {...config.scaffold.footerProps} />}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: PathEnum.Portfolio,
        logo: {
          src: "../../public/images/dexless/dexless_logo.svg",
          alt: "Dexless",
        },
        mainMenus: config.scaffold.mainNavProps?.mainMenus?.map((menu) => {
          return { ...menu, isHomePageInMobile: true };
        }),
        leftNav: {
          menus: [
            {
              name: t("common.trading"),
              href: "/",
              icon: <TradingIcon />,
            },
            {
              name: t("common.markets"),
              href: "/markets",
              icon: <MarketsIcon />,
            },
            {
              name: t("common.affiliate"),
              href: "/rewards/affiliate",
              icon: <RewardsIcon />,
            },
            {
              name: t("common.portfolio"),
              href: "/portfolio",
              icon: <PortfolioIcon />,
            },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: "/leaderboard",
              icon: <LeaderboardIcon />,
            },
            {
              name: t("common.strategy"),
              href: "/strategy",
              icon: <StrategyIcon />,
            },
            {
              name: t("common.vaults"),
              href: "/vaults",
              icon: <VaultsIcon />,
            },
          ],
          telegramUrl: "https://t.me/orderlynetwork",
          twitterUrl: "https://twitter.com/OrderlyNetwork",
          discordUrl: "https://discord.com/invite/orderlynetwork",
          feedbackUrl: "https://orderly.network/feedback",
        },
      }}
      bottomNavProps={bottomNavProps}
      routerAdapter={{
        onRouteChange,
      }}
      leftSideProps={{
        current: currentPath,
      }}
    >
      <Outlet />
    </PortfolioLayoutWidget>
    // <PortfolioLayoutWidget
    //   footer={<CustomFooter {...config.scaffold.footerProps} />}
    //   mainNavProps={{
    //     ...config.scaffold.mainNavProps,
    //     initialMenu: PathEnum.Portfolio,
    //   }}
    //   routerAdapter={{
    //     onRouteChange,
    //   }}
    //   leftSideProps={{
    //     current: currentPath,
    //   }}
    // >
    //   <Outlet />
    // </PortfolioLayoutWidget>
  );
}
