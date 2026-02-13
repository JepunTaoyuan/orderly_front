import React, { FC, useState, useRef, useEffect } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Divider,
  Box,
  cn,
  useScreen,
  Flex,
  ScrollIndicator,
} from "@orderly.network/ui";
import { LeftNavProps, RouterAdapter, LeftNavUI } from "@/packages/ui-scaffold";
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

  const navItems = [
    { name: t("common.markets"), value: MarketsPageTab.Markets },
    { name: t("common.funding"), value: MarketsPageTab.Funding },
  ];

  return (
    <Box
      style={{
        paddingLeft: is5XL ? "240px" : "0px",
        paddingRight: is5XL ? "240px" : "0px",
      }}
    >
      {/* 導覽列 - 參照 Portfolio 的設計 */}
      <Flex gap={8} className="oui-mb-[3px]" style={{ paddingLeft: "0px" }}>
        {navItems.map((item, index) => {
          const isActive = props.activeTab === item.value;
          const isLast = index === navItems.length - 1;
          return (
            <div
              key={item.value}
              className={cn(
                "oui-cursor-pointer oui-py-3 oui-relative oui-flex oui-flex-col oui-items-center oui-justify-center",
                isActive
                  ? "oui-text-base-contrast"
                  : "oui-text-base-contrast-54 hover:oui-text-base-contrast-80",
              )}
              onClick={() => {
                props.onTabChange(item.value);
              }}
            >
              <span className="oui-text-sm oui-font-bold">{item.name}</span>
              {!isLast && <Divider />}
            </div>
          );
        })}
      </Flex>

      {/* 內容區域 */}
      {props.activeTab === MarketsPageTab.Markets && (
        <>
          <React.Suspense fallback={null}>
            <LazyMarketsHeaderWidget className="oui-mt-4" />
          </React.Suspense>
          <React.Suspense fallback={null}>
            <LazyMarketsDataListWidget />
          </React.Suspense>
        </>
      )}
      {props.activeTab === MarketsPageTab.Funding && (
        <React.Suspense fallback={null}>
          <LazyFundingWidget />
        </React.Suspense>
      )}
    </Box>
  );
};

const MarketsMobileContent: React.FC<MarketsContentProps> = (props) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: t("common.markets"), value: MarketsPageTab.Markets },
    { name: t("common.funding"), value: MarketsPageTab.Funding },
  ];

  // 處理滑鼠滾輪水平滑動
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const canScrollX =
        el.scrollWidth > el.clientWidth &&
        (el.scrollLeft > 0 || el.scrollLeft + el.clientWidth < el.scrollWidth);

      if (!canScrollX) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <Flex direction="column" width="100%" height="100%">
      {/* 二級導覽列 - 參照 Portfolio 的設計 */}
      <nav
        className="
          oui-w-full
          oui-bg-base-10
          oui-sticky
          oui-top-[44px]
          oui-z-10
        "
      >
        <ScrollIndicator className="oui-w-full">
          <div
            ref={scrollRef}
            className="oui-overflow-x-auto oui-hide-scrollbar"
          >
            <Flex
              direction="row"
              className="oui-px-1 oui-gap-4 oui-py-3 oui-min-w-max"
            >
              {navItems.map((item, index) => {
                const active = props.activeTab === item.value;
                const isLast = index === navItems.length - 1;

                return (
                  <Flex key={item.value} direction="row" gapX={3}>
                    <button
                      onClick={() => {
                        props.onTabChange(item.value);
                      }}
                      className={cn(
                        "oui-text-sm oui-min-w-max oui-whitespace-nowrap oui-px-2",
                        active
                          ? "oui-text-base-contrast-40"
                          : "oui-text-base-contrast-36",
                      )}
                    >
                      {item.name}
                    </button>

                    {!isLast && (
                      <div className="oui-h-4 oui-w-px oui-bg-base-contrast-20" />
                    )}
                  </Flex>
                );
              })}
            </Flex>
          </div>
        </ScrollIndicator>
      </nav>

      {/* 內容區域 */}
      <Box className="oui-px-3">
        {props.activeTab === MarketsPageTab.Markets && (
          <>
            <React.Suspense fallback={null}>
              <LazyMarketsHeaderWidget className="oui-mt-2" />
            </React.Suspense>
            <React.Suspense fallback={null}>
              <LazyMarketsDataListWidget />
            </React.Suspense>
          </>
        )}
        {props.activeTab === MarketsPageTab.Funding && (
          <React.Suspense fallback={null}>
            <LazyFundingWidget />
          </React.Suspense>
        )}
      </Box>
    </Flex>
  );
};
