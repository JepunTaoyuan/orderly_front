import { MetaFunction } from "@remix-run/node";
import { PageTitleMap, PathEnum } from "@/constant";
import { MarketsHomePage } from "@/packages/markets";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Markets]) }];
};

export default function MarketsPage() {
  return <MarketsHomePage />;
}
