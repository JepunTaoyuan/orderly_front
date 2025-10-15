import { useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { RouteOption } from "@orderly.network/ui-scaffold";
import { PathEnum } from "@/constant";
import { getSymbol } from "@/storage";

export function useNav() {
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href);
        return;
      }

      const lang = parseI18nLang(i18n.language);

      if (option.href === "/") {
        const symbol = getSymbol();
        navigate(`/${lang}${PathEnum.Perp}/${symbol}`);
        return;
      }

      // Strategy 需要符號子路由，與 Perp 行為一致
      if (option.href === PathEnum.Strategy) {
        const symbol = getSymbol();
        navigate(`/${lang}${PathEnum.Strategy}/${symbol}`);
        return;
      }

      // if href not equal to the route path, we need to convert it to the route path
      const routeMap = {
        [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
        [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
      } as Record<string, string>;

      const path = routeMap[option.href] || option.href;

      navigate(`/${lang}${path}`);
    },
    [navigate],
  );

  return { onRouteChange };
}
