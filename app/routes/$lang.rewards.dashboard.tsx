import { MetaFunction } from "@remix-run/node";
import { useMediaQuery } from "@orderly.network/hooks";
import { PageTitleMap, PathEnum } from "@/constant";
import { ReferralProvider } from "@/packages/affiliate";
// 因為 index.tsx 已經 export 了 AffiliatePage，所以直接指向資料夾即可
import { AffiliatePage } from "@/packages/affiliate/pages/affiliate";
// 僅導入 Provider
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [
    { title: generatePageTitle(PageTitleMap[PathEnum.RewardsDashboard]) },
  ];
};
export default function AffiliateRoute() {
  const is5XL = useMediaQuery("(min-width: 1920px)");
  return (
    <ReferralProvider
      becomeAnAffiliateUrl="https://orderly.network/"
      learnAffiliateUrl="https://orderly.network/"
      referralLinkUrl="/"
      overwrite={{
        shortBrokerName: "Orderly",
        brokerName: "Orderly",
      }}
    >
      <div
        style={{
          paddingLeft: is5XL ? "240px" : "4px",
          paddingRight: is5XL ? "240px" : "4px",
        }}
      >
        <AffiliatePage />
      </div>
    </ReferralProvider>
  );
}
