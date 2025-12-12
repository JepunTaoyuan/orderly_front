import { MetaFunction } from "@remix-run/node";
import { PageTitleMap, PathEnum } from "@/constant";
import { HistoryModule } from "@/packages/portfolio";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.History]) }];
};

export default function HistoryPage() {
  return <HistoryModule.HistoryPage />;
}
