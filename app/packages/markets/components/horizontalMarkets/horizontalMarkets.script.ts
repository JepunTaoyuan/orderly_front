import { useCallback, useEffect, useState } from "react";
import { SIDE_MARKETS_TAB_SORT_STORAGE_KEY } from "../../constant";
import { MarketsTabName } from "../../type";
import { useMarketsContext } from "../marketsProvider";
import { useTabSort } from "../shared/hooks/useTabSort";

export type HorizontalMarketsScriptOptions = {
  activeTab?: MarketsTabName;
  onTabChange?: (tab: MarketsTabName) => void;
};

export type HorizontalMarketsScriptReturn = ReturnType<
  typeof useHorizontalMarketsScript
>;

export function useHorizontalMarketsScript(
  options?: HorizontalMarketsScriptOptions,
) {
  const [activeTab, setActiveTab] = useState<MarketsTabName>(
    options?.activeTab || MarketsTabName.All,
  );

  const { tabSort, onTabSort } = useTabSort({
    storageKey: SIDE_MARKETS_TAB_SORT_STORAGE_KEY,
  });

  const { clearSearchValue } = useMarketsContext();

  const onTabChange = useCallback(
    (value: string) => {
      if (typeof options?.onTabChange === "function") {
        options.onTabChange(value as MarketsTabName);
      } else {
        setActiveTab(value as MarketsTabName);
      }
    },
    [options?.onTabChange],
  );

  useEffect(() => {
    setActiveTab(options?.activeTab || MarketsTabName.All);
  }, [options?.activeTab]);

  useEffect(() => {
    clearSearchValue?.();
  }, [activeTab]);

  return {
    activeTab,
    onTabChange,
    tabSort,
    onTabSort,
  };
}
