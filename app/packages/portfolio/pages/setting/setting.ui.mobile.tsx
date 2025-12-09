import { FC, useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Card,
  Flex,
  Switch,
  Text,
  ChevronRightIcon,
} from "@orderly.network/ui";
import { AuthGuardTooltip } from "@orderly.network/ui-connector";
import { LanguageSwitcherWidget } from "@/packages/ui-scaffold";
import type { SettingScriptReturns } from "./setting.script";

export const SettingMobile: FC<SettingScriptReturns> = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const onLanguageChange = () => {
    setOpen(true);
  };

  return (
    <Flex direction={"column"} itemAlign={"start"} className="oui-bg-base-9">
      <Card
        title={
          <Text className="oui-font-semibold" style={{ fontSize: "14px" }}>
            Settings
          </Text>
        }
        id="portfolio-apikey-manager"
        className="oui-bg-base-9 oui-px-0 oui-py-2"
        style={{
          width: "100%",
        }}
      >
        <Flex
          direction={"row"}
          itemAlign={"start"}
          style={{ width: "100%" }}
          className="oui-border-t-2 oui-border-line-6 oui-font-semibold oui-flex-1"
        ></Flex>
      </Card>
      <div
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          marginTop: "8px",
          borderRadius: ".375rem",
        }}
      >
        <Flex
          intensity={900}
          r="md"
          itemAlign="center"
          style={{ width: "100%", backgroundColor: "rgba(255, 255, 255, 0)" }}
        >
          <LanguageSwitcherWidget open={open} onOpenChange={setOpen} />
          <Flex
            className="oui-cursor-pointer"
            itemAlign="center"
            width="100%"
            onClick={onLanguageChange}
          >
            <Text
              size="base"
              weight="semibold"
              intensity={80}
              className="oui-ml-2"
            >
              {t("languageSwitcher.language")}
            </Text>
          </Flex>
        </Flex>
      </div>
      <Card
        title={
          <Flex justify="between" itemAlign="center" width="100%">
            <Text style={{ fontSize: "13px", marginBottom: "-4px" }}>
              {t("portfolio.setting.systemUpgrade")}
            </Text>
            <AuthGuardTooltip align="end">
              <Switch
                checked={props.maintenance_cancel_orders}
                onCheckedChange={(e) => props.setMaintainConfig(e)}
                disabled={props.isSetting || !props.canTouch}
              />
            </AuthGuardTooltip>
          </Flex>
        }
        classNames={{
          content: "!oui-pt-3",
        }}
        id="portfolio-apikey-manager"
        className="oui-font-semibold oui-rounded-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          marginTop: "8px",
          padding: "10px",
        }}
      >
        <Flex
          direction={"row"}
          gap={2}
          itemAlign={"center"}
          pt={2}
          className="oui-border-t-2 oui-border-line-6 oui-font-semibold"
        >
          <Flex direction={"column"} itemAlign={"start"} className="oui-flex-1">
            <Text intensity={80} style={{ fontSize: "12px" }}>
              {t("portfolio.setting.cancelOpenOrders")}
            </Text>
            <Text intensity={54} style={{ fontSize: "12px" }}>
              {t("portfolio.setting.cancelOpenOrders.description")}
            </Text>
          </Flex>
        </Flex>
      </Card>

      {
        <Card
          title={
            <Flex justify="between" itemAlign="center" width="100%">
              <Text style={{ fontSize: "13px", marginBottom: "-4px" }}>
                {t("portfolio.setting.soundAlerts")}
              </Text>
              <AuthGuardTooltip align="end">
                <Switch
                  checked={props.soundAlert}
                  onCheckedChange={(checked) => props.setSoundAlert(checked)}
                  disabled={!props.canTouch}
                  data-testid="oui-testid-setting-sound-switch-btn"
                />
              </AuthGuardTooltip>
            </Flex>
          }
          id="portfolio-sound-alert-setting"
          className="oui-font-semibold oui-w-full oui-rounded-md"
          classNames={{
            content: "!oui-pt-3",
          }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            marginTop: "8px",
            padding: "10px",
          }}
        >
          <Flex
            direction={"row"}
            gap={2}
            itemAlign={"center"}
            pt={2}
            className="oui-border-t-2 oui-border-line-6 oui-font-semibold"
          >
            <Flex
              direction={"column"}
              itemAlign={"start"}
              className="oui-flex-1"
            >
              <Text intensity={54} style={{ fontSize: "12px" }}>
                {t("portfolio.setting.soundAlerts.description")}
              </Text>
            </Flex>
          </Flex>
        </Card>
      }
    </Flex>
  );
};
