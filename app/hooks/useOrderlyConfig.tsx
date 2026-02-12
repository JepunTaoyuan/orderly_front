import { useMemo } from "react";
import { type RestrictedInfoOptions } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { AppLogos } from "@orderly.network/react-app";
import { TradingPageProps } from "@orderly.network/trading";
import { PathEnum } from "@/constant";
import { FooterProps, MainNavWidgetProps } from "@/packages/ui-scaffold";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
    restrictedInfo?: RestrictedInfoOptions;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

export const useOrderlyConfig = () => {
  const { t } = useTranslation();

  return useMemo<OrderlyConfig>(() => {
    return {
      scaffold: {
        mainNavProps: {
          mainMenus: [
            // { name: t("common.landingPage"), href: PathEnum.LandingPage },
            { name: t("common.trading"), href: PathEnum.Root },
            { name: t("common.portfolio"), href: PathEnum.Portfolio },
            { name: t("common.markets"), href: PathEnum.Markets },
            {
              name: t("tradingRewards.rewards"),
              href: PathEnum.RewardsAffiliate,
              // 關掉原本
              // href: PathEnum.Rewards,
              // children: [
              //   {
              //     name: t("common.tradingRewards"),
              //     href: PathEnum.RewardsTrading,
              //     description: t("extend.tradingRewards.description"),
              //   },
              //   {
              //     name: t("common.affiliate"),
              //     href: PathEnum.RewardsAffiliate,
              //     tag: t("extend.affiliate.tag"),
              //     description: t("extend.affiliate.description"),
              //   },
              //   {
              //     name: t("extend.staking"),
              //     href: "https://app.orderly.network/staking",
              //     description: t("extend.staking.description"),
              //     target: "_blank",
              //     icon: <OrderlyIcon size={14} />,
              //     activeIcon: <OrderlyActiveIcon size={14} />,
              //   },
              // ],
            },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
            },
            // { name: t("common.strategy"), href: PathEnum.Strategy },
            { name: t("common.vaults"), href: PathEnum.Vaults },
            { name: t("common.swap"), href: PathEnum.Swap },
          ],
          initialMenu: PathEnum.Root,
        },
        footerProps: {
          // telegramUrl: "https://orderly.network",
          // discordUrl: "https://discord.com/invite/orderlynetwork",
          twitterUrl: "https://x.com/dexlessex",
        },
      },
      orderlyAppProvider: {
        appIcons: {
          main: {
            component: (
              <img
                alt="Orderly logo"
                src="/images/dexless/dexless_logo.svg"
                style={{ width: 100, height: 40 }}
              />
            ),
          },
          secondary: {
            img: "/images/dexless/dexless_logo.svg",
          },
        },
        restrictedInfo: {
          enableDefault: true,
          customRestrictedIps: [],
          customRestrictedRegions: [],
        },
      },
      tradingPage: {
        tradingViewConfig: {
          // scriptSRC: "/tradingview/charting_library/charting_library.js",
          // library_path: "/tradingview/charting_library/",
          // customCssUrl: "/tradingview/chart.css",
        },
        sharePnLConfig: {
          backgroundImages: [
            "/images/pnl/bg01.png",
            "/images/pnl/bg02.png",
            "/images/pnl/bg03.png",
            "/images/pnl/bg04.png",
            "/images/pnl/bg05.png",
            "/images/pnl/bg06.png",
            "/images/pnl/bg07.png",
            "/images/pnl/bg08.png",
            "/images/pnl/bg09.png",
            "/images/pnl/bg10.png",
          ],

          color: "rgba(255, 255, 255, 0.98)",
          profitColor: "rgba(41, 223, 169, 1)",
          lossColor: "rgba(245, 97, 139, 1)",
          brandColor: "rgba(255, 255, 255, 0.98)",

          // ref
          refLink: "https://orderly.network",
          refSlogan: "Orderly referral",
        },
      },
    };
  }, [t]);
};
