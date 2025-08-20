import { MetaFunction } from "@remix-run/node";
import { MarketsHomePage } from "@orderly.network/markets";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Markets]) }];
};

export default function MarketsPage() {
  return <MarketsHomePage />;
}
