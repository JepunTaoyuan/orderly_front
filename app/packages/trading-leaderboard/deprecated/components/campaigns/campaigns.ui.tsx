import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, Box, Text, Flex, Button, Select } from "@orderly.network/ui";
import { CampaignsScriptReturn, CurrentCampaigns } from "./campaigns.script";

export type CampaignsProps = {
  className?: string;
  style?: React.CSSProperties;
} & CampaignsScriptReturn;

export const Campaigns: FC<CampaignsProps> = (props) => {
  if (props.currentCampaigns.length === 0) {
    return null;
  }

  return (
    <Box
      width="100%"
      intensity={900}
      p={6}
      className={cn(
        "oui-trading-leaderboard-campaigns oui-rounded-[4px]",
        props.className,
      )}
      style={props.style}
    >
      <Header {...props} />
      <Box
        mt={5}
        r="xl"
        className={cn("oui-overflow-y-auto", "oui-custom-scrollbar")}
      >
        <Flex
          gapY={5}
          height={200}
          direction="column"
          r="xl"
          className="oui-pr-1.5"
        >
          {props.currentCampaigns.map((campaign) => {
            return (
              <CampaignItem
                key={campaign.title}
                campaign={campaign}
                onLearnMore={props.onLearnMore}
                onTradeNow={props.onTradeNow}
              />
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

const Header: FC<CampaignsScriptReturn> = (props) => {
  const { t } = useTranslation();
  return (
    <Flex justify="between" itemAlign="center" pr={3}>
      <Text size="xl">{t("tradingLeaderboard.campaigns")}</Text>
      <Select.options
        size={"xs"}
        value={props.category}
        onValueChange={props.onCategoryChange}
        options={props.options}
        classNames={{
          // set the width of the trigger to the width of the content
          trigger: "oui-w-[--radix-select-content-available-width]",
        }}
      />
    </Flex>
  );
};

type CampaignItemProps = {
  campaign: CurrentCampaigns;
  onLearnMore: (campaign: CurrentCampaigns) => void;
  onTradeNow: (campaign: CurrentCampaigns) => void;
};

const CampaignItem: FC<CampaignItemProps> = ({
  campaign,
  onLearnMore,
  onTradeNow,
}) => {
  const { title, description, image, displayTime } = campaign;
  const { t } = useTranslation();

  return (
    <Flex
      width="100%"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <img
        className="oui-h-[200px] oui-w-[400px] oui-object-fill"
        src={image}
        alt={title}
      />

      <Flex
        itemAlign="start"
        justify="between"
        direction="column"
        height="100%"
        p={6}
        className="oui-flex-1 oui-font-semibold"
      >
        <Flex gap={1} direction="column" itemAlign="start">
          <Text size="xl">{title}</Text>
          <Text size="sm" intensity={36}>
            {description}
          </Text>
        </Flex>
        <Flex justify="between" width="100%">
          <Text size="xs" intensity={54}>
            {displayTime}
          </Text>
          <Flex gap={3}>
            <Button
              variant="outlined"
              color="secondary"
              size="md"
              onClick={() => {
                onLearnMore(campaign);
              }}
              className="oui-rounded-full oui-border-white/[0.36] oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {t("tradingLeaderboard.learnMore")}
            </Button>
            <Button
              size="md"
              onClick={() => {
                onTradeNow(campaign);
              }}
              className="oui-rounded-full oui-text-white oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
              style={{
                background:
                  "linear-gradient(90deg, rgb(82, 65, 158) 0%, rgb(127, 251, 255) 100%)",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {t("tradingLeaderboard.tradeNow")}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
