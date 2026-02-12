// Hero Countdown component with glassmorphism style
import { FC, useState, useEffect } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { cn } from "@orderly.network/ui";
import { CampaignConfig } from "../type";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit: FC<TimeUnitProps> = ({ value, label }) => (
  <div className="oui-flex oui-flex-col oui-items-center oui-gap-1">
    <div className="oui-trading-leaderboard-title oui-text-warning oui-font-semibold oui-text-[36px] oui-leading-[44px]">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="oui-text-base-contrast-80 oui-font-medium oui-text-xs oui-uppercase">
      {label}
    </div>
  </div>
);

export const HeroCountdown: FC<{
  campaign: CampaignConfig;
}> = ({ campaign }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const startTime = new Date(campaign.start_time).getTime();
      const endTime = new Date(campaign.end_time).getTime();

      const hasStarted = currentTime >= startTime;
      const targetTime = hasStarted ? endTime : startTime;
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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [campaign.start_time, campaign.end_time]);

  const timeUnits = [
    { value: timeLeft.days, label: t("leaderboard.days") },
    { value: timeLeft.hours, label: t("leaderboard.hours") },
    { value: timeLeft.minutes, label: t("leaderboard.minutes") },
    { value: timeLeft.seconds, label: t("leaderboard.seconds") },
  ];

  return (
    <div
      className={cn([
        "oui-flex oui-flex-col oui-items-center oui-justify-center",
        "oui-rounded-2xl oui-p-6 oui-min-w-[280px]",
        "oui-backdrop-blur-md oui-bg-base-10/30",
        "oui-border oui-border-line-12",
      ])}
    >
      <div className="oui-flex oui-items-center oui-gap-4">
        {timeUnits.map((unit) => (
          <TimeUnit key={unit.label} value={unit.value} label={unit.label} />
        ))}
      </div>
    </div>
  );
};
