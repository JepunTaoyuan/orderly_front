import { FC } from "react";
import { cn, Box, useScreen } from "@orderly.network/ui";
import { useMyPointsScript } from "./myPoints.script";
import { MyPointsUI } from "./myPoints.ui";

export type MyPointsWidgetProps = {
  style?: React.CSSProperties;
  className?: string;
};

export const MyPointsWidget: FC<MyPointsWidgetProps> = (props) => {
  const { isMobile } = useScreen();
  const scriptReturn = useMyPointsScript({
    pageSize: isMobile ? 10 : 15,
  });

  return (
    <MyPointsUI
      {...scriptReturn}
      className={cn(
        "oui-trading-leaderboard-my-points-widget",
        props.className,
      )}
      style={props.style}
    />
  );
};
