import React, { useState } from "react";
import { APIKeyItem } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Box,
  Button,
  Card,
  CopyIcon,
  Flex,
  PlusIcon,
  Column,
  Text,
  Tooltip,
  useScreen,
  ListView,
} from "@orderly.network/ui";
import {
  AuthGuardEmpty,
  AuthGuardDataTable,
  AuthGuardTooltip,
} from "@orderly.network/ui-connector";
import { OrderCellWidget } from "@/packages/ui-orders/components/orderList/mobile";
import {
  type ApiManagerScriptReturns,
  capitalizeFirstChar,
} from "./apiManager.script";

const LazyCreateAPIKeyDialog = React.lazy(() =>
  import("./dialog/createApiKey").then((mod) => {
    return { default: mod.CreateAPIKeyDialog };
  }),
);

const LazyCreatedAPIKeyDialog = React.lazy(() =>
  import("./dialog/createdApiKey").then((mod) => {
    return { default: mod.CreatedAPIKeyDialog };
  }),
);

const LazyDeleteAPIKeyDialog = React.lazy(() =>
  import("./dialog/deleteApiKey").then((mod) => {
    return { default: mod.DeleteAPIKeyDialog };
  }),
);

const LazyEditAPIKeyDialog = React.lazy(() =>
  import("./dialog/editApiKey").then((mod) => {
    return { default: mod.EditAPIKeyDialog };
  }),
);

export const APIManager: React.FC<ApiManagerScriptReturns> = (props) => {
  const { t } = useTranslation();
  return (
    <Card
      title={<div className="oui-text-xs">{t("portfolio.apiKeys")}</div>}
      id="portfolio-apikey-manager"
      className="oui-bg-base-9 oui-font-semibold oui-p-5"
    >
      <Flex
        direction={"column"}
        gap={4}
        width={"100%"}
        className="oui-font-semibold oui-pl-3"
      >
        <AccountInfo {...props} />
        <Subtitle {...props} />
      </Flex>
      <div>
        <KeyList {...props} />
        <React.Suspense fallback={null}>
          <LazyCreateAPIKeyDialog {...props} />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <LazyCreatedAPIKeyDialog {...props} />
        </React.Suspense>
      </div>
    </Card>
  );
};

const AccountInfo: React.FC<ApiManagerScriptReturns> = (props) => {
  const { t } = useTranslation();
  return (
    <Flex
      width={"100%"}
      gap={4}
      justify="start"
      className="oui-border-t-2 oui-border-line-6 oui-pt-4"
    >
      <Flex
        py={5}
        px={5}
        direction={"column"}
        itemAlign={"start"}
        r="sm"
        width={256}
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Text size="xs" intensity={36}>
          {t("common.accountId")}
        </Text>
        <Text.formatted
          size="base"
          inlist={80}
          rule={"address"}
          copyable={props.accountId !== "--"}
          copyIconSize={16}
          onCopy={props.onCopyAccountId}
          copyIconTestid="oui-testid-apiKey-accountInfo-accountId-copy-btn"
        >
          {props.accountId}
        </Text.formatted>
      </Flex>
      <Flex
        py={5}
        px={5}
        direction={"column"}
        itemAlign={"start"}
        r="sm"
        width={256}
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Text size="xs" intensity={36}>
          {t("portfolio.apiKey.uid")}
        </Text>
        <Text size="base" inlist={80}>
          {props.userId}
        </Text>
      </Flex>
    </Flex>
  );
};

const Subtitle: React.FC<ApiManagerScriptReturns> = (props) => {
  const { t } = useTranslation();
  return (
    <Flex
      width={"100%"}
      direction={"row"}
      className="oui-text-sm oui-border-b-2 oui-border-line-6 oui-pb-4"
    >
      <Flex direction={"column"} itemAlign={"start"} width={"100%"} gap={1}>
        <Text intensity={54}>{t("portfolio.apiKey.description")}</Text>
        <Flex
          itemAlign={"center"}
          className="oui-text-primary-light oui-fill-primary-light hover:oui-text-primary-darken oui-cursor-pointer oui-text-2xs md:oui-text-xs xl:oui-text-sm"
          onClick={props.onReadApiGuide}
        >
          <Text>{t("portfolio.apiKey.readApiGuide")}</Text>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.008 7.995c0-.368.298-.666.666-.666H9.71L7.733 5.331l.937-.936 3.143 3.122c.13.13.195.304.195.479a.67.67 0 0 1-.195.478L8.67 11.596l-.937-.937 1.978-1.998H4.674a.666.666 0 0 1-.666-.666" />
          </svg>
        </Flex>
      </Flex>
      <AuthGuardTooltip
        side="top"
        tooltip={{
          connectWallet: t("portfolio.apiKey.create.connectWallet.tooltip"),
          signIn: t("portfolio.apiKey.create.createAccount.tooltip"),
          enableTrading: t("portfolio.apiKey.create.enableTrading.tooltip"),
          wrongNetwork: t("portfolio.apiKey.create.wrongNetwork.tooltip"),
        }}
      >
        <Button
          size="md"
          variant="gradient"
          angle={90}
          onClick={props.onCreateApiKey}
          disabled={!props.canCreateApiKey}
          data-testid="oui-testid-apiKey-createApiKey-btn"
          className="oui-rounded-full oui-text-white oui-text-xs"
          style={{
            background:
              "linear-gradient(90deg, rgb(82, 65, 158) 0%, rgb(127, 251, 255) 100%)",
          }}
        >
          {t("portfolio.apiKey.create.dialog.title")}
        </Button>
      </AuthGuardTooltip>
    </Flex>
  );
};

