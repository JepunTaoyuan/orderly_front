import React from "react";
import { useMediaQuery } from "@orderly.network/hooks";

export default function RiskDisclosure() {
  // 只保留 LG 斷點判斷 (1024px)
  const isLG = useMediaQuery("(max-width: 1024px)");

  return (
    <section
      className="oui-bg-white oui-text-black oui-flex oui-flex-col oui-items-center"
      style={{
        paddingTop: isLG ? "60px" : "120px",
        paddingBottom: isLG ? "60px" : "120px",
        // 手機版縮小外部間距
        paddingLeft: isLG ? "20px" : "40px",
        paddingRight: isLG ? "20px" : "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          height: isLG ? "auto" : "380px",
          position: "relative",
          margin: "0 auto",
          borderRadius: "32px",
          // RWD 漸層方向：手機版垂直，電腦版橫向
          background: isLG
            ? "linear-gradient(180deg, #5B47D1 0%, #6891D1 50%, #C8F27A 100%)"
            : "linear-gradient(90deg, #5B47D1 0%, #6891D1 50%, #C8F27A 100%)",
          // 手機版隱藏溢出避免星星撐寬網頁，電腦版 visible 讓手掌立體
          overflow: isLG ? "hidden" : "visible",
          display: "flex",
          flexDirection: isLG ? "column" : "row",
          alignItems: isLG ? "flex-start" : "center",
          padding: isLG ? "48px 32px" : "0 0 0 64px",
        }}
      >
        {/* 左側文字內容 */}
        <div
          style={{
            maxWidth: isLG ? "100%" : "550px",
            position: "relative",
            zIndex: 5,
            color: "white",
            marginBottom: isLG ? "40px" : "0",
          }}
        >
          <h3
            style={{
              fontSize: isLG ? "28px" : "36px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            Risk Disclosure
          </h3>
          <p
            style={{
              fontSize: isLG ? "18px" : "20px",
              fontWeight: "200",
              lineHeight: "1.6",
            }}
          >
            Perpetual trading involves leverage and liquidation risk. Users
            should understand the mechanics before trading.
          </p>
        </div>

        {/* 裝飾性星星 RWD */}
        <img
          src="/images/landingpage/leftstar.png"
          alt="star"
          style={{
            position: "absolute",
            // 電腦版在中間 top，LG版移動到右側當背景裝飾
            left: isLG ? "auto" : "45%",
            right: isLG ? "35%" : "auto",
            top: isLG ? "40%" : "-60px",
            width: isLG ? "140px" : "220px",
            zIndex: 1,
            pointerEvents: "none",
            opacity: isLG ? 0.7 : 1,
          }}
        />

        {/* 右下角小星星 RWD */}
        <img
          src="/images/landingpage/rightstar.png"
          alt="star"
          style={{
            position: "absolute",
            right: isLG ? "15px" : "40px",
            bottom: "0px",
            width: isLG ? "120px" : "200px",
            zIndex: 3,
          }}
        />

        {/* 手掌圖片 RWD */}
        <img
          src="/images/landingpage/hand.png"
          alt="Risk Disclosure Hand"
          style={{
            position: isLG ? "relative" : "absolute",
            right: isLG ? "60px" : "-20px",
            top: isLG ? "48px" : "-80px",
            alignSelf: isLG ? "flex-end" : "auto",
            height: isLG ? "200px" : "460px",
            zIndex: 2,
            objectFit: "contain",
            filter: "drop-shadow(-20px 20px 40px rgba(0,0,0,0.15))",
            marginTop: isLG ? "10px" : "0",
          }}
        />
      </div>
    </section>
  );
}
