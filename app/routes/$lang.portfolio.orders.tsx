import { MetaFunction } from "@remix-run/node";
import { Box } from "@orderly.network/ui";
import { PageTitleMap, PathEnum } from "@/constant";
import { OrdersModule } from "@/packages/portfolio";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Orders]) }];
};

export default function OrdersPage() {
  return (
    <Box
      p={4}
      pb={0}
      intensity={900}
      r="xl"
      width="100%"
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "hidden",
        // Make the table scroll instead of the page scroll
        height: "calc(100vh - 48px - 29px - 48px)",
      }}
    >
      <OrdersModule.OrdersPage />
    </Box>
  );
}
