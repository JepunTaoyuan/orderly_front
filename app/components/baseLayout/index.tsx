import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { i18n } from "@orderly.network/i18n";
import { VaultsIcon } from "@orderly.network/ui";
import { CustomFooter } from "@/components/custom/customFooter";
import { PathEnum } from "@/constant";
import { useBottomNav } from "@/hooks/custom/useBottomNav";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { Scaffold, ScaffoldProps } from "@/packages/ui-scaffold";
import { LeaderboardIcon } from "../icons/leaderboardIcon";
import { MarketsIcon } from "../icons/marketsIcon";
import { PortfolioIcon } from "../icons/portfolioIcon";
import { RewardsIcon } from "../icons/rewardsIcon";
import { StrategyIcon } from "../icons/strategyIcon";
import { SwapIcon } from "../icons/swapIcon";
import { TradingIcon } from "../icons/tradingIcon";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
};

export const BaseLayout: FC<BaseLayoutProps> = (props) => {
  const config = useOrderlyConfig();

  const bottomNavProps = useBottomNav();

  const { t } = useTranslation();

  const { onRouteChange } = useNav();

  // 檢查是否為 landing page
  const isLandingPage =
    location.pathname === "/" || location.pathname.includes("landing");
  return (
    <Scaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: props.initialMenu || PathEnum.Root,
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
              name: "Rewards",
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
            // {
            //   name: t("common.strategy"),
            //   href: "/strategy",
            //   icon: <StrategyIcon />,
            // },
            {
              name: t("common.vaults"),
              href: "/vaults",
              icon: <VaultsIcon />,
            },
            {
              name: t("common.swap"),
              href: "/swap",
              icon: <SwapIcon />,
            },
          ],
          telegramUrl: "https://t.me/orderlynetwork",
          twitterUrl: "https://twitter.com/OrderlyNetwork",
          discordUrl: "https://discord.com/invite/orderlynetwork",
          feedbackUrl: "https://orderly.network/feedback",
        },
      }}
      footer={null}
      bottomNavProps={bottomNavProps}
      routerAdapter={{
        onRouteChange,
      }}
      classNames={{
        ...props.classNames,
        footer: `${isLandingPage ? "oui-hidden" : "oui-border-none oui-bg-base-9"}`,
      }}
    >
      {props.children}
    </Scaffold>
  );
};
