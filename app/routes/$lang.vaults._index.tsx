import { MetaFunction } from "@remix-run/node";
import { PageTitleMap, PathEnum } from "@/constant";
import { VaultsPage } from "@/packages/vaults";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  // return [{ title: generatePageTitle(PageTitleMap[PathEnum.Vaults]) }];
  return [{ title: `Vault | Dexless` }];
};

export default function VaultsIndexPage() {
  return <VaultsPage />;
}
