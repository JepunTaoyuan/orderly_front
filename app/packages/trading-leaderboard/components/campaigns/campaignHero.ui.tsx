// Campaign Hero UI component with left-aligned content and right countdown
import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, Flex, Text, Button, Badge } from "@orderly.network/ui";
import { CampaignsScriptReturn } from "./campaigns.script";
import { HeroCountdown } from "./components/heroCountdown";
import { CampaignConfig } from "./type";
import { formatCampaignDateRange } from "./utils";

type CampaignHeroUIProps = Partial<CampaignsScriptReturn> & {
  campaign: CampaignConfig;
  isMobile?: boolean;
};

export const CampaignHeroUI: FC<CampaignHeroUIProps> = ({
  campaign,
  onLearnMore,
  onTradeNow,
  backgroundSrc,
  isMobile,
}) => {
  const { t } = useTranslation();
  const bgSrc = campaign?.image || backgroundSrc;
  const dateRange = formatCampaignDateRange(
    campaign?.start_time || "",
    campaign?.end_time || "",
  );

  // Check if campaign is ongoing
  const currentTime = new Date();
  const startTime = new Date(campaign.start_time);
  const endTime = new Date(campaign.end_time);
  const isOngoing = currentTime >= startTime && currentTime < endTime;

  if (isMobile) {
    // Mobile: Stack layout
    return (
      <div
        className={cn([
          "oui-relative oui-flex oui-flex-col oui-items-center oui-justify-center",
          "oui-w-full oui-min-h-[500px] oui-px-6 oui-py-10 oui-gap-6",
          "oui-bg-cover oui-bg-center oui-bg-no-repeat",
        ])}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(var(--oui-color-base-10) / 0.9) 0%, rgba(var(--oui-color-base-10) / 0.7) 50%, rgba(var(--oui-color-base-10) / 0.9) 100%), url(${bgSrc})`,
        }}
      >
        {isOngoing && (
          <Badge
            size="sm"
            className="oui-bg-base-9 oui-text-base-contrast-80 oui-self-start"
          >
            {t("tradingLeaderboard.ongoing", "Ongoing")} ▼
          </Badge>
        )}

        <Flex
          direction="column"
          gap={3}
          itemAlign="start"
          className="oui-w-full"
        >
          <Text
            className={cn([
              "oui-trading-leaderboard-title oui-font-bold oui-text-warning",
              "oui-text-[24px] oui-leading-[32px]",
            ])}
          >
            {campaign.title}
          </Text>

          <Text className="oui-text-base-contrast oui-font-bold oui-text-[20px] oui-leading-[28px]">
            {campaign.subtitle || campaign.description}
          </Text>

          {campaign.subtitle && (
            <Text className="oui-text-base-contrast-80 oui-text-sm">
              {campaign.description}
            </Text>
          )}

          <Text size="sm" className="oui-text-base-contrast-54">
            {dateRange}
          </Text>
        </Flex>

        <HeroCountdown campaign={campaign} />

        <Flex gap={3} className="oui-w-full">
          <Button
            variant="outlined"
            onClick={onLearnMore}
            className="oui-flex-1"
          >
            {t("tradingLeaderboard.learnMore", "Learn more")}
          </Button>
          <Button onClick={onTradeNow} className="oui-flex-1">
            {t("tradingLeaderboard.tradeNow", "Trade now")}
          </Button>
        </Flex>
      </div>
    );
  }

  // Desktop: 2-column layout
  return (
    <div
      className={cn([
        "oui-relative oui-flex oui-items-center oui-justify-center",
        "oui-w-full oui-h-[300px] oui-px-6",
        "oui-bg-cover oui-bg-center oui-bg-no-repeat",
      ])}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(var(--oui-color-base-10) / 0.95) 0%, rgba(var(--oui-color-base-10) / 0.7) 40%, rgba(var(--oui-color-base-10) / 0.3) 70%, rgba(var(--oui-color-base-10) / 0.5) 100%), url(${bgSrc})`,
      }}
    >
      <div className="oui-max-w-[1200px] oui-w-full oui-flex oui-items-center oui-justify-between oui-gap-12">
        {/* Left Column - Content */}
        <Flex
          direction="column"
          gap={4}
          itemAlign="start"
          className="oui-flex-1"
        >
          {isOngoing && (
            <Badge
              size="sm"
              className="oui-bg-base-9/80 oui-text-base-contrast-80 oui-backdrop-blur-sm"
            >
              {t("tradingLeaderboard.ongoing", "Ongoing")} ▼
            </Badge>
          )}

          <Flex direction="column" gap={2} itemAlign="start">
            <Text
              className={cn([
                "oui-trading-leaderboard-title oui-font-bold oui-text-warning",
                "oui-text-[36px] oui-leading-[44px]",
              ])}
            >
              {campaign.title}
            </Text>

            <Text className="oui-text-base-contrast oui-font-bold oui-text-[28px] oui-leading-[36px] oui-max-w-[500px]">
              {campaign.subtitle || campaign.description}
            </Text>

            {campaign.subtitle && (
              <Text className="oui-text-base-contrast-80 oui-text-sm oui-max-w-[450px]">
                {campaign.description}
              </Text>
            )}
          </Flex>

          <Text size="sm" className="oui-text-base-contrast-54">
            {dateRange}
          </Text>

          <Flex gap={3}>
            <Button variant="outlined" onClick={onLearnMore} size="lg">
              {t("tradingLeaderboard.learnMore", "Learn more")}
            </Button>
            <Button onClick={onTradeNow} size="lg">
              {t("tradingLeaderboard.tradeNow", "Trade now")}
            </Button>
          </Flex>
        </Flex>

        {/* Right Column - Countdown */}
        <div className="oui-flex-shrink-0">
          <HeroCountdown campaign={campaign} />
        </div>
      </div>
    </div>
  );
};
