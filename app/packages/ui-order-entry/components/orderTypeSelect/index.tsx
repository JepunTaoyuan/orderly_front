import { useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { OrderSide, OrderType } from "@orderly.network/types";
import { Select, Text, Button, Box, cn } from "@orderly.network/ui";

export const OrderTypeSelect = (props: {
  type: OrderType;
  onChange: (type: OrderType) => void;
  side: OrderSide;
  canTrade: boolean;
}) => {
  const { t } = useTranslation();

  const options = useMemo(() => {
    return [
      {
        label: t("orderEntry.orderType.stopLimit"),
        value: OrderType.STOP_LIMIT,
      },
      {
        label: t("orderEntry.orderType.stopMarket"),
        value: OrderType.STOP_MARKET,
      },
      {
        label: t("orderEntry.orderType.scaledOrder"),
        value: OrderType.SCALED,
      },
      {
        label: t("orderEntry.orderType.trailingStop"),
        value: OrderType.TRAILING_STOP,
      },
    ];
  }, [t]);

  const displayLabelMap = useMemo(() => {
    return {
      [OrderType.STOP_LIMIT]: t("orderEntry.orderType.stopLimit"),
      [OrderType.STOP_MARKET]: t("orderEntry.orderType.stopMarket"),
      [OrderType.SCALED]: t("orderEntry.orderType.scaledOrder"),
      [OrderType.TRAILING_STOP]: t("orderEntry.orderType.trailingStop"),
    };
  }, [t]);
  const isLimitOrMarket =
    props.type === OrderType.LIMIT || props.type === OrderType.MARKET;

  return (
    <div className="oui-flex oui-gap-3">
      {/* Limit Button */}
      <div className="oui-relative">
        <Button
          variant={"text"}
          size="md"
          onClick={() => props.onChange(OrderType.LIMIT)}
          disabled={!props.canTrade}
          className={cn(
            "oui-px-0 hover:oui-bg-transparent active:oui-bg-transparent disabled:oui-bg-transparent",
            props.type === OrderType.LIMIT && "oui-text-base-contrast",
          )}
          style={
            props.type !== OrderType.LIMIT
              ? { color: "rgba(255, 255, 255, 0.5)" }
              : {}
          }
        >
          <Text size="xs">{t("orderEntry.orderType.limit")}</Text>
        </Button>
        {/* Underline for active state */}
        <Box
          invisible={props.type !== OrderType.LIMIT}
          position="absolute"
          bottom={0}
          left={"50%"}
          height={"3px"}
          r="full"
          width={"100%"}
          style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
          className="-oui-translate-x-1/2"
        />
      </div>

      {/* Market Button */}
      <div className="oui-relative">
        <Button
          variant={"text"}
          size="md"
          onClick={() => props.onChange(OrderType.MARKET)}
          disabled={!props.canTrade}
          className={cn(
            "oui-px-0 hover:oui-bg-transparent active:oui-bg-transparent disabled:oui-bg-transparent",
            props.type === OrderType.MARKET && "oui-text-base-contrast",
          )}
          style={
            props.type !== OrderType.MARKET
              ? { color: "rgba(255, 255, 255, 0.5)" }
              : {}
          }
        >
          <Text size="xs">{t("common.marketPrice")}</Text>
        </Button>
        {/* Underline for active state */}
        <Box
          invisible={props.type !== OrderType.MARKET}
          position="absolute"
          bottom={0}
          left={"50%"}
          height={"3px"}
          r="full"
          width={"100%"}
          style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
          className="-oui-translate-x-1/2"
        />
      </div>
      <div className="oui-relative">
        <Select.options
          testid="oui-testid-orderEntry-orderType-button"
          variant="text"
          placeholder={t("orderEntry.orderType.stopLimit")}
          currentValue={props.type}
          value={props.type}
          options={options}
          onValueChange={props.onChange}
          contentProps={{
            className: "",
          }}
          classNames={{
            trigger: " oui-px-0",
          }}
          valueFormatter={(value, option) => {
            const item = options.find((o) => o.value === value);
            if (!item) {
              return <Text size={"xs"}>{option.placeholder}</Text>;
            }

            const label =
              displayLabelMap[value as keyof typeof displayLabelMap];

            return (
              <Text
                size={"xs"}
                style={
                  props.type === OrderType.MARKET ||
                  props.type === OrderType.LIMIT
                    ? {}
                    : { color: "rgba(255, 255, 255, 1)" }
                }
              >
                {label}
              </Text>
            );
          }}
          size={"md"}
        />
        {/* Underline for active state */}
        <Box
          invisible={
            props.type === OrderType.MARKET || props.type === OrderType.LIMIT
          }
          position="absolute"
          bottom={0}
          left={"50%"}
          height={"3px"}
          r="full"
          width={"100%"}
          style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
          className="-oui-translate-x-1/2"
        />
      </div>
    </div>
  );
};
