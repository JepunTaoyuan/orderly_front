import { MetaFunction } from "@remix-run/node";
import { PageTitleMap, PathEnum } from "@/constant";
import { APIManagerModule } from "@/packages/portfolio";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.ApiKey]) }];
};

export default function APIKeyPage() {
  return <APIManagerModule.APIManagerPage />;
}
