import React, { useRef, useCallback } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Box,
  CloseCircleFillIcon,
  cn,
  Input,
  InputProps,
} from "@orderly.network/ui";
import { SearchIcon } from "../../icons";
import { useMarketsContext } from "../marketsProvider";

type SearchInputProps = Pick<InputProps, "classNames" | "suffix">;

export const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { classNames, suffix } = props;
  const isComposingRef = useRef<boolean>(false);

  const { t } = useTranslation();

  const { searchValue, onSearchValueChange, clearSearchValue } =
    useMarketsContext();

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false;
      onSearchValueChange?.(event.currentTarget.value);
    },
    [onSearchValueChange],
  );

  return (
    <Input
      value={searchValue}
      onValueChange={onSearchValueChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      placeholder={t("markets.search.placeholder")}
      className="custom-apply-to-everything"
      classNames={{
        ...classNames,
        // use mt-px to fix the top border issue
        root: cn(classNames?.root),
      }}
      size="sm"
      prefix={
        <Box style={{ paddingLeft: "12px", paddingRight: "9px" }}>
          <SearchIcon className="oui-text-base-contrast-36" />
        </Box>
      }
      suffix={
        suffix ||
        (searchValue && (
          <Box mr={2}>
            <CloseCircleFillIcon
              size={14}
              className="oui-cursor-pointer oui-text-base-contrast-36"
              onClick={clearSearchValue}
            />
          </Box>
        ))
      }
      autoComplete="off"
    />
  );
};
