import { useAppContext } from "@orderly.network/react-app";
import { useScreen } from "@orderly.network/ui";
import { TabTypes, useReferralContext } from "../../../provider";

export type AsAnAffiliateReturns = ReturnType<typeof useAsAnAffiliateScript>;

export const useAsAnAffiliateScript = () => {
  const {
    isAffiliate,
    isLoading,
    referralInfo,
    becomeAnAffiliateUrl,
    setShowHome,
    setTab,
  } = useReferralContext();

  const { wrongNetwork } = useAppContext();

  const becomeAnAffiliate = () => {
    // 如果已經是 Affiliate，直接進入 Dashboard
    if (isAffiliate) {
      onEnterAffiliatePage();
      return;
    }
    const applyFormUrl =
      "https://docs.google.com/forms/d/1ke61l1MyVGXutR7W86RcZYa4suoQOR8vm8Kik6jmcr4/viewform";
    // 否則開啟外部申請 URL
    window.open(applyFormUrl, "_blank");
    // window.open(becomeAnAffiliateUrl, "_blank");
  };

  const onEnterAffiliatePage = () => {
    setTab(TabTypes.affiliate);
    setShowHome(false);
  };

  const { isMobile } = useScreen();

  return {
    isAffiliate,
    isLoading,
    referralInfo,
    onEnterAffiliatePage,
    becomeAnAffiliate,
    wrongNetwork,
    isMobile,
  };
};
