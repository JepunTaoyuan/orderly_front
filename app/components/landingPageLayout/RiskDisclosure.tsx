import React from "react";
import { motion, Variants } from "framer-motion";
import { useMediaQuery } from "@orderly.network/hooks";

// 引入動畫庫

export default function RiskDisclosure() {
  const isMobile = useMediaQuery("(max-width: 998px)");

  // 定義左側內容的動畫 (由左往右淡入)
  const contentVariants: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // 定義右側手掌的動畫 (由下往上浮現)
  const handVariants: Variants = {
    hidden: { opacity: 0, y: 100, x: isMobile ? "-40%" : "0" },
    visible: {
      opacity: 1,
      y: 0,
      x: isMobile ? "-40%" : "0", // 保持手機版的水平置中偏移
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }, // 稍微延遲並使用彈性曲線
    },
  };

  // 星星動畫 (縮放淡入)
  const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.4 },
    },
  };

  return (
    <section
      className="oui-bg-white"
      style={{
        padding: isMobile ? "60px 20px" : "100px 40px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          width: "100%",
          maxWidth: "1200px",
          height: isMobile ? "auto" : "360px",
          position: "relative",
          borderRadius: "24px",
          background:
            "linear-gradient(90deg, #E6FA95 0%, #8FEBC2 33%, #9A94FF 66%, #635BFF 100%)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          padding: isMobile ? "40px 24px 0" : "0 60px",
          overflow: isMobile ? "hidden" : "visible",
        }}
      >
        {/* 左側內容區 */}
        <motion.div
          variants={contentVariants}
          style={{
            maxWidth: isMobile ? "100%" : "450px",
            position: "relative",
            zIndex: 10,
            textAlign: "left",
            marginBottom: isMobile ? "32px" : "0",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "32px",
              fontWeight: "800",
              color: "#000",
              marginBottom: "16px",
              lineHeight: "1.2",
              letterSpacing: "-0.5px",
            }}
          >
            Your Assets, Your Rules.
            <br />
            No Exceptions.
          </h2>

          <p
            style={{
              fontSize: isMobile ? "14px" : "15px",
              color: "#111",
              fontWeight: "400",
              lineHeight: "1.5",
              marginBottom: "28px",
              opacity: 0.9,
            }}
          >
            Connect to Dexless and execute peer-to-peer transactions without
            ever giving up your private keys. Experience a protocol where
            security isn’t a promise—it’s written in the code.
          </p>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid #000",
              borderRadius: "100px",
              padding: "10px 24px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#000",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(4px)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.29424 6.75718L15.1159 0H13.7365L8.68114 5.87625L4.64448 0H0L6.10543 8.8854L0 16H1.37947L6.71805 9.76634L11.0053 16H15.6498L9.29391 6.75718H9.29424ZM7.41908 8.9507L6.80058 8.06606L1.87693 0.992648H4.00414L7.96783 6.64951L8.58633 7.53415L13.7371 14.8967H11.6099L7.41908 8.95103V8.9507Z" />
            </svg>
            Connect Us
          </button>
        </motion.div>

        {/* 裝飾星星 1 */}
        <motion.img
          variants={starVariants}
          src="/images/landingpage/leftstar.png"
          alt="deco"
          style={{
            position: "absolute",
            left: isMobile ? "80%" : "48%",
            top: isMobile ? "45%" : "30%",
            width: isMobile ? "60px" : "100px",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* 右下角點綴星星 2 */}
        <motion.img
          variants={starVariants}
          src="/images/landingpage/rightstar.png"
          alt="deco"
          style={{
            position: "absolute",
            right: isMobile ? "5%" : "8%",
            bottom: isMobile ? "5%" : "10%",
            width: isMobile ? "80px" : "130px",
            zIndex: 6,
            pointerEvents: "none",
          }}
        />

        {/* 右側主視覺：手掌與盾牌 */}
        <motion.img
          variants={handVariants}
          src="/images/landingpage/hand.png"
          alt="Security Hand"
          style={{
            position: isMobile ? "relative" : "absolute",
            right: isMobile ? "auto" : "-10px",
            bottom: "0px",
            left: isMobile ? "50%" : "auto",
            height: isMobile ? "320px" : "440px",
            zIndex: 5,
            objectFit: "contain",
            filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.1))",
          }}
        />
      </motion.div>
    </section>
  );
}
