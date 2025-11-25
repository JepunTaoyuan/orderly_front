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
          src: "/images/dexless/dexless_logo.svg",
          alt: "Dexless",
        },
        mainMenus: [
          {
            name: t("common.markets"),
            href: "/markets",
            isHomePageInMobile: true, // 關鍵屬性
          },
          {
            name: t("common.trading"),
            href: "/",
            isHomePageInMobile: true, // 關鍵屬性
          },
          {
            name: t("common.portfolio"),
            href: "/portfolio",
            isHomePageInMobile: true, // 關鍵屬性
          },
          {
            name: t("tradingLeaderboard.leaderboard"),
            href: "/leaderboard",
            isHomePageInMobile: true, // 關鍵屬性
          },
        ],
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
