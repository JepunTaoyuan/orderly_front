import { MetaFunction } from "@remix-run/node";
import { HistoryModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.History]) }];
};

export default function HistoryPage() {
  return <HistoryModule.HistoryPage />;
}
