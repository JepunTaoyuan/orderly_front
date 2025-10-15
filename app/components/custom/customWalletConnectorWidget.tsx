import React from "react";
import { WalletConnectContent } from "@orderly.network/ui-connector";
import { useCustomReferralHandler } from "@/hooks/custom/useCustomReferralHandler";

export const CustomWalletConnectorWidget: React.FC<any> = (props) => {
  const state = useCustomReferralHandler();
  return <WalletConnectContent {...state} {...props} />;
};
