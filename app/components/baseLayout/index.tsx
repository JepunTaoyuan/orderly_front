import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { CustomFooter } from "@/components/custom/customFooter";
import { PathEnum } from "@/constant";
import { useBottomNav } from "@/hooks/custom/useBottomNav";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { Scaffold, ScaffoldProps } from "@/packages/ui-scaffold";

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
              name: t("common.markets"),
              href: "/markets",
            },
            {
              name: t("common.trading"),
              href: "/",
            },
            {
              name: t("common.portfolio"),
              href: "/portfolio",
            },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: "/leaderboard",
            },
          ],
          telegramUrl: "https://t.me/orderlynetwork",
          twitterUrl: "https://twitter.com/OrderlyNetwork",
          discordUrl: "https://discord.com/invite/orderlynetwork",
          feedbackUrl: "https://orderly.network/feedback",
        },
      }}
      footer={<CustomFooter {...config.scaffold.footerProps} />}
      bottomNavProps={bottomNavProps}
      routerAdapter={{
        onRouteChange,
      }}
      classNames={{
        ...props.classNames,
        footer: "oui-border-none oui-bg-base-9",
      }}
    >
      {props.children}
    </Scaffold>
  );
};
