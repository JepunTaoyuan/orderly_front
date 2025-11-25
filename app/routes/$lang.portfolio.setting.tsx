import { MetaFunction } from "@remix-run/node";
import { PageTitleMap, PathEnum } from "@/constant";
import { SettingModule } from "@/packages/portfolio";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Setting]) }];
};

export default function SettingsPage() {
  return <SettingModule.SettingPage />;
}
