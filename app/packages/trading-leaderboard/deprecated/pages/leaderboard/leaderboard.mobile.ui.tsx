import { FC } from "react";
import { cn, Flex } from "@orderly.network/ui";
import { GeneralLeaderboardWidget } from "../../../components/leaderboard/generalLeaderboard";
import { CampaignsWidget } from "../../components/campaigns";
import { LeaderboardScriptReturn } from "./leaderboard.script";

export type LeaderboardProps = {
  style?: React.CSSProperties;
  className?: string;
} & LeaderboardScriptReturn;

export const MobileLeaderboardWidget: FC<LeaderboardProps> = (props) => {
  // const renderBackground = () => {
  //   const linearGradient =
  //     "linear-gradient(180deg, rgba(var(--oui-color-base-10) / 0.3) 0%, rgba(var(--oui-color-base-10) / 0) 70%, rgba(var(--oui-color-base-10) / 1) 100%)";

  //   if (props.isVideo) {
  //     return (
  //       <div
  //         className={cn("oui-absolute oui-left-0 oui-top-0", "oui-size-full")}
  //       >
  //         <div
  //           style={{
  //             backgroundImage: linearGradient,
  //             backgroundSize: "cover",
  //             backgroundRepeat: "no-repeat",
  //           }}
  //           className={cn("oui-absolute oui-left-0 oui-top-0", "oui-size-full")}
  //         />
  //         <video
  //           playsInline
  //           // eslint-disable-next-line react/no-unknown-property
  //           webkit-playsinline // need to use this prop to ban full screen in iphone
  //           autoPlay
  //           loop
  //           muted
  //           className={cn(
  //             // rest style
  //             "oui-pointer-events-none oui-border-none oui-bg-transparent oui-outline-none",
  //             "oui-size-full",
  //             // "oui-absolute oui-top-0 oui-left-0",
  //             "oui-object-cover",
  //             "oui-opacity-50",
  //           )}
  //           // ref={(video) => {
  //           //   if (video) {
  //           //     video.setAttribute("playsinline", "true");
  //           //     video.setAttribute("webkit-playsinline", "true");
  //           //   }
  //           // }}
  //         >
  //           <source src={props.backgroundSrc} type="video/mp4" />
  //           <source src={props.backgroundSrc} type="video/webm" />
  //           <source src={props.backgroundSrc} type="video/ogg" />
  //           <source src={props.backgroundSrc} type="video/avi" />
  //           Your browser does not support the video tag.
  //         </video>
  //       </div>
  //     );
  //   }

  //   if (props.backgroundSrc) {
  //     return (
  //       <div
  //         style={{
  //           backgroundImage: `${linearGradient}, url(${props.backgroundSrc}) `,
  //           backgroundSize: "cover",
  //           backgroundRepeat: "no-repeat",
  //         }}
  //         className={cn(
  //           "oui-absolute oui-left-0 oui-top-0",
  //           "oui-size-full",
  //           "oui-opacity-50",
  //         )}
  //       />
  //     );
  //   }
  // };

  return (
    <div
      className={cn("oui-relative oui-w-full oui-bg-base-10", props.className)}
      style={{
        // 確保外層不會溢出，而是交給內層捲動
        height: "calc(100vh - 44px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex
        direction="column"
        gapY={3}
        px={3}
        pt={3}
        style={{
          paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
        className={cn(
          "oui-trading-leaderboard-mobile",
          "oui-custom-scrollbar",
          "oui-overflow-y-auto",
          "oui-flex-1",
          "oui-w-full",
        )}
      >
        {props.showCampaigns && <CampaignsWidget />}
        <GeneralLeaderboardWidget />
      </Flex>
    </div>
  );
};
