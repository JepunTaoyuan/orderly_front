import { Outlet } from "@remix-run/react";
import { useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function LeaderboardLayout() {
  const { isDesktop } = useScreen();

  return (
    <BaseLayout
      initialMenu={PathEnum.Leaderboard}
      classNames={{
        root: isDesktop ? "oui-overflow-hidden" : undefined,
      }}
    >
      <Outlet />
    </BaseLayout>
  );
}
