import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function VaultsLayout() {
  return (
    <BaseLayout initialMenu={PathEnum.Vaults}>
      <Outlet />
    </BaseLayout>
  );
}
