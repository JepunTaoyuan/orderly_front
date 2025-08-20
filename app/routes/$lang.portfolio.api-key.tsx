import { MetaFunction } from "@remix-run/node";
import { APIManagerModule } from "@orderly.network/portfolio";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.ApiKey]) }];
};

export default function APIKeyPage() {
  return <APIManagerModule.APIManagerPage />;
}
