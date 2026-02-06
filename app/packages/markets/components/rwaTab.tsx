import { useTranslation } from "@orderly.network/i18n";
import { Box, Flex, Text } from "@orderly.network/ui";

export const RwaTab = () => {
  const { t } = useTranslation();
  return (
    <Flex gap={1}>
      <Text>{t("common.rwa")}</Text>
      <Box
        px={1}
        style={{
          background: "#DBFD5C",
          borderRadius: "10000px",
        }}
      >
        <Text
          size="3xs"
          style={{
            color: "rgba(12, 13, 16, 1)",
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {t("common.new")}
        </Text>
      </Box>
    </Flex>
  );
};
