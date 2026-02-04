import { FC } from "react";
import { cn, Flex } from "@orderly.network/ui";
import { useScreenSize } from "@/hooks/custom/useScreenSize";
import { GeneralLeaderboardWidget } from "../../../components/leaderboard/generalLeaderboard";
import { CampaignsWidget } from "../../components/campaigns";
import { LeaderboardScriptReturn } from "./leaderboard.script";

export type LeaderboardProps = {
  style?: React.CSSProperties;
  className?: string;
} & LeaderboardScriptReturn;

export const Leaderboard: FC<LeaderboardProps> = (props) => {
  const { size } = useScreenSize();
  const renderBackground = () => {
    const linearGradient =
      "linear-gradient(180deg, rgba(var(--oui-color-base-10) / 0.3) 0%, rgba(var(--oui-color-base-10) / 0) 70%, rgba(var(--oui-color-base-10) / 1) 100%)";

    if (props.isVideo) {
      return (
        <div
          className={cn(
            "oui-absolute oui-top-0 oui-left-0",
            "oui-w-full oui-h-full",
          )}
        >
          <div
            style={{
              backgroundImage: linearGradient,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className={cn(
              "oui-absolute oui-top-0 oui-left-0",
              "oui-w-full oui-h-full",
            )}
          />
          <video
            autoPlay
            loop
            muted
            className={cn(
              // rest style
              "oui-border-none oui-outline-none oui-bg-transparent",
              "oui-w-full oui-h-full",
              // "oui-absolute oui-top-0 oui-left-0",
              "oui-object-cover",
              "oui-opacity-50",
            )}
          >
            <source src={props.backgroundSrc} type="video/mp4" />
            <source src={props.backgroundSrc} type="video/webm" />
            <source src={props.backgroundSrc} type="video/ogg" />
            <source src={props.backgroundSrc} type="video/avi" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (props.backgroundSrc) {
      return (
        <div
          style={{
            backgroundImage: `${linearGradient}, url(${props.backgroundSrc}) `,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className={cn(
            "oui-absolute oui-top-0 oui-left-0",
            "oui-w-full oui-h-full",
            "oui-opacity-50",
          )}
        />
      );
    }
  };

  return (
    <div
      style={props.style}
      className={cn("oui-h-full oui-mix-blend-screen", props.className)}
    >
      {renderBackground()}
      <Flex
        direction="column"
        height="100%"
        className={cn("oui-trading-leaderboard oui-relative", "oui-mx-auto ")}
        style={{
          paddingLeft: size === "1920+" ? "240px" : "12px",
          paddingRight: size === "1920+" ? "240px" : "12px",
        }}
      >
        {props.showCampaigns && <CampaignsWidget />}
        <GeneralLeaderboardWidget
          className={cn(
            props.showCampaigns
              ? "oui-h-[calc(100%_-_288px_-_20px)]"
              : "oui-h-full",
          )}
          style={{
            marginTop: "3px",
          }}
        />
      </Flex>
    </div>
  );
};
