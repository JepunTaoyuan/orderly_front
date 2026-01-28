import { useNavigate } from "@remix-run/react";
import { generatePath } from "@orderly.network/i18n";
import { Text, useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import { LandingBackground } from "@/components/custom/LandingBackground";
import { LandingBackgroundMobile } from "@/components/custom/LandingBackgroundMobile";
import Hero from "@/components/landingPageLayout/Hero";
import { PathEnum } from "@/constant";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isMobile } = useScreen(); // 使用 useScreen 判斷是否手機

  const handleTradeNow = () => {
    navigate("/en/perp/PERP_BTC_USDC");
  };

  const handleLogin = () => {
    navigate(generatePath({ path: PathEnum.Portfolio }));
  };

  const footerItems = [
    "NON-CUSTODIAL",
    "ON-CHAIN SETTLEMENT",
    "PERMANENT DATA",
    "TRANSPARENT RISK",
  ];

  return (
    <BaseLayout initialMenu={PathEnum.LandingPage}>
      <main>
        <Hero />
        {/* <WhyDexless />
            <Markets /> */}
      </main>
    </BaseLayout>
  );
}
