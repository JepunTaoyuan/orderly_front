import { useNavigate } from "react-router";
import { generatePath } from "@orderly.network/i18n";
import { Text, useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import { LandingBackground } from "@/components/custom/LandingBackground";
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
      <style>
        {`
          @keyframes floatAndFade {
            0% { transform: translateY(0px); opacity: 0.8; }
            100% { transform: translateY(-15px); opacity: 1; }
          }
          .floating-character {
            animation: floatAndFade 2s ease-in-out infinite alternate;
          }
        `}
      </style>

      <div
        className="oui-relative oui-w-full oui-overflow-hidden"
        style={{ height: "calc(100vh - 76px)" }}
      >
        <LandingBackground />

        <div
          className="oui-relative oui-z-10 oui-flex oui-flex-col oui-justify-between oui-h-full"
          style={{
            paddingLeft: isMobile ? "24px" : "105px",
            paddingRight: isMobile ? "24px" : "105px",
          }}
        >
          {/* 中央主內容區 */}
          <div
            className={`oui-flex oui-flex-col oui-justify-center oui-flex-grow ${
              isMobile
                ? "oui-flex-1 oui-items-center oui-text-center oui-pt-10"
                : ""
            }`}
            style={{
              transform: isMobile ? "translateY(0px)" : "translateY(200px)",
            }} // 調整手機位移，避免太靠下
          >
            {/* 標題 */}
            <h1
              style={{
                color: "rgba(255, 255, 255, 0.90)",
                fontSize: isMobile ? "28px" : "72px",
                lineHeight: isMobile ? "34px" : "74px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "400",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Where Financial
              <br />
              Intelligence Is Born
            </h1>

            {/* 副標題 - 調整寬度與置中 */}
            <Text
              className="oui-text-base-contrast-80"
              size="custom"
              style={{
                width: "100%",
                maxWidth: isMobile ? "300px" : "800px",
                color: "rgba(255, 255, 255, 0.80)",
                fontSize: isMobile ? "16px" : "20px",
                lineHeight: isMobile ? "20px" : "24px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "400",
                letterSpacing: "0.4px",
                paddingTop: "16px",
              }}
            >
              DEXless is a trading platform designed for seamless execution —
              turning real trading behavior into permanent, usable financial
              intelligence.
            </Text>

            {/* 修改順序：將角色移到按鈕上方 (針對 Mobile) */}
            <div
              className={`oui-flex oui-items-center ${
                isMobile
                  ? "oui-flex-col oui-pt-6 "
                  : "oui-flex-row-reverse oui-justify-end oui-pt-10 oui-gap-x-8"
              }`}
            >
              {/* 角色圖片 */}
              <div
                className="floating-character"
                style={{ marginBottom: isMobile ? "24px" : "0" }}
              >
                <img
                  src="/images/landingpage/test01 2.png"
                  alt="DEXless Character"
                  style={{
                    width: isMobile ? "110px" : "100px",
                    height: "auto",
                  }}
                />
              </div>

              {/* 按鈕區 */}
              <div
                className={`oui-flex ${isMobile ? "oui-flex-col oui-gap-y-5 " : "oui-gap-x-3"}`}
              >
                <button
                  onClick={handleTradeNow}
                  className="oui-w-[220px] oui-h-[48px] oui-rounded-full oui-text-[14px] oui-font-semibold oui-text-white "
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(82, 65, 158) 0%, rgb(127, 251, 255) 100%)",
                  }}
                >
                  Trade on DEXLESS
                </button>

                <button
                  onClick={handleLogin}
                  className="oui-w-[220px] oui-h-[48px] oui-rounded-full oui-text-[14px] oui-font-semibold oui-text-white/80 oui-border oui-border-white/30"
                >
                  Read Docs
                </button>
              </div>
            </div>
          </div>

          {/* 底部資訊列 */}
          <div
            className={`oui-flex ${
              isMobile
                ? "oui-flex-col oui-items-start oui-gap-y-2"
                : "oui-justify-between oui-items-center"
            }`}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "20px",
              paddingBottom: "40px",
              marginBottom: isMobile ? "20px" : "80px",
            }}
          >
            {footerItems.map((item, idx) => (
              <span
                key={idx}
                style={{
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
