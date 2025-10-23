import { useCallback, useEffect, useState } from "react";
import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useNavigate, useParams } from "@remix-run/react";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import {
  HorizontalMarketsWidget,
  SymbolInfoBarFullWidget,
} from "@orderly.network/markets";
import { API } from "@orderly.network/types";
import { BaseLayout } from "@/components/baseLayout";
import { CustomOrderEntry } from "@/components/custom/CustomOrderEntry";
import { PathEnum } from "@/constant";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { updateSymbol } from "@/storage";
import { formatSymbol, generatePageTitle } from "@/utils";

export default function TestPageLayout() {
  const config = useOrderlyConfig();
  const params = useParams();
  const [symbol, setSymbol] = useState("PERP_BTC_USDC");
  const navigate = useNavigate();

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      navigate(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`);
    },
    [navigate],
  );

  return (
    <BaseLayout initialMenu={PathEnum.Testpage}>
      <SymbolInfoBarFullWidget
        symbol={symbol}
        onSymbolChange={onSymbolChange}
      />
      <CustomOrderEntry symbol={symbol} />
    </BaseLayout>
  );
}
