import React from "react";
import { useNavigate } from "@remix-run/react";
import { useMediaQuery } from "@orderly.network/hooks";
import { generatePath } from "@orderly.network/i18n";
import { PathEnum } from "@/constant";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const handleTradeNow = () => {
    navigate("/en/perp/PERP_BTC_USDC");
  };

  return (
    <section
      className="oui-relative oui-bg-cover oui-bg-center"
      style={{
        backgroundImage: "url('/images/landingpage/landingImage.jpg')",
        minHeight: "calc(100vh - 48px)",
        display: "block",
      }}
    >
      {/* 內容 */}
      <div
        className="oui-absolute oui-z-10 oui-px-6 oui-text-black"
        style={{
          left: "max(16px, 6vw)",
          top: "clamp(60px, 20vh, 320px)",
          width: "100%",
          maxWidth: "984px",
        }}
      >
        {/*文字 */}
        <div>
          <p
            style={{
              fontSize: "clamp(28px, 8vw, 90px)",
              fontWeight: "400",
              lineHeight: "1.1",
              paddingBottom: "24px",
              maxWidth: "100%",
            }}
          >
            Where Financial Intelligence Is Born
          </p>
          <p
            style={{
              fontSize: "clamp(14px, 2.2vw, 20px)",
              fontWeight: "400",
              lineHeight: "1.6",
              maxWidth: "650px",
            }}
          >
            DEXless is a trading platform designed for seamless execution —
            turning real trading behavior into permanent, usable financial
            intelligence.
          </p>

          <div className="oui-mt-8 oui-flex oui-gap-4 oui-font-bold">
            <button
              onClick={handleTradeNow}
              className="oui-px-6 oui-py-3 oui-rounded-full oui-border oui-text-white"
              style={{
                background:
                  "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
              }}
            >
              View Trading
            </button>
            {/* <button className="oui-px-6 oui-py-3 oui-rounded-full oui-border oui-border-base-6">
              Read Docs
            </button> */}
          </div>
        </div>

        <div />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          minHeight: "70px",
          background: "linear-gradient(90deg, #7053f3bb, #70c3b6bb, #d0f473bb)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "15px 20px",
          backdropFilter: "blur(20px)",
          zIndex: 20,
        }}
      >
        <Badge dotColor="#d9f132" text="NON-CUSTODIAL" />
        <Badge dotColor="#b8a7ff" text="ON-CHAIN SETTLEMENT" />
        <Badge dotColor="#97c9ff" text="PERMANENT DATA" />
        <Badge dotColor="#d9f132" text="TRANSPARENT RISK & FEES" />
      </div>
    </section>
  );
};

// 底部小標籤組件
const Badge = ({ dotColor, text }: { dotColor: string; text: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 24px",
      background: "rgba(255, 255, 255, 0.15)", // 玻璃質感背景
      border: "1px solid rgba(255, 255, 255, 0.4)",
      borderRadius: "100px",
      backdropFilter: "blur(8px)",
      height: "auto",
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: "8px",
        height: "8px",
        backgroundColor: dotColor,
        borderRadius: "50%",
        boxShadow: `0 0 10px ${dotColor}`,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: "12px",
        fontWeight: "bold",
        color: "white",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  </div>
);

export default Hero;
