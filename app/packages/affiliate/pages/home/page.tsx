import { Flex, Box, cn } from "@orderly.network/ui";
import { BecomeAffiliateWidget } from "./becomeAffiliate";
import { CardWidget } from "./card";
import { TopWidget } from "./top";

export const HomePage = () => {
  return (
    <Flex
      id="oui-affiliate-home-page"
      className={cn(
        "oui-h-lvw ",
        // padding
        // "oui-p-4 lg:oui-p-6 xl:oui-p-3",
        "oui-font-semibold",
      )}
      direction={"column"}
      gap={2}
    >
      <TopWidget />
      <CardWidget />
      <BecomeAffiliateWidget />
    </Flex>
  );
};
