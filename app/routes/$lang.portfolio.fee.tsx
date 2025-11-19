import { MetaFunction } from "@remix-run/node";
import { PageTitleMap, PathEnum } from "@/constant";
import { FeeTierModule } from "@/packages/portfolio";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.FeeTier]) }];
};

export default function FeeTierPage() {
  return <FeeTierModule.FeeTierPage />;
}
