import React from "react";
import { motion, Variants } from "framer-motion";

// 導入動畫組件與類型

export default function Diverse() {
  const logos = [
    { name: "woo", src: "/images/landingpage/woologo.png" },
    { name: "orderly", src: "/images/landingpage/orderlylogo.png" },
    { name: "jepun", src: "/images/landingpage/Jepunlogo.png" },
    { name: "kaggle", src: "/images/landingpage/kagglelogo.png" },
    { name: "tsmc", src: "/images/landingpage/tsmclogo.png" },
  ];

  // 複製一份以實現無縫輪播
  const displayLogos = [...logos, ...logos, ...logos];

  // 定義標題動畫
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="oui-bg-white"
      style={{
        padding: "140px 24px", // 上下 160px，左右保留基礎 padding
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div className="oui-flex oui-flex-col oui-items-center">
        {/* 標題區塊 */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} // 滾動到視野一半時觸發
          variants={titleVariants}
          style={{
            fontSize: "48px",
            fontWeight: "700",
            marginBottom: "88px",
            color: "#000",
            textAlign: "center",
          }}
        >
          Our diverse background
        </motion.h2>

        {/* 輪播軌道容器 */}
        <div
          className="oui-relative"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            padding: "0 40px",
            maxWidth: "1024px",
          }}
        >
          <div
            className="oui-flex oui-items-center"
            style={{
              width: "max-content",
              animation: "scrollLogos 30s linear infinite",
              display: "flex",
            }}
          >
            {displayLogos.map((logo, index) => (
              <div
                key={index}
                className="oui-flex oui-items-center oui-justify-center"
                style={{ padding: "0 60px" }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{
                    height: "70px",
                    width: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 定義無限輪播動畫 */}
      <style>{`
        @keyframes scrollLogos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </section>
  );
}
