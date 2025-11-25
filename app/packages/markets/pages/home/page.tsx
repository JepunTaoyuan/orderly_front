import React, { FC, useState } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Divider,
  Box,
  cn,
  TabPanel,
  Tabs,
  useScreen,
  Flex,
} from "@orderly.network/ui";
import {
  LeftNavProps,
  RouterAdapter,
  LeftNavUI,
} from "@orderly.network/ui-scaffold";
import {
  MarketsProvider,
  type MarketsProviderProps,
} from "../../components/marketsProvider";
import { MarketsPageTab } from "../../type";

const LazyMarketsHeaderWidget = React.lazy(() =>
  import("./marketsHeader/marketsHeader.widget").then((mod) => {
    return { default: mod.MarketsHeaderWidget };
  }),
);

const LazyMarketsDataListWidget = React.lazy(() =>
  import("./marketsDataList").then((mod) => {
    return { default: mod.MarketsDataListWidget };
  }),
);

const LazyFundingWidget = React.lazy(() =>
  import("./funding/funding.widget").then((mod) => {
    return { default: mod.FundingWidget };
  }),
);

export type MarketsHomePageProps = MarketsProviderProps & {
  className?: string;
};

export const MarketsHomePage: FC<MarketsHomePageProps> = (props) => {
  const { isMobile } = useScreen();

  const [activeTab, setActiveTab] = useState<MarketsPageTab>(
    MarketsPageTab.Markets,
  );

  return (
    <MarketsProvider
      symbol={props.symbol}
      onSymbolChange={props.onSymbolChange}
      navProps={props.navProps}
      comparisonProps={props.comparisonProps}
    >
      <div
        id="oui-markets-home-page"
        className={cn("oui-font-semibold", props.className)}
      >
        {isMobile ? (
          <MarketsMobileContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            navProps={props.navProps}
          />
        ) : (
          <MarketsDesktopContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </MarketsProvider>
  );
};

type MarketsContentProps = {
  activeTab: MarketsPageTab;
  onTabChange: (value: MarketsPageTab) => void;
  // only for mobile
  navProps?: {
    logo?: {
      src: string;
      alt: string;
    };
    routerAdapter?: RouterAdapter;
    leftNav?: LeftNavProps;
  };
};

const MarketsDesktopContent: React.FC<MarketsContentProps> = (props) => {
  const { t } = useTranslation();
  const is5XL = useMediaQuery("(min-width: 1920px)");

  return (
    <Box
      style={{
        paddingLeft: is5XL ? "240px" : "0px",
        paddingRight: is5XL ? "240px" : "0px",
        paddingTop: "11px",
      }}
    >
      <Tabs
        variant="text"
        size="sm"
        value={props.activeTab}
        onValueChange={props.onTabChange as (value: string) => void}
        classNames={{
          trigger: cn(
            // 或者使用透明背景
            "data-[state=active]:after:oui-bg-transparent",
          ),
        }}
        style={{ paddingLeft: "0px" }}
      >
        <Flex>
          <TabPanel
            title={t("common.markets")}
            value={MarketsPageTab.Markets}
            testid="oui-testid-markets-tab"
          >
            <React.Suspense fallback={null}>
              <LazyMarketsHeaderWidget className="oui-mt-4" />
            </React.Suspense>
            <React.Suspense fallback={null}>
              <LazyMarketsDataListWidget />
            </React.Suspense>
          </TabPanel>
          <TabPanel
            title={t("common.funding")}
            value={MarketsPageTab.Funding}
            testid="oui-testid-funding-tab"
          >
            <React.Suspense fallback={null}>
              <LazyFundingWidget />
            </React.Suspense>
          </TabPanel>
        </Flex>
      </Tabs>
    </Box>
  );
};

const MarketsMobileContent: React.FC<MarketsContentProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Tabs
      variant="text"
      size="sm"
      value={props.activeTab}
      onValueChange={props.onTabChange as (value: string) => void}
      classNames={{
        tabsListContainer: "oui-border-0",
        tabsList: "oui-mx-6 oui-mt-2",
        trigger: cn(
          "oui-text-md oui-font-bold",
          "data-[state=active]:after:oui-bg-transparent!",
        ),
        tabsContent: "oui-px-3",
      }}
      leading={
        props.navProps?.leftNav && (
          <LeftNavUI
            className="-oui-mr-4 oui-ml-3"
            {...props?.navProps?.leftNav}
            logo={props?.navProps?.logo}
            routerAdapter={props?.navProps?.routerAdapter}
          />
        )
      }
    >
      <TabPanel
        title={t("common.markets")}
        value="markets"
        testid="oui-testid-markets-tab"
      >
        <React.Suspense fallback={null}>
          <LazyMarketsHeaderWidget className="oui-mt-2" />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <LazyMarketsDataListWidget />
        </React.Suspense>
      </TabPanel>
      <TabPanel
        title={t("common.funding")}
        value="funding"
        testid="oui-testid-funding-tab"
      >
        <React.Suspense fallback={null}>
          <LazyFundingWidget />
        </React.Suspense>
      </TabPanel>
    </Tabs>
  );
};
