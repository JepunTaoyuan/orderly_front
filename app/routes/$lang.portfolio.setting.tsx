import { MetaFunction } from "@remix-run/node";
import { SettingModule } from "@orderly.network/portfolio";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Setting]) }];
};

export default function SettingsPage() {
  return <SettingModule.SettingPage />;
}
