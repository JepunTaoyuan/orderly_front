import React, { useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { CardTitle, cn, Flex, Select, SelectItem } from "@orderly.network/ui";
import { PeriodType } from "./useAssetHistory";

export const PeriodTitle: React.FC<{
  onPeriodChange: (period: PeriodType) => void;
  periodTypes: string[];
  period: PeriodType;
  title: string;
}> = (props) => {
  const { t } = useTranslation();

  const periodLabel = useMemo(() => {
    return {
      [PeriodType.WEEK]: t("common.select.7d"),
      [PeriodType.MONTH]: t("common.select.30d"),
      [PeriodType.QUARTER]: t("common.select.90d"),
    };
  }, [t]);

  const optionRenderer = (option: any) => {
    const isActive = option.value === props.period;

    return (
      <SelectItem
        key={option.value}
        value={option.value}
        className={cn(
          "oui-cursor-pointer dropdown-item data-[state=checked]:oui-bg-blue-500",
        )}
      >
        {option.label}
      </SelectItem>
    );
  };
  return (
    <Flex itemAlign={"center"} gap={5}>
      <CardTitle>{props.title}</CardTitle>
      <div className={"oui-min-w-14"}>
        <Select.options
          size={"xs"}
          value={props.period}
          onValueChange={props.onPeriodChange}
          options={props.periodTypes.map((item) => ({
            value: item,
            label: periodLabel[item as PeriodType],
          }))}
          optionRenderer={optionRenderer}
          contentProps={{
            align: "end",
            className: `oui-bg-base-9`,
          }}
        />
      </div>
    </Flex>
  );
};
