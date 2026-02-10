import React from "react";
import { useNavigate } from "@remix-run/react";
import { useMediaQuery } from "@orderly.network/hooks";
import { generatePath } from "@orderly.network/i18n";
import { Button, useScreen } from "@orderly.network/ui";
import { PathEnum } from "@/constant";

const Hero: React.FC = () => {
  const isLG = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  const handleTradeNow = () => {
    navigate("/en/perp/PERP_BTC_USDC");
  };

  return (
    <section
      className="oui-relative oui-bg-cover oui-bg-center oui-overflow-hidden"
      style={{
        minHeight: "calc(100dvh - 40px)",
        display: "block", // 恢復原本塊級佈局
      }}
    >
      <video
        key={isLG ? "desktop" : "mobile"}
        autoPlay
        loop
        muted
        playsInline
        poster="/images/landingpage/landingImage.jpg"
        className="oui-absolute oui-top-0 oui-left-0 oui-w-full oui-h-full"
        style={{
          objectFit: "cover",
          zIndex: 0,
          transform: isLG ? "none" : "scale(1.2)",
          transformOrigin: isLG ? "center" : " bottom",
        }}
      >
        {isLG ? (
          <source src="/images/landingpage/motion_6.mp4" type="video/mp4" />
        ) : (
          <source src="/images/landingpage/motion_2.mp4" type="video/mp4" />
        )}
      </video>

      {/* 內容容器 */}
      <div
        className="oui-absolute oui-z-10 oui-px-6 oui-text-black"
        style={{
          left: isLG ? "max(16px, 6vw)" : "0",
          right: isLG ? "auto" : "0",
          top: isLG ? "clamp(60px, 20vh, 320px)" : "45%",
          transform: isLG ? "none" : "translateY(-50%)",
          width: "100%",
          maxWidth: isLG ? "984px" : "100%",
          textAlign: isLG ? "left" : "center",
        }}
      >
        {/* 文字區塊 */}
        <div
          className={`oui-flex oui-flex-col ${isLG ? "oui-items-start" : "oui-items-center"}`}
        >
          <h1
            style={{
              fontSize: "clamp(30px, 8vw, 90px)",
              fontWeight: "600",
              lineHeight: "1.1",
              paddingBottom: "24px",
              maxWidth: isLG ? "100%" : "15em", // 手機版縮窄寬度以便斷句
              margin: isLG ? "0" : "0 auto",
            }}
          >
            Where Financial Intelligence Is Born
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 2.2vw, 20px)",
              fontWeight: "400",
              lineHeight: "1.6",
              maxWidth: "650px",
              margin: isLG ? "0" : "0 auto",
              opacity: 0.8,
            }}
          >
            DEXless is an AI-native platform designed for seamless execution —
            turning real trading behavior into permanent, usable financial
            intelligence.
          </p>

          {/* 按鈕組 */}
          <div
            className={`oui-mt-8 oui-flex oui-gap-4 oui-font-bold ${isLG ? "oui-justify-start" : "oui-justify-center"}`}
          >
            <button
              onClick={handleTradeNow}
              className="trade-button-dynamic oui-relative oui-px-8 oui-py-3 oui-rounded-full oui-border-none oui-text-white oui-font-bold oui-overflow-hidden oui-transition-all oui-duration-500 hover:oui-scale-105"
              style={{
                background:
                  "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
                cursor: "pointer",
              }}
            >
              <span className="oui-relative oui-z-20">Trade Now</span>
              <div className="shining-loop" />
            </button>

            {/* Read Docs 按鈕 - 只有在手機版顯眼，或依據您的需求保留 */}
            {/* <button 
              className="oui-px-8 oui-py-3 oui-rounded-full oui-border oui-border-black oui-bg-white/10 oui-backdrop-blur-md oui-text-black oui-font-bold"
            >
              Read Docs
            </button> */}
          </div>
        </div>
      </div>

      {/* 底部 Badge Section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          minHeight: "70px",
          background: "linear-gradient(90deg, #7053f3bb, #70c3b6bb, #d0f473bb)",
          backdropFilter: "blur(20px)",
          zIndex: 20,
          padding: "15px 20px",
          display: "grid",
          gridTemplateColumns: isLG ? "repeat(4, auto)" : "repeat(2, 1fr)",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="badge-container"
      >
        <Badge dotColor="#d9f132" text="NON-CUSTODIAL" isLG={isLG} />
        <Badge dotColor="#b8a7ff" text="ON-CHAIN SETTLEMENT" isLG={isLG} />
        <Badge dotColor="#97c9ff" text="PERMANENT DATA" isLG={isLG} />
        <Badge dotColor="#d9f132" text="TRANSPARENT RISK & FEES" isLG={isLG} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .trade-button-dynamic { animation: breathingGlow 3s infinite ease-in-out; }
          .trade-button-dynamic:hover .shining-loop { animation: moveShine 0.8s forwards; }
          .shining-loop {
            position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-25deg); z-index: 10;
          }
          @keyframes moveShine { 0% { left: -100%; } 100% { left: 150%; } }
          @keyframes breathingGlow {
            0%, 100% { box-shadow: 0 0 15px 2px rgba(112, 195, 182, 0.4); }
            50% { box-shadow: 0 0 25px 6px rgba(112, 195, 182, 0.6); }
          }
      `,
        }}
      />
    </section>
  );
};

// 底部小標籤組件
const Badge = ({
  dotColor,
  text,
  isLG,
}: {
  dotColor: string;
  text: string;
  isLG: boolean;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 12px",
      background: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      borderRadius: "100px",
      backdropFilter: "blur(8px)",
      height: "auto",
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: dotColor,
        borderRadius: "50%",
        boxShadow: `0 0 10px ${dotColor}`,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: isLG ? "12px" : "10px",
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
