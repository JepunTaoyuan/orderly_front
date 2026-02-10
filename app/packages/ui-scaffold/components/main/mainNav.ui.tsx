import { FC, PropsWithChildren, useMemo } from "react";
import { AccountStatusEnum } from "@orderly.network/types";
import {
  cn,
  Divider,
  Flex,
  useMediaQuery,
  useScreen,
} from "@orderly.network/ui";
import Airdrop from "@/components/custom/Airdrop";
import { WalletConnectButtonExtension } from "../accountMenu/menu.widget";
import { AccountSummaryWidget } from "../accountSummary";
import { ChainMenuWidget } from "../chainMenu";
import { SubAccountWidget } from "../subAccount";
import { CampaignButton } from "./campaignButton";
import { LinkDeviceWidget } from "./linkDevice";
import { MainLogo } from "./mainLogo";
import { MainNavMenusExtension } from "./mainMenus/mainNavMenus.widget";
import { CampaignPositionEnum, MainNavScriptReturn } from "./mainNav.script";

export const MainNav: FC<PropsWithChildren<MainNavScriptReturn>> = (props) => {
  const { className, classNames, campaigns, campaignPosition } = props;

  const showCampaignButton =
    campaignPosition === CampaignPositionEnum.navTailing && campaigns;

  const showLinkIcon =
    !props.wrongNetwork &&
    !props.disabledConnect &&
    props.status! >= AccountStatusEnum.SignedIn;

  const showSubAccount = props.status! >= AccountStatusEnum.EnableTrading;

  const hideWalletConnectButton =
    !props.disabledConnect && props.wrongNetwork && props.isConnected;

  const { isDesktop } = useScreen();
  const is2XL = useMediaQuery("(min-width: 1309px)");

  const children = useMemo(() => {
    if (typeof props.children === "undefined") {
      return null;
    }
    return <Flex grow>{props.children}</Flex>;
  }, [props.children]);

  const showChainMenu = isDesktop;

  const renderContent = () => {
    const title = <MainLogo {...props.logo} />;
    const accountSummary = <AccountSummaryWidget />;
    const linkDevice = showLinkIcon && <LinkDeviceWidget />;
    const subAccount = showSubAccount && <SubAccountWidget />;
    const chainMenu = showChainMenu && <ChainMenuWidget />;
    const walletConnect = !hideWalletConnectButton && (
      <WalletConnectButtonExtension />
    );

    const mainNav = (
      <>
        <MainNavMenusExtension
          {...props.mainMenus}
          classNames={classNames?.mainNav}
        />
        {!!showCampaignButton && (
          <CampaignButton
            {...campaigns}
            className={classNames?.campaignButton}
          />
        )}
      </>
    );

    if (typeof props.customRender === "function") {
      return props.customRender?.({
        title,
        mainNav,
        accountSummary,
        linkDevice,
        subAccount,
        chainMenu,
        walletConnect,
      });
    }
    const isLandingPage =
      location.pathname === "/" || location.pathname.includes("landing");
    return (
      <>
        <Flex
          itemAlign={"center"}
          className={cn(
            "oui-gap-3",
            // let the left and right views show spacing when overlapping
            "oui-overflow-hidden",
          )}
        >
          {title}
          {props.leading}
          {is2XL && (
            <>
              {mainNav}
              <Airdrop />
            </>
          )}
          {props.trailing}
        </Flex>

        {children}

        <Flex itemAlign={"center"} className="oui-gap-2">
          {accountSummary}
          {showLinkIcon && (
            <>
              <Divider
                direction="vertical"
                className="oui-h-8"
                intensity={isLandingPage ? 54 : 8}
              />
              {linkDevice}
            </>
          )}
          {subAccount}
          <>
            <Divider
              direction="vertical"
              className="oui-h-8"
              intensity={isLandingPage ? 54 : 8}
            />
            {chainMenu}
            <Divider
              direction="vertical"
              className="oui-h-8"
              intensity={isLandingPage ? 54 : 8}
            />
          </>
          {walletConnect}
        </Flex>
      </>
    );
  };
  // 判斷是否landingpage 背景改為白色
  const isLandingPage =
    location.pathname === "/" || location.pathname.includes("landing");
  return (
    <Flex
      width="100%"
      as="header"
      itemAlign={"center"}
      height={"48px"}
      justify={"between"}
      px={3}
      gapX={3}
      className={cn(
        "oui-main-nav oui-font-semibold",
        className,
        classNames?.root,
      )}
      // style={{
      //   background:
      //     "linear-gradient(90deg, #3b3d48 1.44%, #121419 2.89%, #121419 88.94%)",
      // }}
      // style={{
      //   background:
      //     // props.status! >= AccountStatusEnum.SignedIn
      //     //   ? "linear-gradient(90deg, #3b3d48 1.44%, #121419 4.59%, #121419 84.64%, #52419e 92%, rgba(127, 251, 255, 0.9))"
      //     //   : "linear-gradient(90deg, #3b3d48 1.44%, #121419 2.89%, #121419 88.94%)",
      // }}
      style={{
        background: isLandingPage
          ? props.status! >= AccountStatusEnum.SignedIn
            ? "white"
            : "white"
          : props.status! >= AccountStatusEnum.SignedIn
            ? "linear-gradient(90deg, #3B3D48 2%, #121419 3%, #121419 84%, #7158F1 88%, #8BD9CA 98%, #B3EAB0 100%)"
            : "linear-gradient(90deg, #3b3d48 1.44%, #121419 2.89%, #121419 88.94%)",
      }}
    >
      {renderContent()}
    </Flex>
  );
};

MainNav.displayName = "MainNav";
