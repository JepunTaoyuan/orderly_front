import { useTranslation } from "@orderly.network/i18n";
import { OrderlyOrder, OrderSide, OrderType } from "@orderly.network/types";
import { Button, cn, Flex, useMediaQuery } from "@orderly.network/ui";
import { OrderTypeSelect } from "../orderTypeSelect";
import { LeverageBadge } from "./LeverageBadge";

type OrderEntryHeaderProps = {
  symbol: string;
  side: OrderSide;
  canTrade: boolean;
  order_type: OrderType;
  setOrderValue: (key: keyof OrderlyOrder, value: any) => void;
  symbolLeverage?: number;
};

export function OrderEntryHeader(props: OrderEntryHeaderProps) {
  const { canTrade, side, order_type, setOrderValue } = props;
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <div
        className={cn(
          "oui-grid oui-w-full oui-flex-1 oui-gap-x-2 lg:oui-flex lg:oui-gap-x-[6px]",
          "oui-grid-cols-2",
        )}
      >
        <Button
          onClick={() => {
            props.setOrderValue("side", OrderSide.BUY);
          }}
          size={"lg"}
          fullWidth
          data-type={OrderSide.BUY}
          className={cn("oui-rounded-full")}
          style={{
            background:
              side === OrderSide.BUY && canTrade
                ? "linear-gradient(90deg, #46CCB9 32%, #00E49C 100%)"
                : "rgba(255, 255, 255, 0.30)",
          }}
          data-testid="oui-testid-orderEntry-side-buy-button"
        >
          {t("common.buy")}
        </Button>
        <Button
          onClick={() => {
            props.setOrderValue("side", OrderSide.SELL);
          }}
          className={cn("oui-rounded-full")}
          data-type={OrderSide.SELL}
          fullWidth
          size={"lg"}
          style={{
            background:
              side === OrderSide.SELL && canTrade
                ? "linear-gradient(90deg, #F34EA3 55%, #CC55BC 100%)"
                : "rgba(255, 255, 255, 0.30)",
          }}
          data-testid="oui-testid-orderEntry-side-sell-button"
        >
          {t("common.sell")}
        </Button>
      </div>
      <Flex
        className={cn(
          isSmallScreen
            ? "oui-grid-cols-1 oui-gap-y-2"
            : "oui-grid-cols-2 oui-gap-x-2",
          "oui-grid lg:oui-flex lg:oui-gap-x-[6px]",
        )}
      >
        <div className="oui-w-full oui-min-w-0">
          <OrderTypeSelect
            type={order_type!}
            side={side}
            canTrade={canTrade}
            onChange={(type) => {
              setOrderValue("order_type", type);
            }}
          />
        </div>
        <div className="oui-w-full oui-min-w-0">
          <LeverageBadge
            symbol={props.symbol}
            side={props.side}
            symbolLeverage={props.symbolLeverage}
          />
        </div>
      </Flex>
    </>
  );
}
