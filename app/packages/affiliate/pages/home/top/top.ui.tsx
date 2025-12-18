import { FC } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { Flex } from "@orderly.network/ui";
import { SubtitleWidget } from "../subtitle";
import { TitleWidget } from "../title";
import { TopReturns } from "./top.script";

export const Top: FC<TopReturns> = (props) => {
  if (props.overwriteTop !== undefined) {
    return props.overwriteTop?.(props.state);
  }
  const is5XL = useMediaQuery("(min-width: 1920px)");
  return (
    // 5XL 改成 itemAlign={"start"}
    <Flex
      id="oui-affiliate-home-top"
      itemAlign={is5XL ? "start" : "center"}
      direction="column"
      gap={6}
      className="oui-w-full"
    >
      <TitleWidget />
      <SubtitleWidget />
    </Flex>
  );
};
