import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function StrategyLayout() {
  return (
    <BaseLayout initialMenu={PathEnum.Strategy}>
      <Outlet />
    </BaseLayout>
  );
}
