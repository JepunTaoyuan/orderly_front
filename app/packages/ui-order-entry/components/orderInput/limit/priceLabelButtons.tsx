import { useTranslation } from "@orderly.network/i18n";
import { Flex, cn, modal, Text } from "@orderly.network/ui";
import { OrderEntryScriptReturn } from "../../../orderEntry.script";
import { BBOStatus } from "../../../utils";

type PriceLabelButtonsProps = {
  bbo: Pick<
    OrderEntryScriptReturn,
    "bboStatus" | "bboType" | "onBBOChange" | "toggleBBO"
  >;
  fillMiddleValue: OrderEntryScriptReturn["fillMiddleValue"];
};

export const PriceLabelButtons = (props: PriceLabelButtonsProps) => {
  const { bbo, fillMiddleValue } = props;
  const { t } = useTranslation();

  return (
    <Flex itemAlign="center" gap={1} className="oui-text-2xs">
      {/* BBO Button */}
      <Flex
        px={2}
        height={20}
        justify="center"
        itemAlign="center"
        r="base"
        className={cn(
          "oui-cursor-pointer oui-select-none oui-border",
          bbo.bboStatus === BBOStatus.ON
            ? "oui-border-primary"
            : "oui-border-line-12",
          bbo.bboStatus === BBOStatus.DISABLED && "oui-cursor-not-allowed",
        )}
        onClick={() => {
          if (bbo.bboStatus === BBOStatus.DISABLED) {
            modal.dialog({
              title: t("common.tips"),
              size: "xs",
              content: (
                <Text intensity={54}>{t("orderEntry.bbo.disabled.tips")}</Text>
              ),
            });
          } else {
            bbo.toggleBBO();
          }
        }}
      >
        <Text
          className={cn(
            bbo.bboStatus === BBOStatus.ON && "oui-text-primary",
            bbo.bboStatus === BBOStatus.OFF && "oui-text-base-contrast-54",
            bbo.bboStatus === BBOStatus.DISABLED && "oui-text-base-contrast-20",
          )}
        >
          {t("orderEntry.bbo")}
        </Text>
      </Flex>

      {/* Mid Button */}
      <Text
        className="oui-select-none oui-cursor-pointer oui-text-primary"
        onClick={fillMiddleValue}
      >
        Mid
      </Text>
    </Flex>
  );
};
