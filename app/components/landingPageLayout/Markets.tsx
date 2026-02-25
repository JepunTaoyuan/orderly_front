import React from "react";
import { useNavigate } from "@remix-run/react";
import { motion, Variants } from "framer-motion";
import { useMarketsStream } from "@orderly.network/hooks";
import { generatePath } from "@orderly.network/i18n";
import { Flex, useScreen } from "@orderly.network/ui";

// 引入 framer-motion

export default function Markets() {
  const navigate = useNavigate();
  const { isMobile } = useScreen();

  const handleTradeNow = () => {
    navigate(generatePath({ path: "/markets" }));
  };

  const { data: markets } = useMarketsStream();

  const marketData = React.useMemo(() => {
    if (!markets) return [];
    const desiredOrder = ["PERP_BTC_USDC", "PERP_XAU_USDC", "PERP_XAG_USDC"];

    return desiredOrder
      .filter((symbol) => markets.some((market) => market.symbol === symbol))
      .map((symbol) => {
        const market = markets.find((m) => m.symbol === symbol)!;
        const isBTC = market.symbol.includes("BTC");
        const isXAU = market.symbol.includes("XAU");
        const isXAG = market.symbol.includes("XAG");

        return {
          symbol: isBTC ? "BTC" : isXAU ? "XAU" : "XAG",
          pair: isBTC ? "BTC-PERP" : isXAU ? "XAU-PERP" : "XAG-PERP",
          price: market["24h_close"]
            ? `$${market["24h_close"].toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "$0.00",
          change: `${(market.change * 100).toFixed(2)}%`,
          tag: isBTC ? "BITCOIN" : isXAU ? "GOLD" : "SILVER",
        };
      });
  }, [markets]);

  // 定義動畫變體：單純的淡入與輕微位移
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // 容器動畫：讓子元素（卡片）有交錯出現的感覺
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 每張卡片間隔 0.2 秒
      },
    },
  };

  return (
    <section
      className="relative oui-bg-white oui-text-black oui-flex oui-justify-center oui-text-center"
      style={{
        paddingTop: "120px",
        paddingBottom: "120px",
        minHeight: "835px",
        backgroundImage: "url('/images/landingpage/markets.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="oui-w-full oui-max-w-[1200px] oui-px-4">
        {/* 標題與 CTA 區：滾動觸發淡入 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <p className="oui-text-6xl oui-font-bold">Markets</p>
          <p
            className="oui-text-2xl oui-py-4 oui-font-medium"
            style={{ color: "#666" }}
          >
            Trade Everything. Spot & Perpetual Markets
          </p>

          <button
            onClick={handleTradeNow}
            className="oui-px-8 oui-py-3 oui-rounded-full oui-text-white oui-font-bold oui-transition-transform hover:oui-scale-105"
            style={{
              background:
                "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
            }}
          >
            View Markets
          </button>
        </motion.div>

        {/* 市場卡片區：使用 Stagger 效果讓卡片依序淡入 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            justify="center"
            style={{ paddingTop: "64px", paddingBottom: "64px", gap: "24px" }}
          >
            {marketData.map((market) => (
              <motion.div
                key={market.pair}
                variants={fadeInUp} // 繼承父容器的 staggered 觸發
                className="oui-flex oui-flex-col oui-items-center"
              >
                {/* 市場標題 */}
                <p className="oui-mb-6 oui-font-bold oui-text-xl oui-tracking-tight">
                  {market.pair}
                </p>

                {/* 卡片本體 */}
                <div
                  className="oui-bg-white oui-rounded-2xl oui-p-8 oui-text-left oui-relative"
                  style={{
                    width: "320px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                    border: "3px solid #EAEAEA",
                  }}
                >
                  <div className="oui-flex oui-items-center oui-justify-between oui-mb-4">
                    <div className="oui-flex oui-items-center oui-gap-5">
                      <span className="oui-text-2xl oui-font-bold">
                        {market.symbol}
                      </span>
                      <span
                        className="oui-text-[12px] oui-font-bold oui-text-white oui-px-3 oui-py-1 oui-rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
                        }}
                      >
                        RWA
                      </span>
                    </div>
                  </div>

                  <p className="oui-text-4xl oui-font-bold oui-mb-8">
                    {market.price}
                  </p>

                  <div className="oui-flex oui-justify-between oui-items-center">
                    <div
                      className="oui-px-4 oui-py-1.5 oui-font-bold oui-text-sm"
                      style={{
                        position: "relative",
                        borderRadius: "100px",
                        backgroundImage:
                          "linear-gradient(#fff, #fff), linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        border: "3px solid transparent",
                        display: "inline-block",
                      }}
                    >
                      {market.change}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Flex>
        </motion.div>

        {/* Footer Hint：最後單獨淡入 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={handleTradeNow}
          className="oui-mt-8 oui-flex oui-items-center oui-justify-center oui-gap-2 oui-cursor-pointer hover:oui-opacity-70"
        >
          <p className="oui-text-xl oui-font-medium">More markets coming</p>
          <span className="oui-text-2xl">→</span>
        </motion.div>
      </div>
    </section>
  );
}
