import { PropsWithChildren } from "react";
import { useLayoutBuilder } from "./layout.script";
import { AffiliateLayout } from "./layout.ui";

export const AffiliateLayoutWidget = (props: PropsWithChildren) => {
  const state = useLayoutBuilder();
  return <AffiliateLayout {...state} children={props.children} />;
};
