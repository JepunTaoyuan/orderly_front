import { useEffect } from "react";
import {
  useSymbolLeverage,
  useLeverage,
  useLeverageBySymbol,
} from "@orderly.network/hooks";
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
  const { curLeverage: accountLeverage } = useLeverage();
  const { maxLeverage } = useSymbolLeverage(symbol);
  const symbolCurrentLeverage = useLeverageBySymbol(symbol);

  // 優先使用 useLeverageBySymbol 的實時值，然後是 prop 傳入的 symbolLeverage，最後是帳戶槓桿或最大槓桿
  const displayLeverage =
    symbolCurrentLeverage ||
    symbolLeverage ||
    accountLeverage ||
    maxLeverage ||
    1;

  const showModal = () => {
    const modalId = isMobile ? SymbolLeverageSheetId : SymbolLeverageDialogId;
    modal.show(modalId, {
      symbol,
      side,
      curLeverage: symbolCurrentLeverage || accountLeverage,
    });
  };

  return (
    <Flex
      justify="center"
      itemAlign="center"
      gapX={1}
      className={cn(
        "oui-h-8 oui-w-full",
        "oui-rounded oui-border oui-border-line oui-bg-base-6",
        "oui-cursor-pointer oui-select-none oui-text-xs oui-font-semibold oui-text-base-contrast-54",
      )}
      onClick={showModal}
    >
      <Text>Cross</Text>
      <Text.numeral dp={0} rm={Decimal.ROUND_DOWN} unit="X">
        {displayLeverage}
      </Text.numeral>
    </Flex>
  );
};
