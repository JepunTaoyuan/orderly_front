import { FC, useState, useEffect } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, Box, Text, Flex, Button, Select } from "@orderly.network/ui";
import { CampaignsScriptReturn, CurrentCampaigns } from "./campaigns.script";

export type CampaignsProps = {
  className?: string;
  style?: React.CSSProperties;
} & CampaignsScriptReturn;

// Hero Countdown Component with glassmorphism
const HeroCountdown: FC<{
  endTime: string | Date;
  startTime: string | Date;
}> = ({ endTime, startTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      const hasStarted = currentTime >= start;
      const targetTime = hasStarted ? end : start;
      const difference = targetTime - currentTime;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, startTime]);

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div
      className={cn([
        "oui-flex oui-flex-col oui-items-center oui-justify-center",
        "oui-rounded-2xl oui-p-6 oui-min-w-[280px]",
        "oui-backdrop-blur-md oui-bg-white/5",
        "oui-border oui-border-white/10",
      ])}
    >
      <div className="oui-flex oui-items-center oui-gap-4">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="oui-flex oui-flex-col oui-items-center oui-gap-1"
          >
            <div
              className="oui-font-semibold oui-text-[36px] oui-leading-[44px]"
              style={{ color: "rgba(219, 253, 92, 1)" }}
            >
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div
              className="oui-font-medium oui-text-xs oui-uppercase"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hero Campaign Item - the new layout
const HeroCampaignItem: FC<{
  campaign: CurrentCampaigns;
  onLearnMore: (campaign: CurrentCampaigns) => void;
  onTradeNow: (campaign: CurrentCampaigns) => void;
  category: string;
  options: { label: string; value: string }[];
  onCategoryChange: (value: string) => void;
}> = ({
  campaign,
  onLearnMore,
  onTradeNow,
  category,
  options,
  onCategoryChange,
}) => {
  const { t } = useTranslation();
  const { description, image, displayTime, startTime, endTime } = campaign;

  return (
    <div
      className={cn([
        "oui-relative oui-flex oui-items-center oui-justify-between",
        "oui-w-full oui-min-h-[300px] oui-px-8 oui-py-10",
        "oui-bg-cover oui-bg-center oui-bg-no-repeat",
      ])}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(16, 16, 22, 0.95) 0%, rgba(16, 16, 22, 0.7) 40%, rgba(16, 16, 22, 0.3) 70%, rgba(16, 16, 22, 0.5) 100%), url(/images/8575523b65e0147280de59ffa8e1e0dda1e77b1d.png)`,
      }}
    >
      {/* Top Right - Status Dropdown */}
      <div className="oui-absolute oui-top-4 oui-right-6">
        <Select.options
          size="xs"
          value={category}
          onValueChange={onCategoryChange}
          options={options}
          classNames={{
            trigger:
              "oui-bg-white/10 oui-backdrop-blur-sm oui-border-0 oui-text-white/80",
          }}
        />
      </div>

      {/* Left Column - Content */}
      <Flex
        direction="column"
        gap={4}
        itemAlign="start"
        className="oui-flex-1 oui-max-w-[500px]"
      >
        <Flex direction="column" gap={2} itemAlign="start">
          <Text
            className={cn([
              "oui-font-bold",
              "oui-text-[32px] oui-leading-[40px] oui-italic",
            ])}
            style={{ color: "rgba(219, 253, 92, 1)" }}
          >
            RISE ABOVE —
          </Text>

          <Text
            className="oui-font-bold oui-text-[24px] oui-leading-[32px] oui-tracking-wide"
            style={{ color: "rgba(255, 255, 255, 1)" }}
          >
            OUTTRADE. OUTRANK. OUTLAST
          </Text>

          <Text
            className="oui-text-sm oui-max-w-[400px]"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            {description}
          </Text>
        </Flex>

        <Text size="sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          {displayTime}
        </Text>

        <Flex gap={3}>
          <Button
            variant="outlined"
            color="secondary"
            size="md"
            onClick={() => onLearnMore(campaign)}
            className="oui-rounded-full oui-border-white/30 oui-px-5"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            {t("tradingLeaderboard.learnMore")}
          </Button>
          <Button
            size="md"
            onClick={() => onTradeNow(campaign)}
            className="oui-rounded-full oui-px-5"
            style={{
              background:
                "linear-gradient(90deg, #7053F3 0%, #78CBC1 45%, #CDEB78 96%)",
              color: "rgba(255, 255, 255, 1)",
            }}
          >
            {t("tradingLeaderboard.tradeNow")}
          </Button>
        </Flex>
      </Flex>

      {/* Right Column - Countdown */}
      <div className="oui-flex-shrink-0">
        <HeroCountdown endTime={endTime} startTime={startTime} />
      </div>
    </div>
  );
};

export const Campaigns: FC<CampaignsProps> = (props) => {
  if (props.currentCampaigns.length === 0) {
    return null;
  }

  // Get the first campaign for the hero display
  const heroCampaign = props.currentCampaigns[0];

  return (
    <Box
      width="100%"
      className={cn(
        "oui-trading-leaderboard-campaigns oui-py-3",
        props.className,
      )}
      style={props.style}
    >
      <HeroCampaignItem
        campaign={heroCampaign}
        onLearnMore={props.onLearnMore}
        onTradeNow={props.onTradeNow}
        category={props.category}
        options={props.options}
        onCategoryChange={props.onCategoryChange}
      />
    </Box>
  );
};
