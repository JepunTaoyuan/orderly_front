import { FC, useMemo } from "react";
import { useAccount } from "@orderly.network/hooks";
import { useAppContext } from "@orderly.network/react-app";
import { AccountStatusEnum } from "@orderly.network/types";
import {
  Flex,
  Text,
  ChevronLeftIcon,
  cn,
  useMediaQuery,
} from "@orderly.network/ui";
import { WalletConnectButtonExtension } from "../accountMenu/menu.widget";
import { AccountSummaryWidget } from "../accountSummary";
import { ChainMenuWidget } from "../chainMenu";
import { LanguageSwitcherWidget } from "../languageSwitcher";
import { LeftNavUI } from "../leftNav/leftNav.ui";
import { RouterAdapter } from "../scaffold";
import { ScanQRCodeWidget } from "../scanQRCode";
import { SubAccountWidget } from "../subAccount";
import { LinkDeviceWidget } from "./linkDevice";
import { MainLogo } from "./mainLogo";
import { MainNavWidgetProps } from "./mainNav.widget";

type MainNavMobileProps = {
  current?: string;
  subItems?: {
    name: string;
    href: string;
  }[];
  routerAdapter?: RouterAdapter;
} & MainNavWidgetProps;

export const MainNavMobile: FC<MainNavMobileProps> = (props) => {
  const { wrongNetwork, disabledConnect } = useAppContext();
  const { state } = useAccount();
  const currentMenu = useMemo(() => {
    if (Array.isArray(props?.initialMenu)) {
      return props?.campaigns;
    }
    return props?.mainMenus?.find((menu) => {
      if (!props.current) {
        return menu.href === props?.initialMenu;
      } else {
        return menu.href === props.current;
      }
    });
  }, [props?.mainMenus, props?.initialMenu, props?.current]);

  const title = useMemo(() => {
    if (currentMenu?.isHomePageInMobile) {
      return <MainLogo {...props?.logo} />;
    }
    return (
      <Text className="oui-text-2xl oui-font-bold oui-text-base-contrast">
        {currentMenu?.name}
      </Text>
    );
  }, [currentMenu, props?.logo]);

  const isSub = useMemo(() => {
    return Boolean(!currentMenu || currentMenu.isSubMenuInMobile);
  }, [currentMenu]);

  const subTitle = useMemo(() => {
    if (currentMenu?.isSubMenuInMobile) {
      return currentMenu?.name;
    }
    if (props?.subItems?.some((item) => item.href === props?.current)) {
      return props?.subItems?.find((item) => item.href === props?.current)
        ?.name;
    }
    return null;
  }, [props?.subItems, props?.current, currentMenu]);

  const onBack = () => {
    let target = props.mainMenus?.find(
      (item) => item.href === props.initialMenu,
    );
    if (currentMenu?.isSubMenuInMobile) {
      target = currentMenu?.subMenuBackNav;
    }
    props?.routerAdapter?.onRouteChange(target as any);
  };
  const isSmallScreen = useMediaQuery("(max-width: 389px)");
  const showLinkDevice =
    state.status === AccountStatusEnum.EnableTradingWithoutConnected;
  const shouldShowLinkDevice = showLinkDevice || isSmallScreen;

  const showChainMenu = !showLinkDevice && !wrongNetwork;

  const showQrcode = state.status === AccountStatusEnum.NotConnected;

  const showSubAccount = useMemo(
    () => state.status >= AccountStatusEnum.EnableTrading,
    [state.status],
  );

  if (isSub) {
    return (
      <Flex
        width={"100%"}
        height={44}
        px={3}
        direction={"row"}
        itemAlign={"center"}
        justify={"center"}
        className="oui-relative"
      >
        <ChevronLeftIcon
          className="oui-absolute oui-left-6 oui-text-base-contrast-54"
          onClick={onBack}
        />
        <Text className="oui-text-base oui-font-bold oui-text-base-contrast">
          {subTitle}
        </Text>
      </Flex>
    );
  }

  const renderContent = () => {
    const accountSummary = <AccountSummaryWidget />;
    const languageSwitcher = <LanguageSwitcherWidget />;
    const scanQRCode = showQrcode && <ScanQRCodeWidget />;
    const subAccount = showSubAccount && <SubAccountWidget />;
    const linkDevice = shouldShowLinkDevice && <LinkDeviceWidget />;
    const chainMenu = showChainMenu && <ChainMenuWidget />;
    const walletConnect = <WalletConnectButtonExtension />;
    const leftNav = props.leftNav && (
      <LeftNavUI
        {...props.leftNav}
        logo={props?.logo}
        routerAdapter={props?.routerAdapter}
      />
    );

    if (typeof props.customRender === "function") {
      return props.customRender?.({
        leftNav,
        title,
        languageSwitcher,
        scanQRCode,
        subAccount,
        linkDevice,
        chainMenu,
        walletConnect,
      });
    }

    return (
      <Flex width="100%" justify="between">
        <Flex gapX={2}>{title}</Flex>

        <Flex gapX={2}>
          {props.leading}
          {accountSummary}
          {linkDevice}
          {languageSwitcher}
          {/* {scanQRCode} */}
          {/* {subAccount} */}
          {chainMenu}
          {walletConnect}

          {props?.customLeftNav || leftNav}
          {props.trailing}
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex
      width={"100%"}
      height={44}
      px={3}
      itemAlign={"center"}
      className={cn(props.className, props.classNames?.root)}
      style={{
        background:
          state.status! >= AccountStatusEnum.SignedIn
            ? "linear-gradient(90deg, #3b3d48 1.44%, #121419 4.59%, #121419 84.64%, #52419e 92%, rgba(127, 251, 255, 0.9))"
            : "linear-gradient(90deg, #3b3d48 1.44%, #121419 2.89%, #121419 88.94%)",
      }}
    >
      {renderContent()}
    </Flex>
  );
};
