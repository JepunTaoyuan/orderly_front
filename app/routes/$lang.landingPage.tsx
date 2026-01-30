import { useNavigate } from "@remix-run/react";
import { generatePath } from "@orderly.network/i18n";
import { cn, Text, useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import Hero from "@/components/landingPageLayout/Hero";
import HowItWorks from "@/components/landingPageLayout/HowItWorks";
import LandingPageFooter from "@/components/landingPageLayout/LandingPageFooter";
import Markets from "@/components/landingPageLayout/Markets";
import RiskDisclosure from "@/components/landingPageLayout/RiskDisclosure";
import SecurityAndRisk from "@/components/landingPageLayout/SecurityAndRisk";
import { WhyDexless } from "@/components/landingPageLayout/WhyDexless";
import { PathEnum } from "@/constant";

export default function LandingPage() {
  // const { isMobile } = useScreen(); // 使用 useScreen 判斷是否手機

  return (
    <BaseLayout initialMenu={PathEnum.LandingPage}>
      <Hero />
      <WhyDexless />
      <HowItWorks />
      <Markets />
      <SecurityAndRisk />
      <RiskDisclosure />
      <LandingPageFooter />
    </BaseLayout>
  );
}
