import { useMemo } from "react";
import { useMarketsContext } from "../marketsProvider";

export const useEXchanges = () => {
  const { comparisonProps } = useMarketsContext();
  const brokerName = comparisonProps?.exchangesName || "Dexless";
  const brokerIconSrc =
    comparisonProps?.exchangesIconSrc || "/images/dexless/dexless_logo.svg";
  const exchanges = useMemo<string[]>(() => {
    return [
      brokerName,
      "Binance",
      `${brokerName} - Binance`,
      "OKX",
      `${brokerName} - OKX`,
      "Bybit",
      `${brokerName} - Bybit`,
      "dYdX",
      `${brokerName} - dYdX`,
      "Bitget",
      `${brokerName} - Bitget`,
      "KuCoin",
      `${brokerName} - KuCoin`,
    ];
  }, [comparisonProps?.exchangesName]);
  return {
    exchanges,
    brokerName,
    brokerIconSrc: brokerIconSrc,
  };
};
