import { FC, useState, useEffect } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn, Box, Text, Flex, Button, Select } from "@orderly.network/ui";
import { CampaignsScriptReturn, CurrentCampaigns } from "./campaigns.script";

export type CampaignsProps = {
  className?: string;
  style?: React.CSSProperties;
} & CampaignsScriptReturn;

// Mobile Hero Countdown Component with glassmorphism
const MobileHeroCountdown: FC<{
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
        "oui-rounded-xl oui-py-4 oui-px-5 oui-w-full",
        "oui-backdrop-blur-md oui-bg-white/5",
        "oui-border oui-border-white/10",
      ])}
    >
      {/* Labels row */}
      <div className="oui-flex oui-items-center oui-justify-between oui-w-full oui-mb-2">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="oui-flex-1 oui-text-center oui-font-medium oui-text-xs"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {unit.label}
          </div>
        ))}
      </div>
      {/* Numbers row */}
      <div className="oui-flex oui-items-center oui-justify-between oui-w-full">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="oui-flex oui-items-center oui-flex-1 oui-justify-center"
          >
            <span
              className="oui-font-semibold oui-text-[36px] oui-leading-[44px]"
              style={{ color: "rgba(219, 253, 92, 1)" }}
            >
              {unit.value.toString().padStart(2, "0")}
            </span>
            {index < timeUnits.length - 1 && (
              <span
                className="oui-font-semibold oui-text-[36px] oui-leading-[44px] oui-ml-1"
                style={{ color: "rgba(219, 253, 92, 1)" }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile Hero Campaign Item
const MobileHeroCampaignItem: FC<{
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
  const { description, displayTime, startTime, endTime } = campaign;

  return (
    <div
      className={cn([
        "oui-relative oui-flex oui-flex-col",
        "oui-w-full oui-min-h-[580px] oui-px-5 oui-py-6",
        "oui-bg-cover oui-bg-center oui-bg-no-repeat",
      ])}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(16, 16, 22, 0.7) 0%, rgba(16, 16, 22, 0.85) 50%, rgba(16, 16, 22, 0.95) 100%), url(/images/8575523b65e0147280de59ffa8e1e0dda1e77b1d.png)`,
      }}
    >
      {/* Top - Status Dropdown */}
      <div className="oui-mb-6">
        <Select.options
          size="xs"
          value={category}
          onValueChange={onCategoryChange}
          options={options}
          classNames={{
            trigger:
              "oui-bg-white/10 oui-backdrop-blur-sm oui-border oui-border-white/20 oui-text-white/80 oui-rounded-full oui-px-3",
          }}
        />
      </div>

      {/* Content */}
      <Flex direction="column" gap={3} itemAlign="start" className="oui-flex-1">
        {/* Title with line */}
        <Flex itemAlign="center" gap={3}>
          <Text
            className={cn([
              "oui-font-bold",
              "oui-text-[32px] oui-leading-[40px] oui-italic",
            ])}
            style={{ color: "rgba(219, 253, 92, 1)" }}
          >
            RISE ABOVE
          </Text>
          <div
            className="oui-h-[2px] oui-w-[60px]"
            style={{ backgroundColor: "rgba(219, 253, 92, 1)" }}
          />
        </Flex>

        {/* Subtitles */}
        <Flex direction="column" gap={0} itemAlign="start">
          <Text
            className="oui-font-bold oui-text-[24px] oui-leading-[32px] oui-tracking-wide"
            style={{ color: "rgba(255, 255, 255, 1)" }}
          >
            OUTTRADE.
          </Text>
          <Text
            className="oui-font-bold oui-text-[24px] oui-leading-[32px] oui-tracking-wide"
            style={{ color: "rgba(255, 255, 255, 1)" }}
          >
            OUTRANK.
          </Text>
          <Text
            className="oui-font-bold oui-text-[24px] oui-leading-[32px] oui-tracking-wide"
            style={{ color: "rgba(255, 255, 255, 1)" }}
          >
            OUTLAST
          </Text>
        </Flex>

        {/* Description */}
        <Text
          className="oui-text-sm oui-italic"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          {description}
        </Text>

        {/* Date */}
        <Text size="sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          {displayTime}
        </Text>
      </Flex>

      {/* Countdown */}
      <div className="oui-my-4">
        <MobileHeroCountdown endTime={endTime} startTime={startTime} />
      </div>

      {/* Buttons */}
      <Flex gap={3} className="oui-w-full">
        <Button
          variant="outlined"
          color="secondary"
          size="md"
          fullWidth
          onClick={() => onLearnMore(campaign)}
          className="oui-rounded-full oui-border-white/30 oui-px-5"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          {t("tradingLeaderboard.learnMore")}
        </Button>
        <Button
          size="md"
          fullWidth
          onClick={() => onTradeNow(campaign)}
          className="oui-rounded-full oui-px-5"
          style={{
            background:
              "linear-gradient(90deg, rgb(82, 65, 158) 0%, rgb(127, 251, 255) 100%)",
            color: "rgba(255, 255, 255, 1)",
          }}
        >
          {t("tradingLeaderboard.tradeNow")}
        </Button>
      </Flex>
    </div>
  );
};

export const MobileCampaigns: FC<CampaignsProps> = (props) => {
  if (props.currentCampaigns.length === 0) {
    return null;
  }

  // Get the first campaign for the hero display
  const heroCampaign = props.currentCampaigns[0];

  return (
    <Box
      width="100%"
      className={cn(
        "oui-mobile-trading-leaderboard-campaigns",
        props.className,
      )}
      style={props.style}
    >
      <MobileHeroCampaignItem
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
