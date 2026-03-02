import React, { useEffect } from "react";
import { motion, Variants } from "framer-motion";

const FEATURES = [
  {
    title: "Data Ownership by Traders",
    desc: "Users retain access to their full trading history — not limited by platform policies.",
    color: "#d4f7a3", // 下半部實色
    // 修正：使用線性漸層，模擬從左上往右下的虹彩光感
    bgColor:
      "linear-gradient(212deg, rgba(255, 255, 255, 0.08) 0%, rgba(236.61, 236.61, 236.61, 0.22) 17%, rgba(186, 247, 120, 0.40) 36%, rgba(155, 241, 189, 0.40) 60%, rgba(230.48, 230.48, 230.48, 0.28) 86%, rgba(231.71, 231.71, 231.71, 0.16) 100%)",
    url: "/images/landingpage/trader.png",
  },
  {
    title: "Designed for Financial Intelligence",
    desc: "DEXless is built with the belief that future trading is driven by data, intelligence, and iteration.",
    color: "#c2f3e8",
    bgColor:
      "linear-gradient(212deg, rgba(255, 255, 255, 0.08) 0%, rgba(236.61, 236.61, 236.61, 0.22) 17%, rgba(162, 255, 229, 0.40) 36%, rgba(162, 210.05, 255, 0.40) 60%, rgba(230.48, 230.48, 230.48, 0.28) 86%, rgba(231.71, 231.71, 231.71, 0.16) 100%)",
    url: "/images/landingpage/bot.png",
  },
  {
    title: "Seamless Trading Experience",
    desc: "DEXless removes unnecessary friction so traders can focus purely on decision-making.",
    color: "#c7e3ff",
    bgColor:
      "linear-gradient(212deg, rgba(255, 255, 255, 0.08) 0%, rgba(236.61, 236.61, 236.61, 0.22) 17%, rgba(145.89, 202.77, 255, 0.40) 36%, rgba(158.15, 192.05, 255, 0.40) 60%, rgba(230.48, 230.48, 230.48, 0.28) 86%, rgba(231.71, 231.71, 231.71, 0.16) 100%)",
    url: "/images/landingpage/seamless.png",
  },
  {
    title: "Permanent Trading History",
    desc: "Every trade is recorded on-chain, enabling long-term analysis, backtesting, and learning.",
    color: "#e0d7ff",
    bgColor:
      "linear-gradient(212deg, rgba(255, 255, 255, 0.08) 0%, rgba(236.61, 236.61, 236.61, 0.22) 17%, rgba(156.17, 147.12, 255, 0.40) 36%, rgba(144.87, 134.86, 255, 0.40) 60%, rgba(230.48, 230.48, 230.48, 0.28) 86%, rgba(231.71, 231.71, 231.71, 0.16) 100%)",
    url: "/images/landingpage/history.png",
  },
];

export default function WhyDexless() {
  // 1. 父容器動畫配置：控制子元素交錯出現
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // 3. 為 cardVariants 加上 Variants 型別標註
  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut", // 現在 TypeScript 就會知道這個字串是合法的了
      },
    },
  };

  return (
    <section
      className="relative oui-bg-cover oui-bg-center oui-text-black oui-flex oui-justify-center"
      style={{
        backgroundImage: "url('/images/landingpage/dexlessImage.png')",
        paddingTop: "50px",
        paddingBottom: "50px",
        minHeight: "100vh",
      }}
    >
      <div>
        {/* 標題區：淡入動畫 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.3 }}
          className="oui-space-y-4 oui-flex oui-flex-col oui-items-center oui-text-center"
          style={{ paddingTop: "120px", paddingBottom: "120px" }}
        >
          {/* 標題：從上方滑入 */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="oui-text-6xl"
          >
            Why Dexless?
          </motion.h2>

          {/* 描述文字：從下方慢慢浮現 */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="oui-text-2xl"
            style={{ maxWidth: "650px", fontWeight: "400", color: "#666" }}
          >
            Trading platforms shouldn’t just execute trades — they should help
            traders understand, improve, and evolve.
          </motion.p>
        </motion.div>

        {/* 卡片區：交錯出現動畫 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // 進入畫面 10% 就觸發
          className="oui-grid oui-gap-8 oui-grid-cols-1 sm:oui-grid-cols-2 lg:oui-grid-cols-2"
          style={{ justifyItems: "center" }}
        >
          {FEATURES.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }} // 滑鼠移入上浮
              style={{
                borderRadius: "32px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "480px",
                width: "350px",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                backgroundColor: "#fff", // 確保卡片有底色
                cursor: "pointer",
              }}
            >
              {/* 上半部：放置 3D 圖片 */}
              <div
                style={{
                  flex: 1.2,
                  background: item.bgColor,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <motion.img
                  // 圖片可以加一點微弱的呼吸感
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  src={item.url}
                  alt={item.title}
                  style={{
                    width: "188px",
                    height: "250px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
                  }}
                />
              </div>

              {/* 下半部：內容區 */}
              <div
                style={{
                  padding: "24px",
                  backgroundColor: item.color,
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    lineHeight: "1.3",
                    marginBottom: "12px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(0,0,0,0.6)",
                    lineHeight: "1.5",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
