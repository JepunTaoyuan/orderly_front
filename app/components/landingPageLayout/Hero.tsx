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
        minHeight: "calc(100vh - 48px)",
        display: "block",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/landingpage/landingImage.jpg"
        className="oui-absolute oui-top-0 oui-left-0 oui-w-full oui-h-full"
        style={{
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/images/landingpage/motion_2.mp4" type="video/mp4" />
      </video>
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
              className="trade-button-dynamic oui-relative oui-px-10 oui-py-3 oui-rounded-full oui-border-none oui-text-white oui-font-bold oui-overflow-hidden oui-transition-all oui-duration-500 hover:oui-scale-105"
              style={{
                background:
                  "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
                cursor: "pointer",
              }}
            >
              <span className="oui-relative oui-z-20">Trading Now</span>

              {/* 白光層：平常藏在左邊 */}
              <div className="shining-loop" />

              <style
                dangerouslySetInnerHTML={{
                  __html: `
                .trade-button-dynamic {
                  /* 持續呼吸發光 */
                  animation: breathingGlow 3s infinite ease-in-out;
                }

                /* 關鍵：只有在按鈕被 hover 時，內部的 shining-loop 才執行動畫 */
                .trade-button-dynamic:hover .shining-loop {
                  animation: moveShine 0.8s forwards; 
                }

                .shining-loop {
                  position: absolute;
                  top: 0;
                  left: -100%; /* 初始位置：藏在左邊 */
                  width: 50%;
                  height: 100%;
                  background: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.6) 50%,
                    rgba(255, 255, 255, 0) 100%
                  );
                  transform: skewX(-25deg);
                  z-index: 10;
                }

                /* 白光掃過的動畫：從左邊跑向右邊 */
                @keyframes moveShine {
                  0% {
                    left: -100%;
                  }
                  100% {
                    left: 150%;
                  }
                }

                @keyframes breathingGlow {
                  0%, 100% {
                    box-shadow: 0 0 15px 2px rgba(112, 195, 182, 0.4), 
                                0 0 30px 5px rgba(208, 244, 115, 0.2);
                  }
                  50% {
                    box-shadow: 0 0 25px 6px rgba(112, 195, 182, 0.6), 
                                0 0 50px 10px rgba(208, 244, 115, 0.4);
                  }
                }
              `,
                }}
              />
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
          backdropFilter: "blur(20px)",
          zIndex: 20,
          padding: "15px 20px",

          // 使用 Grid 佈局
          display: "grid",
          // 預設 (手機版 SM): 兩列，寬度平分
          gridTemplateColumns: "repeat(2, 1fr)",
          // 間距
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
        // 透過 className 搭配外部 CSS 或是在內聯 style 使用 window.innerWidth 判斷
        className="badge-container"
      >
        <Badge dotColor="#d9f132" text="NON-CUSTODIAL" isLG={isLG} />
        <Badge dotColor="#b8a7ff" text="ON-CHAIN SETTLEMENT" isLG={isLG} />
        <Badge dotColor="#97c9ff" text="PERMANENT DATA" isLG={isLG} />
        <Badge dotColor="#d9f132" text="TRANSPARENT RISK & FEES" isLG={isLG} />

        {/* 增加一段簡單的 style 標籤來處理響應式 (LG 變回一排) */}
        <style>{`
          @media (min-width: 1024px) {
            .badge-container {
              grid-template-columns: repeat(4, auto) !important;
              justify-content: center !important;
            }
          }
        `}</style>
      </div>
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
