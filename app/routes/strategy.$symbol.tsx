import { ReactNode, useCallback, useEffect, useState } from "react";
import { MetaFunction } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { PathEnum } from "@/constant";
import { GirdPage } from "@/gridPage/pages/trading";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { updateSymbol } from "@/storage";
import { formatSymbol, generatePageTitle } from "@/utils";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

export default function StrategyPage() {
  const config = useOrderlyConfig();
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      navigate(`${PathEnum.Strategy}/${symbol}`);
    },
    [navigate],
  );

  // Show TradingPage with custom grid bot section below
  return (
    <GirdPage
      symbol={symbol}
      onSymbolChange={onSymbolChange}
      tradingViewConfig={config.tradingPage.tradingViewConfig}
      sharePnLConfig={config.tradingPage.sharePnLConfig}
    />
  );
}
