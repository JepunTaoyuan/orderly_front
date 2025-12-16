import { MouseEventHandler, useCallback } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Flex, Text, cn, Column } from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import { DeleteIcon, TopIcon } from "../../icons";
import { FavoriteInstance } from "../../type";
import {
  get24hPercentageColumn,
  getLastColumn,
  getSymbolColumn,
} from "../shared/column";
import { useSideMarketsColumns } from "../sideMarkets/column";

export const useDropDownMarketsColumns = () => {
  const { t } = useTranslation();

  return useCallback(
    (favorite: FavoriteInstance, isFavoriteList = false) => {
      return useSideMarketsColumns(favorite, isFavoriteList);
    },
    [t],
  );
};
