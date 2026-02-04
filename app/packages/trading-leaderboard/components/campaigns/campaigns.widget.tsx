import { FC, useMemo } from "react";
import { cn, useScreen } from "@orderly.network/ui";
import { useCanTrade } from "../../hooks/useCanTrade";
import { CampaignHeroUI } from "./campaignHero.ui";
import { useCampaignsScript } from "./campaigns.script";
import { CampaignsHeaderWidget } from "./header";

export type CampaignsWidgetProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const CampaignsWidget: FC<CampaignsWidgetProps> = (props) => {
  const state = useCampaignsScript();
  const { isMobile } = useScreen();

  const canTrade = useCanTrade();

  console.log("🎯 CampaignsWidget rendering with Hero UI", {
    hasCampaign: !!state.currentCampaign,
    campaignTitle: state.currentCampaign?.title,
  });

  return (
    <div
      className={cn(["oui-relative oui-z-[1] oui-overflow-hidden"])}
      style={props.style}
    >
      <CampaignsHeaderWidget
        backgroundSrc={state.backgroundSrc}
        campaigns={state.campaigns}
        currentCampaignId={state.currentCampaignId.toString()}
        onCampaignChange={state.onCampaignChange}
      />
      {state.currentCampaign && (
        <CampaignHeroUI
          {...state}
          isMobile={isMobile}
          campaign={state.currentCampaign}
        />
      )}
    </div>
  );
};
