import { FC, useCallback, useId } from "react";
import React from "react";
import { Trans, useTranslation } from "@orderly.network/i18n";
import {
  ArrowDownShortIcon,
  ArrowLeftRightIcon,
  ArrowUpShortIcon,
  Button,
  cn,
  Divider,
  EyeCloseIcon,
  EyeIcon,
  Flex,
  Grid,
  Input,
  inputFormatter,
  InputFormatter,
  modal,
  PlusIcon,
  ReduceIcon,
  RefreshIcon,
  Statistic,
  Text,
} from "@orderly.network/ui";
import { LeverageProps, LeverageSlider } from "@/packages/ui-leverage";
import { USDCIcon } from "../accountSheet/icons";
import {
  getMarginRatioColor,
  PortfolioSheetState,
} from "./portfolioSheet.script";
import { RiskIndicator } from "./riskIndicator";

export const PortfolioSheet: FC<PortfolioSheetState> = (props) => {
  return (
    <Flex direction={"column"} gap={4} width={"100%"}>
      <Asset {...props} />
      <Divider className="oui-w-full" />
      <MarginRatio {...props} />
      {/* <Leverage {...props} /> */}
      {/* <Divider className="oui-w-full" /> */}
      {/* <AvailableBalance {...props} /> */}
      <Buttons {...props} />
    </Flex>
  );
};

