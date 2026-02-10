import { Outlet } from "@remix-run/react";
import { TradingRewardsLayoutWidget } from "@orderly.network/trading-rewards";
import { BaseLayout } from "@/components/baseLayout";
import { CustomFooter } from "@/components/custom/customFooter";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

// export default function TradingRewardsLayout() {
//   const config = useOrderlyConfig();
//   const path = usePathWithoutLang();

//   const { onRouteChange } = useNav();

//   return (
//     <TradingRewardsLayoutWidget
//       footer={<CustomFooter {...config.scaffold.footerProps} />}
//       mainNavProps={{
//         ...config.scaffold.mainNavProps,
//         // 把子路由移到主路由需要改這
//         // initialMenu: PathEnum.Rewards,
//         initialMenu: PathEnum.RewardsAffiliate,
//       }}
//       routerAdapter={{
//         onRouteChange,
//       }}
//       leftSideProps={{
//         current: path,
//       }}
//     >
//       <Outlet />
//     </TradingRewardsLayoutWidget>
//   );
// }

export default function TradingRewardsLayout() {
  return (
    <BaseLayout initialMenu={PathEnum.RewardsAffiliate}>
      <Outlet />
    </BaseLayout>
  );
}
