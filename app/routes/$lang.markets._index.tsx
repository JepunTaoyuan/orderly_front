import { useCallback } from "react";
import { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { API } from "@orderly.network/types";
import { PageTitleMap, PathEnum } from "@/constant";
import { MarketsHomePage } from "@/packages/markets";
import { updateSymbol } from "@/storage";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Markets]) }];
};

export default function MarketsPage() {
  const navigate = useNavigate();

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      updateSymbol(symbol);
      navigate(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`);
    },
    [navigate],
  );

  return <MarketsHomePage onSymbolChange={onSymbolChange} />;
}
