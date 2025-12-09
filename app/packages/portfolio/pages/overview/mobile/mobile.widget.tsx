import React from "react";
import { ENVType, useGetEnv } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import { Divider, Flex } from "@orderly.network/ui";
import { DepositStatusWidget } from "@/packages/ui-transfer";
import { useLayoutContext } from "../../../layout/context";
import { AssetsChartMobile, useAssetsChartScript } from "../assetChart";
import { useAssetScript } from "../assets";
import { AssetStatisticMobile } from "../assets/assets.ui";
import {
  PerformanceMobileUI,
  PerformanceMobileWidget,
} from "../performanceMobileDialog";
import { PortfolioChartsMobileWidget } from "../portfolioChartsMobile";
import { AccountStatusMobile } from "./accountStatus.ui.mobile";
import { AffiliateCardMobile } from "./affiliateCard.ui.mobile";
import { PortfolioHandleMobile } from "./portfolioHandle.ui.mobile";
import { PortfolioValueMobile } from "./portfolioVaule.ui.mobile";
import { SettingRouterMobile } from "./settingRouter.ui.mobile";
import { TraderCardMobile } from "./traderCard.ui.mobile";
// import { TradingRewardsCardMobile } from "./tradingRewardsCard.ui.mobile";
import { useRewardsDataScript } from "./useRewardsData.script";

export const MobileOverview: React.FC = () => {
  const {
    canTrade,
    onWithdraw,
    onDeposit,
    portfolioValue,
    unrealPnL,
    unrealROI,
    visible,
    namespace,
    freeCollateral,
    toggleVisible,
    onTransfer,
    isMainAccount,
    hasSubAccount,
    currentLeverage,
    onLeverageEdit,
  } = useAssetScript();
  // 使用 AssetsChart 的 hook
  const assetsChartProps = useAssetsChartScript();

  const { t } = useTranslation();
  const rewardsData = useRewardsDataScript();
  const layoutContext = useLayoutContext();
  const { onRouteChange } = useAppContext();
  const env = useGetEnv();

  const goToClaim = () => {
    const url = `https://${
      env !== ENVType.prod ? `${env}-` : ""
    }app.orderly.network/tradingRewards`;
    window.open(url, "_blank");
  };

  const navigateToPortfolioHistory =
    typeof onRouteChange === "function"
      ? () => {
          onRouteChange({
            href: "/portfolio/history",
            name: t("trading.history"),
          });
        }
      : undefined;

  // console.log('oui-bg-[#282e3a] rewards data', rewardsData, layoutContext, props);

  return (
    <>
      <Flex
        direction={"column"}
        width={"100%"}
        className="oui-gap-5 oui-px-4 oui-py-3"
      >
        <Flex direction="column" width="100%">
          <div className="oui-px-4 oui-bg-base-9 oui-w-full">
            <AccountStatusMobile />
          </div>
          <PortfolioValueMobile
            toggleVisible={toggleVisible}
            portfolioValue={portfolioValue}
            unrealPnL={unrealPnL}
            unrealROI={unrealROI}
            visible={visible}
            canTrade={canTrade}
            namespace={namespace}
            routerAdapter={layoutContext?.routerAdapter}
          />
          <DepositStatusWidget onClick={navigateToPortfolioHistory} />
          {/* 替換為桌面版本的 AssetsChart */}
          <AssetsChartMobile {...assetsChartProps} />
          <AssetStatisticMobile
            unrealROI={unrealROI}
            unrealPnL={unrealPnL}
            freeCollateral={freeCollateral}
            currentLeverage={currentLeverage}
            onLeverageEdit={onLeverageEdit}
            visible={visible}
          />
          {/* <PortfolioChartsMobileWidget /> */}
        </Flex>
        <PortfolioHandleMobile
          disabled={!canTrade}
          onWithdraw={onWithdraw}
          onDeposit={onDeposit}
          onTransfer={onTransfer}
          isMainAccount={isMainAccount}
          routerAdapter={layoutContext?.routerAdapter}
          hasSubAccount={hasSubAccount}
        />
        <Flex direction={"row"} width={"100%"} height={"100%"} className="">
          <PerformanceMobileWidget />
          {/* Disable trading rewards card for now. Set to row */}
          {/* <Flex direction="row" className="oui-flex-1 oui-gap-3">
            <PerformanceUIMobile/>
            <AffiliateCardMobile
              referralInfo={rewardsData.referralInfo}
              routerAdapter={layoutContext?.routerAdapter}
            />
            <TraderCardMobile
              referralInfo={rewardsData.referralInfo}
              routerAdapter={layoutContext?.routerAdapter}
            />
          </Flex> */}
          {/* <Flex direction="column" className="oui-flex-1">
            <TradingRewardsCardMobile {...rewardsData} goToClaim={goToClaim} />
          </Flex> */}
        </Flex>
        {/* <SettingRouterMobile routerAdapter={layoutContext?.routerAdapter} /> */}
      </Flex>
    </>
  );
};
