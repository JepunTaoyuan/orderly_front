/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import pick from "ramda/es/pick";
import { useTranslation } from "@orderly.network/i18n";
import {
  Button,
  cn,
  TokenIcon,
  Text,
  formatAddress,
  DataFilter,
  modal,
  Flex,
  EmptyDataState,
  Card,
  Tabs,
  TabPanel,
  Divider,
  Grid,
} from "@orderly.network/ui";
import { SelectOption } from "@orderly.network/ui";
import type { useAssetsScriptReturn } from "./assets.script";
import {
  AccountType,
  TotalValueInfo,
  DepositAndWithdrawButton,
} from "./assets.ui.desktop";

const LazyConvertHistoryWidget = React.lazy(() =>
  import("../convertPage/convert.widget").then((mod) => {
    return { default: mod.ConvertHistoryWidget };
  }),
);

// Asset Row Component - 3-column layout for each asset
type AssetRowProps = {
  asset: any;
};

const AssetRow: React.FC<AssetRowProps> = ({ asset }) => {
  const { t } = useTranslation();

  return (
    <Grid
      cols={3}
      width={"100%"}
      gap={1}
      style={{
        gridTemplateColumns: "3fr 3fr 4fr",
      }}
    >
      {/* Column 1: Token + Qty */}
      <div className="oui-w-20 oui-h-20 oui-inline-flex oui-flex-col oui-justify-between oui-items-start">
        <div className="oui-flex oui-flex-col oui-justify-start oui-items-start">
          <div
            className="oui-text-base-contrast-50 oui-text-xs oui-font-medium oui-leading-4"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            {t("common.token")}
          </div>
          <div
            className="oui-inline-flex oui-justify-start oui-items-center"
            style={{ gap: "2px" }}
          >
            <TokenIcon name={asset.token} size="2xs" />
            <div className="oui-text-base-contrast-90 oui-text-xs oui-font-bold oui-leading-4">
              {asset.token}
            </div>
          </div>
        </div>
        <div className="oui-flex oui-flex-col oui-justify-start oui-items-start">
          <div
            className="oui-text-base-contrast-50 oui-text-xs oui-font-medium oui-leading-4"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            {t("common.qty")}
          </div>
          <div className="oui-h-4 oui-inline-flex oui-justify-start oui-items-center">
            <Text.numeral
              size="xs"
              weight="bold"
              dp={6}
              padding={false}
              className="oui-text-base-contrast-90 oui-leading-3"
            >
              {asset.holding}
            </Text.numeral>
          </div>
        </div>
      </div>

      {/* Column 2: Asset value + Index price */}
      <div className="oui-w-24 oui-h-20 oui-inline-flex oui-flex-col oui-justify-between oui-items-start">
        <div className="oui-flex oui-flex-col oui-justify-start oui-items-start">
          <div
            className="oui-text-base-contrast-50 oui-text-xs oui-font-medium oui-leading-4"
            style={{ color: "rgba(255, 255, 255, 0.3)" }}
          >
            {t("portfolio.overview.column.assetValue")}
          </div>
          <div className="oui-h-4 oui-flex oui-flex-col oui-justify-center oui-items-start">
            <Text.assetValue
              size="xs"
              weight="bold"
              dp={6}
              currency="$"
              padding={false}
              className="oui-text-base-contrast-90 oui-leading-3"
            >
              {asset.assetValue}
            </Text.assetValue>
          </div>
        </div>
        <div className="oui-flex oui-flex-col oui-justify-start oui-items-start">
          <div
            className="oui-text-base-contrast-50 oui-text-xs oui-font-medium oui-leading-4"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            {t("common.indexPrice")}
          </div>
          <div
            className="oui-inline-flex oui-justify-start oui-items-center"
            style={{ gap: "2px" }}
          >
            <Text.numeral
              size="xs"
              weight="bold"
              dp={6}
              currency="$"
              padding={false}
              className="oui-text-base-contrast-90 oui-leading-3"
            >
              {asset.indexPrice}
            </Text.numeral>
            <div
              className="oui-w-8 oui-text-end oui-text-base-contrast-30 oui-text-xs oui-font-medium oui-leading-4"
              style={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              USDC
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Collateral ratio + contribution */}
      <div className="oui-w-32 oui-self-stretch oui-inline-flex oui-flex-col oui-justify-between oui-items-start oui-gap-3">
        <div className="oui-flex oui-flex-col oui-justify-start oui-items-start">
          <div
            className="oui-text-base-contrast-50 oui-text-xs oui-font-medium oui-leading-4"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            {t("portfolio.overview.column.collateralRatio")}
          </div>
          <div className="oui-h-4 oui-flex oui-flex-col oui-justify-center oui-items-start">
            <Text.numeral
              size="xs"
              weight="bold"
              dp={2}
              suffix="%"
              className="oui-text-base-contrast-90 oui-leading-3"
            >
              {asset.collateralRatio * 100}
            </Text.numeral>
          </div>
        </div>
        <div className="oui-flex oui-flex-col oui-justify-start oui-items-start">
          <div
            className="oui-text-base-contrast-50 oui-text-xs oui-font-medium oui-leading-4"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            {t("transfer.deposit.collateralContribution")}
          </div>
          <div
            className="oui-inline-flex oui-justify-start oui-items-center"
            style={{ gap: "2px" }}
          >
            <Text.collateral
              size="xs"
              weight="bold"
              dp={6}
              currency="$"
              padding={false}
              className="oui-text-base-contrast-90 oui-leading-3"
            >
              {asset.collateralContribution}
            </Text.collateral>
            <div
              className="oui-w-8 oui-text-end oui-text-base-contrast-30 oui-text-xs oui-font-medium oui-leading-4"
              style={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              USDC
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

// Account Card Component - contains account header + all assets
type AccountCardProps = {
  account: any;
  onTransfer: (accountId: string) => void;
  isLast?: boolean;
};

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onTransfer,
  isLast,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="oui-rounded oui-inline-flex oui-flex-col oui-justify-start oui-items-start oui-gap-2 oui-p-4 oui-bg-base-9"
      style={{ marginBottom: isLast ? 0 : "8px" }}
    >
      {/* Header: Account name + Transfer button */}
      <div className="oui-self-stretch oui-flex oui-justify-between oui-items-center oui-w-full">
        <div className="oui-text-base-contrast-90 oui-text-xs oui-font-bold oui-leading-5">
          {account.description || formatAddress(account.id ?? "")}
        </div>
        <Button
          variant="outlined"
          size="sm"
          className="oui-h-7 oui-min-h-7 oui-rounded-full"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
          onClick={() => onTransfer(account.id)}
        >
          <span className="oui-text-base-contrast-60 oui-text-xs oui-font-semibold">
            {t("common.transfer")}
          </span>
        </Button>
      </div>

      <Divider
        className="oui-w-full "
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      />

      {/* Asset rows - multiple assets displayed in rows */}
      {account.children?.map((asset: any, index: number) => (
        <React.Fragment key={asset.token}>
          <AssetRow asset={asset} />
          {/* Dashed divider between assets (not after the last one) */}
          {index < (account.children?.length ?? 0) - 1 && (
            <div
              className="oui-self-stretch oui-h-0"
              style={{
                outline: "1px dashed rgba(255, 255, 255, 0.1)",
                outlineOffset: "-0.5px",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const AssetsTableMobile: React.FC<useAssetsScriptReturn> = (props) => {
  const { t } = useTranslation();

  const {
    assetsOptions,
    state,
    isMainAccount,
    dataSource,
    selectedAccount,
    selectedAsset,
    onFilter,
  } = props;

  const subAccounts = state.subAccounts ?? [];

  const ALL_ACCOUNTS: SelectOption = {
    label: t("common.allAccount"),
    value: AccountType.ALL,
  };

  const MAIN_ACCOUNT: SelectOption = {
    label: t("common.mainAccount"),
    value: AccountType.MAIN,
  };

  const ALL_ASSETS: SelectOption = {
    label: "All assets",
    value: "all",
  };

  const memoizedOptions = useMemo(() => {
    if (Array.isArray(subAccounts) && subAccounts.length) {
      return [
        ALL_ACCOUNTS,
        MAIN_ACCOUNT,
        ...subAccounts.map<SelectOption>((value) => ({
          value: value.id,
          label: value?.description || formatAddress(value?.id),
        })),
      ];
    }
    return [ALL_ACCOUNTS, MAIN_ACCOUNT];
  }, [subAccounts]);

  // Create asset options from holding data - optimized and consistent with desktop
  const memoizedAssets = useMemo(() => {
    return [ALL_ASSETS, ...assetsOptions];
  }, [assetsOptions]);

  if (!props.canTrade) {
    return (
      <Card className="oui-p-0 " classNames={{ content: "!oui-pt-0" }}>
        <Tabs
          defaultValue="assets"
          variant="text"
          classNames={{ tabsList: "oui-pt-4 oui-px-3" }}
          size="sm"
        >
          <TabPanel value="assets" title={t("common.assets")}>
            <Flex
              direction={"column"}
              height={"100%"}
              itemAlign={"center"}
              justify={"center"}
              mt={10}
            >
              <EmptyDataState />
            </Flex>
          </TabPanel>
          <TabPanel
            value="convertHistory"
            title={t("portfolio.overview.tab.convert.history")}
          >
            <React.Suspense fallback={null}>
              <LazyConvertHistoryWidget />
            </React.Suspense>
          </TabPanel>
        </Tabs>
      </Card>
    );
  }

  return (
    <div>
      <Card
        className="oui-p-0 oui-bg-base-10"
        classNames={{ content: "!oui-pt-0" }}
      >
        <div className="oui-w-full oui-bg-base-9 oui-pt-4 oui-px-4">
          <Text className="oui-text-sm">{t("common.assets")}</Text>
          <Divider intensity={4} className="oui-pt-2" />
        </div>
        <Tabs
          defaultValue="assets"
          variant="text"
          classNames={{ tabsList: "oui-pt-4 oui-px-4 oui-bg-base-9" }}
          size="sm"
        >
          <TabPanel value="assets" title={t("common.assets")}>
            <div className={cn("oui-flex oui-flex-col oui-gap-1 oui-pb-4")}>
              {/* Total Value and Deposit/Withdraw Section */}
              <Flex
                direction="column"
                gap={2}
                className="oui-pb-4 oui-pt-2 oui-px-4 oui-bg-base-9"
                itemAlign="start"
              >
                <TotalValueInfo
                  {...pick(
                    ["totalValue", "visible", "onToggleVisibility"],
                    props,
                  )}
                />
                <DepositAndWithdrawButton
                  {...pick(["isMainAccount", "onDeposit", "onWithdraw"], props)}
                />
              </Flex>
              {isMainAccount && (
                <DataFilter
                  onFilter={onFilter}
                  className="oui-border-none oui-py-2"
                  items={[
                    {
                      size: "sm",
                      type: "picker",
                      name: "account",
                      value: selectedAccount,
                      options: memoizedOptions,
                    },
                    {
                      size: "sm",
                      type: "picker",
                      name: "asset",
                      value: selectedAsset,
                      options: memoizedAssets,
                    },
                  ]}
                />
              )}
              {/* Account cards container */}
              <div className="oui-flex oui-flex-col">
                {dataSource?.map((account, index) => (
                  <AccountCard
                    key={account.id || index}
                    account={account}
                    onTransfer={(accountId) => {
                      modal.show("TransferSheetId", { accountId });
                    }}
                    isLast={index === (dataSource?.length ?? 0) - 1}
                  />
                ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel
            value="convertHistory"
            className="oui-px-3"
            title={t("portfolio.overview.tab.convert.history")}
          >
            <React.Suspense fallback={null}>
              <LazyConvertHistoryWidget />
            </React.Suspense>
          </TabPanel>
        </Tabs>
      </Card>
    </div>
  );
};
