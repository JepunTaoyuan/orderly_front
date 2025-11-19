import { FC } from "react";
import { CustomFooter } from "@/components/custom/customFooter";
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
      footer={<CustomFooter {...config.scaffold.footerProps} />}
      routerAdapter={{
        onRouteChange,
      }}
      classNames={{
        ...props.classNames,
        footer: "oui-border-none oui-bg-base-9",
      }}
    >
      {props.children}
    </Scaffold>
  );
};
