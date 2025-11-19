import { FC, PropsWithChildren } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, Box, Flex, Divider } from "@orderly.network/ui";
import {
  ScaffoldProps,
  Scaffold,
  SideBarProps,
} from "@orderly.network/ui-scaffold";

export type PortfolioLayoutProps = ScaffoldProps & {
  hideSideBar?: boolean;
  items?: SideBarProps["items"];
  current?: string;
};

export const PortfolioLayout: FC<PropsWithChildren<PortfolioLayoutProps>> = (
  props,
) => {
  const { children, leftSideProps, classNames, items, current, ...rest } =
    props;
  const { t } = useTranslation();

  return (
    <Scaffold
      routerAdapter={props.routerAdapter}
      classNames={{
        ...classNames,
        content: cn("oui-px-3", classNames?.content),
        topNavbar: cn("oui-bg-base-9", classNames?.topNavbar),
      }}
      {...rest}
    >
      <Box
        style={{
          paddingLeft: "240px",
          paddingRight: "240px",
        }}
      >
        {!props.hideSideBar && (
          <Flex gap={8} className="oui-mb-[3px]" style={{ paddingLeft: "0px" }}>
            {items?.map((item, index) => {
              const isActive = current === item.href;
              const isLast = index === (items.length || 0) - 1;
              return (
                <div
                  key={item.href}
                  className={cn(
                    "oui-cursor-pointer oui-py-3 oui-relative oui-flex oui-flex-col oui-items-center oui-justify-center",
                    isActive
                      ? "oui-text-base-contrast"
                      : "oui-text-base-contrast-54 hover:oui-text-base-contrast-80",
                  )}
                  onClick={() => {
                    if (item.href) {
                      props.routerAdapter?.onRouteChange?.({
                        href: item.href,
                        name: item.name,
                      });
                    }
                  }}
                >
                  <span className="oui-text-sm oui-font-bold">{item.name}</span>
                  {!isLast && <Divider />}
                </div>
              );
            })}
          </Flex>
        )}
        {children}
      </Box>
    </Scaffold>
  );
};
