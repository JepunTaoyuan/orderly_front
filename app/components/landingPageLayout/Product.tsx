import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Product() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      title: "Spot / Perpetual trading platform",
      icon: "/images/landingpage/icon1.png",
    },
    {
      title: "Non-custodial, on-chain settlement",
      icon: "/images/landingpage/icon2.png",
    },
    {
      title: "Core markets ETH, BTC, etc.",
      icon: "/images/landingpage/icon3.png",
    },
    {
      title: "Transparent fees & liquidation mechanics",
      icon: "/images/landingpage/icon4.png",
    },
    {
      title: "Designed for active traders",
      icon: "/images/landingpage/icon5.png",
    },
  ];

  return (
    <section
      className="oui-flex oui-flex-col oui-items-center"
      style={{
        padding: "80px 24px",
        backgroundImage: `url('/images/landingpage/productbg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* ================== 上層：標題 ================== */}
      <div
        className="oui-flex oui-flex-col oui-items-center oui-text-center oui-z-10"
        style={{ maxWidth: 800 }}
      >
        <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700 }}>
          Product
        </h2>
        <p
          style={{
            fontSize: "16px",
            opacity: 0.7,
            maxWidth: "650px",
            lineHeight: "1.6",
          }}
        >
          DEXLess is a non-custodial powerhouse where active traders master
          diverse markets—from crypto to gold—through transparent, on-chain
          execution.
        </p>
      </div>

      {/* ================== 中層：交易 UI ================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }} // 初始狀態：縮小到 0.85、半透明、稍微靠下
        whileInView={{ opacity: 1, scale: 1, y: 0 }} // 進入畫面：恢復原大、完全顯現、回到原位
        viewport={{ once: true, amount: 0.2 }} // 當 20% 的圖片進入視窗時觸發一次
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1], // 使用自定義的彈跳曲線 (Custom Bezier)，讓放大更有質感
          delay: 0.2, // 稍微延遲，等標題出來後它再放大
        }}
        className="oui-relative oui-w-full oui-mb-10"
        style={{ maxWidth: "1500px", zIndex: 5 }}
      >
        <img
          src="/images/landingpage/platformui.png"
          alt="Platform UI"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 16,
            boxShadow: "0 20px 80px rgba(0,0,0,0.6)", // 稍微加強陰影，配合放大更有深度感
          }}
        />
      </motion.div>

      {/* ================== 下層：RWD 同寬 Wrap 佈局 ================== */}
      <div
        className="oui-flex oui-flex-wrap oui-justify-center oui-w-full"
        style={{ maxWidth: 1240, gap: "20px" }}
      >
        {features.map((item, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="oui-transition-all oui-duration-500 oui-cursor-pointer"
              style={{
                /* RWD 寬度控制：確保換行後寬度依然相同 */
                flex: "0 0 auto",
                width: "calc(20% - 16px)", // 桌機預設 5 欄
                minWidth: "220px", // 防止過窄

                position: "relative",
                // Hover 時背景變亮並帶有綠色微光
                background: isHovered
                  ? "linear-gradient(180deg, rgba(196, 244, 93, 0.12) 0%, rgba(15, 15, 15, 0.9) 100%)"
                  : "rgba(255, 255, 255, 0.03)",
                borderRadius: 12,
                // Hover 時邊框變色
                border: isHovered
                  ? "1px solid #C4F45D"
                  : "1px solid rgba(255, 255, 255, 0.15)",
                padding: "48px 20px",
                textAlign: "center",
                backdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: isHovered
                  ? "translateY(-8px) scale(1.02)"
                  : "translateY(0) scale(1)",
                boxShadow: isHovered
                  ? "0 10px 30px rgba(196, 244, 93, 0.2)"
                  : "none",
                zIndex: isHovered ? 20 : 1,
              }}
            >
              {/* Hover 時顯現的頂部發光線條 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isHovered ? "70%" : "0%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, #C4F45D, transparent)",
                  transition: "width 0.4s ease-in-out",
                }}
              />

              {/* Icon 容器 */}
              <div
                style={{
                  marginBottom: 32,
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.icon}
                  alt="icon"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    filter: isHovered
                      ? "drop-shadow(0 0 8px rgba(196, 244, 93, 0.5))"
                      : "none",
                    transition: "filter 0.3s ease",
                  }}
                />
              </div>

              {/* 文字標題 */}
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  color: isHovered ? "#fff" : "#ccc",
                  maxWidth: "180px",
                  transition: "color 0.3s ease",
                }}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
