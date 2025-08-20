import { MetaFunction } from "@remix-run/node";
import { FeeTierModule } from "@orderly.network/portfolio";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.FeeTier]) }];
};

export default function FeeTierPage() {
  return <FeeTierModule.FeeTierPage />;
}
