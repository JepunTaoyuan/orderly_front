import { MetaFunction } from "@remix-run/node";
import { HistoryModule } from "@orderly.network/portfolio";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.History]) }];
};

export default function HistoryPage() {
  return <HistoryModule.HistoryPage />;
}
