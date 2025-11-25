import { useState } from "react";
import { useScaffoldContext } from "../scaffold";
import { SideBarProps } from "./sidebar.ui";

export const useSideNavBuilder = (
  props?: Partial<SideBarProps>,
): SideBarProps => {
  const [current, setCurrent] = useState(props?.items?.[0].href || "/");
  const { expanded, setExpand } = useScaffoldContext();

  if (typeof setExpand === "undefined") {
    console.warn("SideBar component must be used within a Scaffold component");
  }

  return {
    items: [],
    current,
    open: expanded,
    onOpenChange: (open) => {
      setExpand?.(open);
    },
    onItemSelect: (item) => {
      if (item.href) {
        setCurrent(item.href);
      }
    },
    ...props,
  };
};
