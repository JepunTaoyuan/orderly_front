import { FC, useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Flex, Text, cn } from "@orderly.network/ui";
import { ShareOptions } from "../../types/types";
import { Checkbox } from "./checkbox";

export const ShareOption: FC<{
  type: ShareOptions;
  curType: Set<ShareOptions>;
  setShareOption: any;
}> = (props) => {
  const { type, curType, setShareOption } = props;
  const { t } = useTranslation();

  const text = useMemo(() => {
    switch (type) {
      case "openPrice":
        return t("share.pnl.optionalInfo.openPrice");
      case "closePrice":
        return t("share.pnl.optionalInfo.closePrice");
      case "openTime":
        return t("share.pnl.optionalInfo.openTime");
      case "closeTime":
        return t("share.pnl.optionalInfo.closeTime");
      case "markPrice":
        return t("common.markPrice");
      case "quantity":
        return t("common.quantity");
      case "leverage":
        return t("common.leverage");
    }
  }, [type, t]);

  const isSelected = curType.has(type);

  return (
    <Flex
      itemAlign={"center"}
      gap={0}
      className={cn("hover:oui-cursor-pointer")}
      onClick={() => {
        // setPnlFormat(type);
        setShareOption((value: Set<ShareOptions>) => {
          const updateSet = new Set(value);
          if (isSelected) {
            updateSet.delete(type);
          } else {
            updateSet.add(type);
          }
          return updateSet;
        });
      }}
    >
      <Checkbox
        size={14}
        checked={isSelected}
        onCheckedChange={(checked: boolean) => {
          setShareOption((value: Set<ShareOptions>) => {
            const updateSet = new Set(value);
            if (isSelected) {
              updateSet.delete(type);
            } else {
              updateSet.add(type);
            }
            return updateSet;
          });
        }}
      />

      <Text size="xs" intensity={54}>
        {text}
      </Text>
    </Flex>
  );
};
