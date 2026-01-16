import { FC } from "react";
import { APIKeyItem } from "@orderly.network/hooks";
import { useTranslation, Trans } from "@orderly.network/i18n";
import { Flex, SimpleDialog, Text } from "@orderly.network/ui";
import { formatKey } from "../apiManager.ui";

export const DeleteAPIKeyDialog: FC<{
  item: APIKeyItem;
  open: boolean;
  setOpen?: any;
  onDelete?: (item: APIKeyItem) => Promise<void>;
}> = (props) => {
  const { item, open, setOpen, onDelete } = props;
  const { t } = useTranslation();
  return (
    <SimpleDialog
      size="sm"
      open={open}
      onOpenChange={setOpen}
      title={t("portfolio.apiKey.delete.dialog.title")}
      actions={{
        primary: {
          label: t("common.confirm"),
          "data-testid": "oui-testid-apiKey-deleteApiKey-dialog-confirm-btn",
          className:
            "oui-w-[120px] lg:oui-w-[154px] oui-rounded-full oui-text-xs oui-bg-[rgba(110,85,223,1)]",
          size: "lg",
          onClick: async () => {
            await props.onDelete?.(item);
            setOpen(false);
          },
        },
        secondary: {
          label: t("common.cancel"),
          className:
            "oui-w-[120px] lg:oui-w-[154px] oui-rounded-full oui-text-xs",
          size: "lg",
          onClick: async () => {
            setOpen(false);
          },
        },
      }}
      classNames={{
        footer: "oui-justify-center",
        content:
          "oui-bg-base-10 oui-w-[300px] lg:oui-w-[360px] oui-font-semibold oui-px-5 oui-pt-5 oui-pb-2",
      }}
    >
      <Flex
        className="oui-text-xs"
        style={{ paddingBottom: "16px", marginTop: "-4px" }}
      >
        {/* @ts-ignore */}
        <Trans
          i18nKey="portfolio.apiKey.delete.dialog.description"
          values={{ apiKey: formatKey(item?.orderly_key) }}
          components={[
            <Text
              style={{ color: "rgba(186, 179, 216, 1)" }}
              className="oui-px-1"
            />,
          ]}
        />
      </Flex>
    </SimpleDialog>
  );
};
