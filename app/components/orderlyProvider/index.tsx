import { FC, ReactNode } from "react";
import { LocaleProvider, LocaleCode, LocaleEnum } from "@orderly.network/i18n";
import { i18n } from "@orderly.network/i18n";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { registerSimpleDialog, registerSimpleSheet } from "@orderly.network/ui";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { AccountCreationListener } from "@/components/custom/accountCreationListener";
import { CustomWalletConnectorWidget } from "@/components/custom/customWalletConnectorWidget";
import { ReferralCodeInterceptor } from "@/components/custom/referralCodeInterceptor";
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
    >
      <WalletConnectorProvider>
        <OrderlyAppProvider
          brokerId="orderly"
          brokerName="Orderly"
          networkId="testnet"
          appIcons={config.orderlyAppProvider.appIcons}
          onRouteChange={onRouteChange}
        >
          <ReferralCodeInterceptor />
          <AccountCreationListener />
          {props.children}
        </OrderlyAppProvider>
      </WalletConnectorProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
