import React, { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Card,
  Divider,
  Flex,
  Grid,
  Either,
  Statistic,
  Text,
  EyeIcon,
  gradientTextVariants,
  EditIcon,
  EyeCloseIcon,
} from "@orderly.network/ui";
import { AuthGuard } from "@orderly.network/ui-connector";
import { AssetScriptReturn } from "./assets.script";
import { AssetsHeader } from "./assetsHeader";

export const AssetsUI: React.FC<
  AssetScriptReturn & { onConnectWallet?: () => void }
> = (props) => {
  const { t } = useTranslation();
  return (
    <Card
      classNames={{ footer: "oui-h-[48px]", root: "oui-h-[240px]" }}
      title={
        <AssetsHeader
          disabled={!props.canTrade}
          isMainAccount={props.isMainAccount}
          onDeposit={props.onDeposit}
          onWithdraw={props.onWithdraw}
          onTransfer={props.onTransfer}
          hasSubAccount={props.hasSubAccount}
        />
      }
    >
      <>
        <Statistic
          label={
            <Flex gap={1}>
              <Text intensity={54} className="oui-font-normal">
                {t("common.totalValue")}
              </Text>
              <button
                onClick={() => {
                  props.toggleVisible();
                }}
                data-testid="oui-testid-portfolio-assets-eye-btn"
              >
                {props.visible ? (
                  <EyeIcon size={16} color={"white"} />
                ) : (
                  <EyeCloseIcon size={16} color={"white"} />
                )}
              </button>
            </Flex>
          }
        >
          <Either value={props.canTrade!} left={<NoValue />}>
            <Text.numeral
              visible={props.visible}
              unit="USDC"
              // @ts-ignore
              unitClassName="oui-text-base oui-text-base-contrast-36 oui-h-9 oui-ml-1 oui-font-medium"
              className={gradientTextVariants({
                className:
                  "oui-font-bold oui-text-3xl oui-text-base-contrast-100",
              })}
            >
              {props.portfolioValue ?? "--"}
            </Text.numeral>
          </Either>
        </Statistic>
        <Divider className="oui-my-4" intensity={8} />
        <AuthGuard buttonProps={{ size: "lg", fullWidth: true }}>
          <AssetStatistic
            unrealROI={props.unrealROI}
            unrealPnL={props.unrealPnL}
            freeCollateral={props.freeCollateral}
            currentLeverage={props.currentLeverage}
            onLeverageEdit={props.onLeverageEdit}
            visible={props.visible}
          />
        </AuthGuard>
      </>
    </Card>
  );
};

const NoValue: FC = () => {
  return (
    <Flex gap={1} className={"oui-h-9"}>
      <Text.gradient color="brand" weight="bold">
        --
      </Text.gradient>
      <Text>USDC</Text>
    </Flex>
  );
};

type AssetStatisticProps = Pick<
  AssetScriptReturn,
  | "currentLeverage"
  | "unrealPnL"
  | "unrealROI"
  | "freeCollateral"
  | "onLeverageEdit"
  | "visible"
>;

export const AssetStatistic = (props: AssetStatisticProps) => {
  const { t } = useTranslation();

  return (
    <Grid cols={2} className="oui-h-12">
      <Statistic className="oui-font-normal" label={t("common.unrealizedPnl")}>
        <Flex>
          <Text.pnl
            coloring
            size="lg"
            weight="semibold"
            visible={props.visible}
            style={{
              letterSpacing: "0.01em",
              fontFamily: "Manrope",
              color: "#ff41a3",
            }}
          >
            123456789
            {/* {props.unrealPnL} */}
          </Text.pnl>
          <Text.roi
            coloring
            rule="percentages"
            size="sm"
            weight="semibold"
            prefix={"("}
            suffix={")"}
            visible={props.visible}
            style={{ color: "#9C2D6A" }}
          >
            -0.156
            {/* {props.unrealROI} */}
          </Text.roi>
          <Text className="oui-text-base oui-text-base-contrast-36 oui-ml-1 oui-font-medium">
            USDC
          </Text>
        </Flex>
      </Statistic>
      <Statistic
        className="oui-font-normal"
        label={t("portfolio.overview.availableWithdraw")}
        // @ts-ignore
        align="right"
        // @ts-ignore
        valueProps={{
          size: "lg",
          visible: props.visible,
          style: { letterSpacing: "-0.03em" },
        }}
      >
        2004.52
        {/* {props.freeCollateral} */}
      </Statistic>
    </Grid>
  );
};
