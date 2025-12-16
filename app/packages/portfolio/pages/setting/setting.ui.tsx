import { FC } from "react";
import { useScreen } from "@orderly.network/ui";
import { SettingScriptReturns } from "./setting.script";
import { SettingDesktop } from "./setting.ui.desktop";
import { SettingMobile } from "./setting.ui.mobile";

export const Setting: FC<SettingScriptReturns> = (props) => {
  const { isMobile } = useScreen();
  if (isMobile) {
    return <SettingMobile {...props} />;
  }
  return <SettingDesktop {...props} />;
};
