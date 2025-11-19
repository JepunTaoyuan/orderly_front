import { FC } from "react";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { Scaffold, ScaffoldProps } from "@/packages/ui-scaffold";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
};

export const BaseLayout: FC<BaseLayoutProps> = (props) => {
  const config = useOrderlyConfig();

  const { onRouteChange } = useNav();

  return (
    <Scaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: props.initialMenu || PathEnum.Root,
      }}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
      }}
      classNames={props.classNames}
    >
      {props.children}
    </Scaffold>
  );
};
