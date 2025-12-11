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
      }}
      routerAdapter={{
        onRouteChange,
      }}
      leftSideProps={{
        current: currentPath,
      }}
    >
      <Outlet />
    </PortfolioLayoutWidget>
  );
}
