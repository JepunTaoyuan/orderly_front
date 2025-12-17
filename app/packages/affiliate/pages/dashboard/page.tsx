import { useMediaQuery } from "@orderly.network/hooks";
import { Flex, Box, cn } from "@orderly.network/ui";
import { TabWidget } from "./tab";

export const DashboardPage = (props: {
  classNames?: {
    root?: string;
    loadding?: string;
    home?: string;
    dashboard?: string;
  };
}) => {
  const { classNames = {} } = props;
  const { root, ...rest } = classNames;
  const is5XL = useMediaQuery("(min-width: 1920px)");
  return (
    <div
      id="oui-affiliate-dashboard-page"
      className={cn("oui-w-full oui-tracking-tight", root)}
      style={{
        paddingLeft: is5XL ? "240px" : "12px",
        paddingRight: is5XL ? "240px" : "12px",
      }}
    >
      <TabWidget classNames={rest} />
    </div>
  );
};
