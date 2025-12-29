import React, { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import {
  Flex,
  Text,
  Box,
  Tooltip,
  modal,
  gradientTextVariants,
  cn,
  EditIcon,
} from "@orderly.network/ui";
import { LeverageWidgetWithDialogId } from "@/packages/ui-leverage";
import { TooltipContent } from "../assetView/assetView.ui";
import { RiskRateState } from "./riskRate.script";

export const RiskRate: FC<RiskRateState> = (props) => {
  const { riskRate, riskRateColor, currentLeverage, maxLeverage } = props;
  const { isHigh, isMedium, isLow } = riskRateColor;
  const { wrongNetwork } = useAppContext();
  const { t } = useTranslation();

  const textColor = wrongNetwork
    ? ""
    : isHigh
      ? "oui-text-danger"
      : isMedium
        ? "oui-text-warning-darken"
        : isLow
          ? gradientTextVariants({ color: "brand" })
          : "";

  return (
    <Box data-risk={""} className="oui-space-y-2">
      <Flex direction="row" justify="between">
        <Tooltip
          content={
            <TooltipContent
              description={t("trading.riskRate.tooltip")}
              formula={t("trading.riskRate.formula")}
            />
          }
        >
          <Text
            size="2xs"
            color="neutral"
            weight="semibold"
            className={cn(
              "oui-cursor-pointer",
              "oui-border-b oui-border-dashed oui-border-b-white/10",
            )}
          >
            {t("trading.riskRate")}
          </Text>
        </Tooltip>
        <Text
          size="xs"
          color="neutral"
          weight="semibold"
          style={{ color: "#678bd5" }}
        >
          {riskRate ?? "--"}
        </Text>
      </Flex>
      <Flex
        itemAlign="center"
        justify="start"
        className="oui-w-full oui-bg-base-6 oui-rounded-full oui-h-2 oui-px-[1px]"
      >
        <Box
          style={{
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #26fefe, #cf4aff 50%, #d92d6b)",
            width: riskRate && riskRate !== "--" ? riskRate : "100%",
            opacity: 0.4,
            height: "6px",
          }}
        />
      </Flex>
    </Box>
  );
};
