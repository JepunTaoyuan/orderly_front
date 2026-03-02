import React from "react";
import { motion, Variants } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Connect your wallet",
      icon: "/images/landingpage/step1.png",
    },
    {
      id: "02",
      title: "Deposit collateral",
      icon: "/images/landingpage/step2.png",
    },
    {
      id: "03",
      title: "Choose a perpetual market",
      icon: "/images/landingpage/step3.png",
    },
    {
      id: "04",
      title: "Set leverage and risk parameters",
      icon: "/images/landingpage/step4.png",
    },
    {
      id: "05",
      title: "Trade and manage positions with full transparency",
      icon: "/images/landingpage/step5.png",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 每個步驟間隔 0.2 秒依序出現
      },
    },
  };

  // 修改這裡：由上往下出現的關鍵是 y 的位移
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20, // 初始位置在上方 20px
      x: -10, // 稍微帶點左側滑入感更生動
    },
    visible: {
      opacity: 1,
      y: 0, // 回到原位
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="oui-bg-white oui-text-black oui-flex oui-flex-col oui-items-center"
      style={{ padding: "80px 24px", overflow: "hidden" }}
    >
      {/* 標題部分 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="oui-text-center oui-mb-12 lg:oui-mb-20"
      >
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 40px)",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          How It Works
        </h2>
        <p style={{ fontSize: "16px", color: "#666" }}>Simple 5 Step Flow</p>
      </motion.div>

      <div
        className="oui-flex oui-flex-col-reverse lg:oui-flex-row oui-gap-12 lg:oui-gap-20 oui-items-center"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        {/* 左側 Steps */}
        <div className="oui-relative oui-w-full lg:oui-w-1/2">
          {/* 背景虛線：加上高度成長動畫，模擬由上往下的路徑感 */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "calc(100% - 40px)", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="oui-absolute"
            style={{
              left: "81px",
              top: "20px",
              borderLeft: "2px dashed #E5E7EB",
              zIndex: 0,
            }}
          />

          {/* 步驟容器 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="oui-flex oui-flex-col oui-gap-10 md:oui-gap-12"
            style={{ paddingLeft: "60px", paddingRight: "60px" }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants} // 繼承父層的延遲邏輯
                className="oui-flex oui-items-center oui-relative"
                style={{ zIndex: 1 }}
              >
                {/* Step Icon */}
                <div
                  className="oui-flex-shrink-0 oui-flex oui-items-center oui-justify-center"
                  style={{
                    width: "42px",
                    height: "42px",
                    marginRight: "24px",
                    background: "white",
                    position: "relative",
                  }}
                >
                  <img
                    src={step.icon}
                    alt={step.id}
                    className="oui-w-full oui-h-full oui-object-contain"
                  />
                </div>

                {/* Step Title */}
                <div
                  style={{
                    fontSize: "clamp(16px, 2vw, 19px)",
                    fontWeight: "600",
                    color: "#111",
                    lineHeight: "1.4",
                  }}
                >
                  {step.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 右側大圖 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="oui-w-full lg:oui-w-1/2 oui-flex oui-justify-center oui-items-center"
        >
          <img
            src="/images/landingpage/howitwork.png"
            alt="Main illustration"
            style={{
              width: "100%",
              maxWidth: "520px",
              height: "auto",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