const KeyList: React.FC<ApiManagerScriptReturns> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const columns: Column<APIKeyItem>[] = [
    {
      title: t("portfolio.apiKey.column.apiKey"),
      dataIndex: "orderly_key",
      render: (value) => {
        return (
          <Text.formatted
            rule={""}
            copyable
            copyIconSize={16}
            onCopy={() => {
              props.onCopyApiKey?.(value);
            }}
          >
            {formatKey(value)}
          </Text.formatted>
        );
      },
    },
    {
      title: t("portfolio.apiKey.column.permissionType"),
      dataIndex: "scope",
      render: (value) =>
        value
          ?.split(",")
          .map((e: any) => capitalizeFirstChar(`${e}`))
          .join(", "),
    },
    {
      title: t("portfolio.apiKey.column.restrictedIP"),
      dataIndex: "ip_restriction_list",
      render: (value) => {
        let ip = value.join(",");
        if (ip.length === 0) {
          ip = "--";
        }
        return (
          <Tooltip content={ip} className="oui-max-w-[200px] oui-break-all">
            <Flex gap={1}>
              <div className=" oui-overflow-ellipsis oui-overflow-hidden">
                {ip}
              </div>
              {ip !== "--" && (
                <Box width={16} height={16} className="oui-cursor-pointer">
                  <CopyIcon
                    color="white"
                    opacity={0.54}
                    size={16}
                    onClick={(e) => {
                      navigator.clipboard.writeText(ip);
                      props?.onCopyIP();
                    }}
                  />
                </Box>
              )}
            </Flex>
          </Tooltip>
        );
      },
    },
    {
      title: t("portfolio.apiKey.column.expirationDate"),
      dataIndex: "expiration",
      render: (value) => (
        <Text.formatted rule={"date"} formatString="yyyy-MM-dd">
          {value}
        </Text.formatted>
      ),
    },
    {
      title: "",
      type: "action",
      dataIndex: "action",
      align: "right",
      width: 50,
      render: (_, item) => {
        return (
          <Flex direction={"row"} gap={2} justify="end">
            <EditButton
              item={item}
              onUpdate={props.doEdit}
              verifyIP={props.verifyIP}
            />
            <DeleteButton item={item} onDelete={props.doDelete} />
          </Flex>
        );
      },
    },
  ];

  return (
    <AuthGuardDataTable
      bordered
      columns={columns}
      loading={props.isLoading}
      dataSource={props.keys}
      emptyView={<AuthGuardEmpty />}
      pagination={props.pagination}
      manualPagination={false}
      classNames={{
        root: "api-key-table",
      }}
      onRow={(record, index) => {
        return {
          className: "oui-h-[40px] oui-py-1",
        };
      }}
    />
  );
};

const EditButton: React.FC<{
  item: APIKeyItem;
  onUpdate: (item: APIKeyItem, ip?: string) => Promise<void>;
  verifyIP: (ip: string) => string;
}> = (props) => {
  const { item, onUpdate, verifyIP } = props;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        size="sm"
        variant="contained"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        data-testid="oui-testid-apiKey-keyList-edit-btn"
        style={{
          background: "rgba(110, 85, 223, 1)",
        }}
        className="oui-rounded-full oui-px-4"
      >
        {t("common.edit")}
      </Button>
      {open && (
        <React.Suspense fallback={null}>
          <LazyEditAPIKeyDialog
            item={item}
            open={open}
            setOpen={setOpen}
            onUpdate={onUpdate}
            verifyIP={verifyIP}
          />
        </React.Suspense>
      )}
    </>
  );
};

const DeleteButton: React.FC<{
  item: APIKeyItem;
  onDelete: (item: APIKeyItem) => Promise<void>;
}> = (props) => {
  const { item, onDelete } = props;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button
        size="sm"
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        data-testid="oui-testid-apiKey-keyList-delete-btn"
        className="oui-rounded-full oui-border-white/[0.36] oui-text-white/[0.5] oui-text-xs oui-px-4 oui-py-1 oui-font-semibold oui-leading-5"
      >
        {t("common.delete")}
      </Button>
      {open && (
        <React.Suspense fallback={null}>
          <LazyDeleteAPIKeyDialog
            item={item}
            open={open}
            setOpen={setOpen}
            onDelete={onDelete}
          />
        </React.Suspense>
      )}
    </>
  );
};

export function formatKey(value: string): string {
  if (typeof value === "undefined") {
    return "-";
  }
  const key = `${value}`.slice(0, Math.min(value.length, 12));
  return `${key}***`;
}