const Asset: FC<PortfolioSheetState> = (props) => {
  const { t } = useTranslation();

  const onUnsettleClick = useCallback(() => {
    return modal.confirm({
      title: t("settle.settlePnl"),
      content: (
        <Text
          size="xs"
          style={{ letterSpacing: "0.12px", color: "rgba(255, 255, 255, 0.9)" }}
        >
          {/* @ts-ignore */}
          <Trans i18nKey="settle.settlePnl.description" />
        </Text>
      ),
      classNames: {
        footer: "oui-gap-2",
      },
      onCancel: () => {
        return Promise.reject();
      },
      onOk: () => {
        if (typeof props.onSettlePnL !== "function") {
          return Promise.resolve();
        }
        return props.onSettlePnL().catch((e) => {});
      },
    });
  }, [t]);

  const clsName =
    props.totalUnrealizedROI > 0
      ? "oui-text-success-darken"
      : "oui-text-danger-darken";

  return (
    <Flex direction={"column"} gap={3} width={"100%"}>
      {/* Total Value row with Settle PnL button */}
      <Flex justify={"between"} itemAlign={"start"} width={"100%"}>
        <Flex direction={"column"} itemAlign={"start"} gap={1}>
          <Flex itemAlign={"center"} gap={1}>
            <Text size="2xs" className="oui-text-white/40">
              {t("common.totalValue")} (USDC)
            </Text>
            <div
              onClick={() => props.toggleHideAssets()}
              className="oui-cursor-pointer"
            >
              {props.hideAssets ? (
                <EyeIcon
                  opacity={1}
                  size={15}
                  className="oui-text-primary-light"
                />
              ) : (
                <EyeCloseIcon
                  opacity={1}
                  size={15}
                  className="oui-text-primary-light"
                />
              )}
            </div>
          </Flex>
          <Flex itemAlign={"center"} gap={1}>
            <Text.numeral
              size="base"
              weight="bold"
              dp={2}
              padding={false}
              visible={!props.hideAssets}
              className="oui-text-white/90"
            >
              {props.totalValue ?? "--"}
            </Text.numeral>
            <Text size="xs" className="oui-text-white/50">
              USDC
            </Text>
          </Flex>
        </Flex>
        <button
          className="oui-h-7 oui-px-4 oui-rounded-full oui-bg-white/30 oui-flex oui-items-center oui-justify-center"
          onClick={onUnsettleClick}
        >
          <Text size="2xs" weight="semibold" className="oui-text-white">
            {t("settle.settlePnl")}
          </Text>
        </button>
      </Flex>

      {/* Unrealized PnL and Unsettled PnL row */}
      <Grid cols={2} rows={1} width={"100%"}>
        <Flex direction={"column"} itemAlign={"start"} gap={1}>
          <Text size="2xs" className="oui-text-white/40">
            {t("common.unrealizedPnl")} (USDC)
          </Text>
          <Flex gap={1} itemAlign={"start"}>
            <Text.pnl
              size="xs"
              weight="semibold"
              coloring
              dp={2}
              padding={false}
              visible={!props.hideAssets}
            >
              {props.aggregated.total_unreal_pnl}
            </Text.pnl>
            {!props.hideAssets && (
              <Text.roi
                size="xs"
                dp={2}
                padding={false}
                rule="percentages"
                prefix={"("}
                suffix={")"}
                className="oui-text-white/50"
              >
                {props.totalUnrealizedROI}
              </Text.roi>
            )}
          </Flex>
        </Flex>
        <Flex direction={"column"} itemAlign={"start"} gap={1}>
          <Text size="2xs" className="oui-text-white/40">
            {t("trading.asset.unsettledPnl")} (USDC)
          </Text>
          <Text.pnl
            size="xs"
            weight="semibold"
            coloring
            dp={2}
            padding={false}
            visible={!props.hideAssets}
          >
            {props.aggregated.total_unsettled_pnl}
          </Text.pnl>
        </Flex>
      </Grid>
    </Flex>
  );
};
const MarginRatio: FC<PortfolioSheetState> = (props) => {
  const { t } = useTranslation();

  const { high, mid, low } = getMarginRatioColor(
    props.marginRatioVal,
    props.mmr,
  );

  return (
    <Grid cols={2} rows={1} width={"100%"}>
      <Statistic
        label={t("trading.asset.marginRatio")}
        classNames={{
          label: "oui-text-2xs oui-text-base-contrast-36",
        }}
      >
        <Flex gap={2}>
          <Text.numeral
            size="xs"
            rule="percentages"
            color="primary"
            dp={2}
            padding={false}
            visible={!props.hideAssets}
          >
            {props.marginRatioVal}
          </Text.numeral>
          {!props.hideAssets && (
            <RiskIndicator
              className={
                low
                  ? "oui-rotate-0"
                  : mid
                    ? "oui-rotate-90"
                    : high
                      ? "oui-rotate-180"
                      : ""
              }
            />
          )}
        </Flex>
      </Statistic>
      <Statistic
        label={`${t("trading.asset.free&TotalCollateral")} (USDC)`}
        classNames={{
          label: "oui-text-2xs oui-text-base-contrast-36",
        }}
      >
        <Flex justify={"start"} width={"100%"} gap={1}>
          <Text.collateral
            size="xs"
            dp={2}
            padding={false}
            visible={!props.hideAssets}
          >
            {props.freeCollateral}
          </Text.collateral>
          <Text size="xs">/</Text>
          <Text.collateral
            size="xs"
            dp={2}
            padding={false}
            visible={!props.hideAssets}
          >
            {props.totalCollateral}
          </Text.collateral>
        </Flex>
      </Statistic>
    </Grid>
  );
};

const IconButton: React.FC<{
  Icon: React.ComponentType<any>;
  onClick: React.MouseEventHandler<SVGSVGElement>;
  disabled: boolean;
}> = (props) => {
  const { Icon, onClick, disabled } = props;
  return (
    <Icon
      onClick={disabled ? undefined : onClick}
      className={cn(
        "oui-text-white oui-m-2 oui-transition-all",
        disabled
          ? "oui-cursor-not-allowed oui-opacity-20"
          : "oui-cursor-pointer oui-opacity-100",
      )}
    />
  );
};

