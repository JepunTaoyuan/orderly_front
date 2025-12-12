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
  useMediaQuery,
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
      className="oui-p-5"
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
              <Text intensity={54}>{t("common.totalValue")}</Text>
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
              style={{ "--oui-gradient-angle": "45deg" }}
              unitClassName="oui-text-base oui-text-base-contrast-36  oui-h-9 oui-ml-1"
              className={gradientTextVariants({
                className: "oui-font-bold oui-text-3xl oui-text-white",
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
    <Grid cols={5} className="oui-h-12">
      <Statistic
        className="oui-py-2 oui-col-span-2"
        label={t("common.unrealizedPnl")}
      >
        <Flex>
          <Text.pnl
            coloring
            size="lg"
            weight="semibold"
            visible={props.visible}
          >
            {props.unrealPnL}
          </Text.pnl>
          <Text.roi
            coloring
            rule="percentages"
            size=""
            weight="semibold"
            prefix={"("}
            suffix={")"}
            visible={props.visible}
            style={{
              // color: "#992762",
              paddingLeft: "5px",
              paddingTop: "5px",
            }}
          >
            {props.unrealROI}
          </Text.roi>
        </Flex>
      </Statistic>
      <Divider
        direction="vertical"
        className="oui-h-16 oui-col-span-1 oui-ml-10"
        intensity={12}
      />
      <Statistic
        className="oui-col-span-2 oui-py-2"
        label={t("portfolio.overview.availableWithdraw")}
        // @ts-ignore
        align="right"
        // @ts-ignore
        valueProps={{ size: "lg", visible: props.visible }}
      >
        {props.freeCollateral}
      </Statistic>
    </Grid>
  );
};

export const AssetStatisticMobile = (props: AssetStatisticProps) => {
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width: 389px)");
  const cols = isSmallScreen ? 1 : 4;
  return (
    <Grid
      // 這邊想要加入寬度的 hook 當在390-768的時候cols={4} 當小於390的時候cols={1}
      cols={cols}
      className="oui-h-auto oui-w-full oui-px-4 oui-pb-2 oui-bg-base-9"
    >
      <Statistic
        className="oui-py-2 oui-col-span-2"
        label={t("common.unrealizedPnl")}
      >
        <Flex>
          <Text.pnl
            coloring
            size="md"
            weight="semibold"
            visible={props.visible}
          >
            {props.unrealPnL}
          </Text.pnl>
          <Text.roi
            coloring
            rule="percentages"
            size="md"
            weight="semibold"
            prefix={"("}
            suffix={")"}
            visible={props.visible}
            style={{
              // color: "#992762",
              paddingLeft: "5px",
            }}
          >
            {props.unrealROI}
          </Text.roi>
        </Flex>
      </Statistic>
      <Statistic
        className="oui-col-span-2 oui-py-2"
        label={t("portfolio.overview.availableWithdraw")}
        // @ts-ignore
        align="right"
        // @ts-ignore
        valueProps={{ size: "md", visible: props.visible }}
      >
        {props.freeCollateral}
      </Statistic>
    </Grid>
  );
};
