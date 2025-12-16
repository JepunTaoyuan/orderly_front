import React, { useMemo } from "react";
import pick from "ramda/es/pick";
import { SubAccount } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import {
  Text,
  Card,
  Flex,
  gradientTextVariants,
  EyeIcon,
  EyeCloseIcon,
  cn,
  DataFilter,
  formatAddress,
  Tabs,
  TabPanel,
  ArrowDownShortIcon,
  Button,
  useMediaQuery,
} from "@orderly.network/ui";
import type { SelectOption } from "@orderly.network/ui";
import { AuthGuard, AuthGuardDataTable } from "@orderly.network/ui-connector";
import type { useAssetsScriptReturn } from "./assets.script";
import type {
  AssetsDataTableWidgetProps,
  AssetsWidgetProps,
} from "./assets.widget";

const LazyConvertHistoryWidget = React.lazy(() =>
  import("../convertPage/convert.widget").then((mod) => {
    return { default: mod.ConvertHistoryWidget };
  }),
);

export type AssetsProps = useAssetsScriptReturn;

export enum AccountType {
  ALL = "All accounts",
  MAIN = "Main accounts",
}

export const TotalValueInfo: React.FC<
  Readonly<
    Pick<AssetsWidgetProps, "totalValue" | "visible" | "onToggleVisibility">
  >
> = (props) => {
  const { totalValue, visible, onToggleVisibility } = props;
  const { t } = useTranslation();
  const Icon = visible ? EyeIcon : EyeCloseIcon;
  return (
    <Flex direction="column" gap={1} className="oui-text-xs" itemAlign="start">
      <Flex gap={1} justify="start" itemAlign="center">
        <Text size="xs" color="neutral" weight="semibold">
          {t("common.totalValue")}
        </Text>
        <button onClick={onToggleVisibility}>
          <Icon size={18} className={cn("oui-text-base-contrast-54")} />
        </button>
      </Flex>
      <Flex justify={"start"} itemAlign="end" gap={1}>
        <Text.numeral
          visible={visible}
          weight="bold"
          size="2xl"
          as="div"
          padding={false}
          dp={2}
        >
          {totalValue ?? "--"}
        </Text.numeral>
        <Text as="div" weight="bold" color="neutral" size="xs">
          USDC
        </Text>
      </Flex>
    </Flex>
  );
};

export const DepositAndWithdrawButton: React.FC<
  Readonly<
    Pick<AssetsWidgetProps, "isMainAccount" | "onWithdraw" | "onDeposit">
  >
> = (props) => {
  const { t } = useTranslation();
  const { isMainAccount, onWithdraw, onDeposit } = props;
  const { wrongNetwork, disabledConnect } = useAppContext();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (!isMainAccount) {
    return null;
  }
  const mergedDisabled = wrongNetwork || disabledConnect;
  return (
    <Flex
      className="oui-text-xs oui-text-base-contrast-54 oui-w-full"
      itemAlign="center"
      justify={"end"}
      gap={3}
    >
      <Button
        disabled={mergedDisabled}
        data-testid="oui-testid-assetView-deposit-button"
        size="md"
        onClick={onDeposit}
        className={`oui-rounded-full oui-text-white oui-text-xs oui-px-4 oui-font-semibold oui-leading-5  ${
          isSmallScreen ? "oui-flex-1" : ""
        }`}
        style={{
          background:
            "linear-gradient(90deg, rgb(82, 65, 158) 0%, rgb(127, 251, 255) 100%)",
        }}
      >
        <Text>{t("common.deposit")}</Text>
      </Button>
      <Button
        disabled={mergedDisabled}
        variant="outlined"
        size="md"
        onClick={onWithdraw}
        data-testid="oui-testid-assetView-withdraw-button"
        className={`oui-rounded-full oui-border-white/[0.36] oui-text-white/[0.5] oui-text-xs oui-px-4        oui-font-semibold oui-leading-5 ${isSmallScreen ? "oui-flex-1" : ""}`}
      >
        <Text>{t("common.withdraw")}</Text>
      </Button>
    </Flex>
  );
};

const DataFilterSection: React.FC<
  Pick<
    AssetsWidgetProps,
    | "isMainAccount"
    | "onFilter"
    | "selectedAccount"
    | "selectedAsset"
    | "assetsOptions"
    | "state"
  >
