import { useMemo } from "react";
import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { CustomFooter } from "@/components/custom/customFooter";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import {
  PortfolioLayoutWidget,
  PortfolioLeftSidebarPath,
} from "@/packages/portfolio";

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

  return (
    <BaseLayout initialMenu={PathEnum.Strategy}>
      <Outlet />
    </BaseLayout>
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
