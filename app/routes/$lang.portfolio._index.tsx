import { MetaFunction } from "@remix-run/node";
import { OverviewModule } from "@orderly.network/portfolio";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Portfolio]) }];
};

export default function PortfolioPage() {
  return <OverviewModule.OverviewPage />;
}