const LeverageInput: React.FC<PortfolioSheetState> = (props) => {
  const formatters = React.useMemo<InputFormatter[]>(
    () => [
      inputFormatter.numberFormatter,
      inputFormatter.currencyFormatter,
      inputFormatter.decimalPointFormatter,
    ],
    [],
  );
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "oui-w-full",
        "oui-rounded",
        "oui-bg-base-6",
        "oui-flex",
        "oui-items-center",
        "oui-justify-between",
        "oui-outline",
        "oui-outline-offset-0",
        "oui-outline-1",
        "oui-outline-transparent",
        "focus-within:oui-outline-primary-light",
        "oui-input-root",
      )}
    >
      <IconButton
        Icon={ReduceIcon}
        onClick={props.onLeverageReduce}
        disabled={props.isReduceDisabled}
      />
      <Flex itemAlign="center" justify="center">
        <Input
          // {...props}
          value={props.value}
          id={id}
          autoComplete="off"
          classNames={{
            input: cn("oui-text-center"),
            root: cn(
              "oui-text-center",
              "oui-w-6",
              "oui-px-0",
              "oui-outline",
              "oui-outline-offset-0",
              "oui-outline-1",
              "oui-outline-transparent",
              "focus-within:oui-outline-primary-none",
            ),
          }}
          formatters={formatters}
          onChange={props.onInputChange}
        />
        <div className="oui-select-none">x</div>
      </Flex>
      <IconButton
        Icon={PlusIcon}
        onClick={props.onLeverageIncrease}
        disabled={props.isIncreaseDisabled}
      />
    </label>
  );
};

export const LeverageSelector: React.FC<PortfolioSheetState> = (props) => {
  const { value, onLeverageChange, onValueCommit } = props;
  return (
    <Flex itemAlign="center" justify="between" width={"100%"} mt={2}>
      {[1, 5, 10, 20, 50].map((option) => (
        <Flex
          key={option}
          itemAlign="center"
          justify="center"
          className={cn(
            `oui-transition-all oui-cursor-pointer oui-box-border oui-bg-clip-padding oui-px-3 oui-py-2.5 oui-rounded-md oui-border oui-border-solid oui-bg-base-10`,
            value === option
              ? "oui-border-primary oui-bg-base-6"
              : "oui-border-line-12",
          )}
          onClick={() => {
            onLeverageChange(option);
            onValueCommit(option);
          }}
        >
          <Flex
            itemAlign="center"
            justify="center"
            className={cn(`oui-h-3 oui-w-9 oui-select-none`)}
          >
            {option}x
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

const Buttons: FC<PortfolioSheetState> = (props) => {
  const { t } = useTranslation();

  if (props.isMainAccount) {
    return (
      <Grid
        cols={props.hasSubAccount ? 3 : 2}
        rows={1}
        gap={3}
        className="oui-grid-row-[1fr,1fr]"
        width={"100%"}
        pt={2}
        pb={4}
      >
        <Button
          size="md"
          fullWidth
          className="oui-rounded-full"
          style={{
            backgroundColor: "#6E55DF",
          }}
          onClick={props.onDeposit}
        >
          {t("common.deposit")}
        </Button>
        {props.hasSubAccount && (
          <Button
            variant="outlined"
            size="md"
            onClick={props.onTransfer}
            data-testid="oui-testid-assetView-transfer-button"
            className="oui-rounded-full"
            style={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            {t("common.transfer")}
          </Button>
        )}
        <Button
          size="md"
          variant="outlined"
          fullWidth
          className="oui-rounded-full"
          style={{
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "rgba(255, 255, 255, 0.6)",
          }}
          onClick={props.onWithdraw}
        >
          {t("common.withdraw")}
        </Button>
      </Grid>
    );
  }

  return (
    <Button
      fullWidth
      color="secondary"
      size="md"
      onClick={props.onTransfer}
      data-testid="oui-testid-assetView-transfer-button"
      className="oui-rounded-full"
    >
      <Text>{t("common.transfer")}</Text>
    </Button>
  );
};
