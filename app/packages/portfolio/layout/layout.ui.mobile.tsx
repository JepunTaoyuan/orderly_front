import { FC, PropsWithChildren } from "react";
import { Flex, Box, cn } from "@orderly.network/ui";
import {
  MainNavMobile,
  BottomNav,
  type ScaffoldProps,
  LeftNavWidget,
} from "@/packages/ui-scaffold";
import { LayoutProvider } from "./context";
import { usePortfolioLayoutScriptType } from "./layout.script";

export const PortfolioLayoutMobile: FC<
  PropsWithChildren<
    ScaffoldProps & usePortfolioLayoutScriptType & { current?: string }
  >
> = (props) => {
  const leftNavItems = [
    { name: "Overview", href: "/portfolio" },
    { name: "Positions", href: "/portfolio/positions" },
    { name: "Orders", href: "/portfolio/orders" },
    { name: "Assets", href: "/portfolio/assets" },
    { name: "Fee Tier", href: "/portfolio/feeTier" },
    { name: "API Keys", href: "/portfolio/apiKey" },
    { name: "Settings", href: "/portfolio/setting" },
  ];

  return (
    <LayoutProvider {...props}>
      <Flex
        direction={"column"}
        width={"100%"}
        height={"100%"}
        className="oui-h-full-screen oui-bg-base-10"
      >
        <header className="oui-scaffold-topNavbar oui-sticky oui-top-0 oui-z-10 oui-w-full oui-bg-base-10">
          <MainNavMobile
            {...props.mainNavProps}
            current={props?.current}
            subItems={props?.items}
            routerAdapter={props.routerAdapter}
          />
        </header>

        <nav
          className="
            oui-w-full
            oui-bg-base-10
            oui-sticky oui-top-[44px]
            oui-z-10
            oui-overflow-x-auto
            oui-hide-scrollbar
          "
        >
          <Flex className="oui-px-1 oui-gap-4 oui-py-3" direction="row">
            {leftNavItems.map((item, index) => {
              const active = props.current === item.href;
              const isLast = index === leftNavItems.length - 1;

              return (
                <Flex key={item.href} direction="row" gapX={3}>
                  {/* --- Nav Button --- */}
                  <button
                    onClick={() => {
                      props.routerAdapter?.onRouteChange?.({
                        href: item.href,
                        name: item.name,
                      });
                    }}
                    className={`
                      oui-text-sm oui-min-w-max oui-whitespace-nowrap oui-px-2
                      ${
                        active
                          ? "oui-text-base-contrast-40"
                          : "oui-text-base-contrast-36"
                      }
                    `}
                  >
                    {item.name}
                  </button>

                  {/* --- Divider (except last one) --- */}
                  {!isLast && (
                    <div className="oui-h-4 oui-w-px oui-bg-base-contrast-20"></div>
                  )}
                </Flex>
              );
            })}
          </Flex>
        </nav>

        <Box className="oui-scaffold-container oui-min-h-[calc(100vh-44px-64px-env(safe-area-inset-bottom))] oui-w-full">
          {props.children}
        </Box>
        <footer className="oui-scaffold-bottomNav oui-fixed oui-bottom-0 oui-z-10 oui-w-full oui-bg-base-9 oui-pb-[calc(env(safe-area-inset-bottom))]">
          <BottomNav
            mainMenus={props.bottomNavProps?.mainMenus}
            current={props?.current}
            onRouteChange={props.routerAdapter?.onRouteChange}
          />
        </footer>
      </Flex>
    </LayoutProvider>
  );
};
