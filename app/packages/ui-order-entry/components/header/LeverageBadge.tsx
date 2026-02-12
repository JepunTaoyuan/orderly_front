import { useSymbolLeverage } from "@orderly.network/hooks";
import { OrderSide } from "@orderly.network/types";
import { cn, Flex, modal, Text, useScreen } from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import {
  SymbolLeverageDialogId,
  SymbolLeverageSheetId,
} from "@/packages/ui-leverage";

type LeverageBadgeProps = {
  symbol: string;
  side: OrderSide;
  symbolLeverage?: number;
};

export const LeverageBadge = (props: LeverageBadgeProps) => {
  const { symbol, side, symbolLeverage } = props;
  const { isMobile } = useScreen();
  const { maxLeverage } = useSymbolLeverage(symbol);

  const curLeverage = symbolLeverage || maxLeverage;

  const showModal = () => {
    const modalId = isMobile ? SymbolLeverageSheetId : SymbolLeverageDialogId;
    modal.show(modalId, {
      symbol,
      side,
      curLeverage,
    });
  };

  return (
    <Flex
      justify="center"
      itemAlign="center"
      gapX={1}
      className={cn(
        "oui-rounded-lg oui-h-7 oui-px-3",
        "oui-cursor-pointer oui-select-none oui-text-xs oui-font-semibold oui-text-base-contrast-54",
      )}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      onClick={showModal}
    >
      <Text>Cross</Text>
      <Text.numeral dp={0} rm={Decimal.ROUND_DOWN} unit="X">
        {curLeverage}
      </Text.numeral>
    </Flex>
  );
};
