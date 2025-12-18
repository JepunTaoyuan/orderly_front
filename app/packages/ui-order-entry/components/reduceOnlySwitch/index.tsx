import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Flex, Switch } from "@orderly.network/ui";

export interface ReduceOnlySwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  testId?: string;
}

export const ReduceOnlySwitch: React.FC<ReduceOnlySwitchProps> = ({
  checked,
  onCheckedChange,
  className,
  testId = "oui-testid-orderEntry-reduceOnly-switch",
}) => {
  const { t } = useTranslation();

  return (
    <Flex itemAlign={"center"} gapX={1} className={className}>
      <Switch
        data-testid={testId}
        className="oui-h-[14px]"
        id={"reduceOnly"}
        checked={checked}
        style={{
          backgroundColor: checked
            ? "rgba(110, 85, 223, 1)"
            : "rgba(83, 94, 123, 1)",
        }}
        onCheckedChange={onCheckedChange}
      />
      <label htmlFor={"reduceOnly"} className={"oui-text-xs"}>
        {t("orderEntry.reduceOnly")}
      </label>
    </Flex>
  );
};
