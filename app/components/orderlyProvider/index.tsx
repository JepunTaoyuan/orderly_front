import { FC, ReactNode } from "react";
import {
  LocaleProvider,
  LocaleCode,
  LocaleEnum,
  i18nCookieKey,
} from "@orderly.network/i18n";
import { i18n } from "@orderly.network/i18n";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { registerSimpleDialog, registerSimpleSheet } from "@orderly.network/ui";
import {
  Network,
  WalletConnectorPrivyProvider,
  wagmiConnectors,
} from "@orderly.network/wallet-connector-privy";
import { AccountCreationListener } from "@/components/custom/accountCreationListener";
import { CustomWalletConnectorWidget } from "@/components/custom/customWalletConnectorWidget";
import { KeyPairGenerator } from "@/components/custom/keyPairGenerator";
import { ReferralCodeInterceptor } from "@/components/custom/referralCodeInterceptor";
import { GridStrategiesProvider } from "@/contexts/GridStrategiesContext";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

// 在應用啟動時立即註冊自定義組件
registerSimpleDialog("walletConnector", CustomWalletConnectorWidget, {
  size: "sm",
  title: () => i18n.t("connector.connectWallet"),
});

registerSimpleSheet("walletConnectorSheet", CustomWalletConnectorWidget, {
  title: () => i18n.t("connector.connectWallet"),
});

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const { onRouteChange } = useNav();

  const onLanguageChanged = async (lang: LocaleCode) => {
    document.cookie = `${i18nCookieKey}=${lang};path=/;max-age=31536000`;
    window.history.replaceState({}, "", `/${lang}${path}`);
  };

  const loadPath = (lang: LocaleCode) => {
    if (lang === LocaleEnum.en) {
      // because en is built-in, we need to load the en extend only
      return `/locales/extend/${lang}.json`;
    }
    return [`/locales/${lang}.json`, `/locales/extend/${lang}.json`];
  };

  return (
    <LocaleProvider
      onLanguageChanged={onLanguageChanged}
      backend={{ loadPath }}
      languages={[
        { localCode: LocaleEnum.en, displayName: "English" },
        { localCode: LocaleEnum.zh, displayName: "简体中文" },
        { localCode: LocaleEnum.tc, displayName: "繁體中文" },
      ]}
    >
      <WalletConnectorPrivyProvider
        network={Network.mainnet}
        privyConfig={{
          appid: "cmlg35p5t013jjg0b4fy531sx",
          config: {
            appearance: {
              theme: "dark",
              accentColor: "#181C23",
              logo: "/images/dexless/dexless_logo.svg",
            },
            loginMethods: ["email", "google", "twitter", "telegram"],
          },
        }}
        wagmiConfig={{
          connectors: [
            wagmiConnectors.injected(),
            wagmiConnectors.walletConnect({
              projectId: "1f81be1dab1e063eb20b0bb26c6a2752",
              showQrModal: true,
              storageOptions: {},
              metadata: {
                name: "dexless",
                description: "dexless - Orderly Network DEX",
                url: "https://dexless.io",
                icons: ["/images/dexless/dexless_logo.svg"],
              },
            }),
          ],
        }}
      >
        <OrderlyAppProvider
          brokerId="dexless"
          brokerName="dexless"
          networkId="mainnet"
          appIcons={config.orderlyAppProvider.appIcons}
          onRouteChange={onRouteChange}
        >
          <GridStrategiesProvider>
            <KeyPairGenerator />
            <ReferralCodeInterceptor />
            <AccountCreationListener />
            {props.children}
          </GridStrategiesProvider>
        </OrderlyAppProvider>
      </WalletConnectorPrivyProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