> = (props) => {
  const { t } = useTranslation();
  const {
    isMainAccount,
    onFilter,
    selectedAccount,
    selectedAsset,
    assetsOptions,
    state,
  } = props;

  const ALL_ACCOUNTS: SelectOption = {
    label: t("common.allAccount"),
    value: AccountType.ALL,
  };

  const MAIN_ACCOUNT: SelectOption = {
    label: t("common.mainAccount"),
    value: AccountType.MAIN,
  };

  const ALL_ASSETS: SelectOption = {
    label: t("common.allAssets", "All assets"),
    value: "all",
  };

  const subAccounts = useMemo<SubAccount[]>(() => {
    return state.subAccounts ?? [];
  }, [state.subAccounts]);

  const memoizedOptions = useMemo(() => {
    if (Array.isArray(subAccounts) && subAccounts.length) {
      return [
        ALL_ACCOUNTS,
        MAIN_ACCOUNT,
        ...subAccounts.map<SelectOption>((value) => ({
          value: value?.id,
          label: value?.description || formatAddress(value?.id),
        })),
      ];
    }
    return [ALL_ACCOUNTS, MAIN_ACCOUNT];
  }, [ALL_ACCOUNTS, MAIN_ACCOUNT, subAccounts]);

  const memoizedAssetOptions = useMemo(() => {
    return [ALL_ASSETS, ...assetsOptions];
  }, [ALL_ASSETS, assetsOptions]);

  if (!isMainAccount) {
    return null;
  }

  return (
    <DataFilter
      className="oui-border-none oui-py-5 oui-bg-base-10"
      onFilter={onFilter}
      items={[
        {
          type: "select",
          name: "account",
          value: selectedAccount,
          options: memoizedOptions,
          classNames: {
            trigger: "oui-py-[2px]",
          },
        },
        {
          type: "select",
          name: "asset",
          value: selectedAsset,
          options: memoizedAssetOptions,
          classNames: {
            trigger: "oui-py-[2px]",
          },
        },
      ]}
    />
  );
};

export const AssetsDataTable: React.FC<
  Pick<
    AssetsWidgetProps,
    | "columns"
    | "dataSource"
    | "isMainAccount"
    | "onFilter"
    | "selectedAccount"
    | "selectedAsset"
    | "assetsOptions"
    | "state"
    | "canTrade"
  > &
    AssetsDataTableWidgetProps
> = (props) => {
  const { columns, dataSource, dataTableClassNames, classNames } = props;
  const { root, scrollRoot, desc } = classNames ?? {};

  if (!props.canTrade) {
    // show auth button when not can trade
    return (
      <AuthGuardDataTable
        classNames={{
          root: "oui-rounded-xl oui-font-semibold",
          scroll: "oui-h-[252px]",
        }}
        loading={props.canTrade}
        columns={[]}
        dataSource={[]}
      />
    );
  }

  return (
    <Flex
      width="100%"
      height="100%"
      direction={"column"}
      className={cn(root, "oui-gap-1", "oui-bg-base-10")}
    >
      <DataFilterSection
        {...pick(
          [
            "isMainAccount",
            "onFilter",
            "selectedAccount",
            "selectedAsset",
            "assetsOptions",
            "state",
          ],
          props,
        )}
      />
      {dataSource?.map((item, index) => {
        return (
          <Flex
            key={`item-${index}`}
            className={cn("oui-rounded-xl oui-bg-base-9 oui-p-5", scrollRoot)}
            direction={"column"}
            itemAlign={"start"}
            justify={"between"}
          >
            <div className="oui-w-full oui-mb-4 oui-pb-4 oui-border-b oui-border-line oui-pl-3">
              <Text
                className={cn(desc)}
                intensity={98}
                weight="semibold"
                size="lg"
              >
                {item?.description || formatAddress(item?.id ?? "")}
              </Text>
            </div>
            <AuthGuardDataTable
              bordered
              className="oui-font-semibold"
              classNames={{
                // root: "oui-bg-transparent",
                // scroll: "oui-min-h-0",
                ...dataTableClassNames,
              }}
              columns={columns}
              dataSource={item.children}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

export const AssetsTable: React.FC<AssetsWidgetProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Card
      className={"oui-bg-base-9 oui-p-0"}
      classNames={{ content: "!oui-pt-0" }}
    >
      <Tabs
        defaultValue="assets"
        variant="text"
        classNames={{ tabsList: "oui-pt-5 oui-px-5" }}
        size="sm"
      >
        <TabPanel value="assets" className="" title={t("common.assets")}>
          <Flex
            className="oui-rounded-xl oui-bg-base-9 oui-p-5"
            direction={"row"}
            itemAlign={"center"}
            justify={"between"}
          >
            <TotalValueInfo
              {...pick(["totalValue", "visible", "onToggleVisibility"], props)}
            />
            <DepositAndWithdrawButton
              {...pick(["isMainAccount", "onDeposit", "onWithdraw"], props)}
            />
          </Flex>
          <AssetsDataTable
            {...pick(
              [
                "columns",
                "dataSource",
                "isMainAccount",
                "onFilter",
                "selectedAccount",
                "selectedAsset",
                "assetsOptions",
                "state",
                "canTrade",
              ],
              props,
            )}
            classNames={{
              scrollRoot:
                "oui-max-h-[700px] oui-overflow-y-auto oui-custom-scrollbar oui-w-full",
            }}
            dataTableClassNames={{
              header: "oui-mr-[-1px]",
            }}
          />
        </TabPanel>
        <TabPanel
          value="convertHistory"
          className="oui-rounded-xl oui-bg-base-9 oui-px-6"
          title={t("portfolio.overview.tab.convert.history")}
        >
          <React.Suspense fallback={null}>
            <LazyConvertHistoryWidget />
          </React.Suspense>
        </TabPanel>
      </Tabs>
    </Card>
  );
};
