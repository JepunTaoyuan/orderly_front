import { useTranslation } from "@orderly.network/i18n";
import { CardTitle, Flex } from "@orderly.network/ui";

export const AssetsChartHeader = () => {
  const { t } = useTranslation();

  return (
    <Flex justify={"between"}>
      <CardTitle>{t("common.assets")}</CardTitle>
    </Flex>
  );
};
