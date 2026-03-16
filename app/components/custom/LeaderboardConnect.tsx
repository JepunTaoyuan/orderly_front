import React from "react";

// 1. 定義 Props 的介面 (Interface)
interface LeaderboardConnectProps {
  onConnect: () => void; // 表示這是一個不接收參數且不回傳值的函數
}

const LeaderboardConnect = ({ onConnect }: LeaderboardConnectProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px", // 可根據父容器調整
        backgroundColor: "transparent",
      }}
    >
      {/* 外層漸層邊框容器 */}
      <div
        style={{
          padding: "1px", // 邊框寬度
          borderRadius: "24px",
          background:
            "linear-gradient(135deg, #7053F3 0%, rgba(255, 255, 255, 0.1) 50%, #CDEB78 100%)",
          display: "inline-flex",
        }}
      >
        {/* 內層主體內容 */}
        <div
          style={{
            padding: "24px",
            width: "380px", // 根據圖片比例調整寬度
            background: "rgba(13, 14, 18, 0.9)", // 深色背景
            backdropFilter: "blur(10px)",
            borderRadius: "23px", // 略小於外層圓角
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* 上方圖片 */}
          <div
            style={{
              width: "100%",
              height: "220px",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#1a1b23",
            }}
          >
            <img
              src="/images/leaderboard/leaderboardconnect.png"
              alt="Points Season"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* 文字區塊 */}
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                margin: "0 0 12px 0",
                color: "#FFFFFF",
                fontSize: "24px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              Points season is coming.
            </h2>
            <p
              style={{
                margin: 0,
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "15px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "400",
              }}
            >
              Connect your wallet to begin.
            </p>
          </div>

          {/* Connect Wallet 按鈕 */}
          <button
            onClick={onConnect}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #7053F3 0%, #78CBC1 45%, #CDEB78 96%)",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Connect wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardConnect;
