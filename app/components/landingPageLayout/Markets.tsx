import React from "react";
import { useNavigate } from "@remix-run/react";
import { useMarketsStream } from "@orderly.network/hooks";
import { generatePath } from "@orderly.network/i18n";
import { Flex, useScreen } from "@orderly.network/ui";

export default function Markets() {
  const navigate = useNavigate();
  const handleTradeNow = () => {
    navigate(generatePath({ path: "/markets" }));
  };
  const { isMobile } = useScreen();
  /**
   * 取得 Orderly 即時市場資
   */
  const { data: markets } = useMarketsStream();

  /**
   *  將原始市場資料轉換為 Landing Page 使用的格式
   * - 只顯示 BTC / ETH
   */

  const marketData = React.useMemo(() => {
    if (!markets) return [];

    // 定義想要的順序
    const desiredOrder = ["PERP_BTC_USDC", "PERP_ETH_USDC"];

    return desiredOrder
      .filter((symbol) => markets.some((market) => market.symbol === symbol))
      .map((symbol) => {
        const market = markets.find((m) => m.symbol === symbol);
        const isBTC = market.symbol.includes("BTC");

        return {
          symbol: isBTC ? "BTC" : "ETH",
          pair: isBTC ? "BTC-PERP" : "ETH-PERP",
          price: market["24h_close"]
            ? `$${market["24h_close"].toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "$0.00",
          change: `${(market.change * 100).toFixed(2)}%`,
          tag: isBTC ? "BITCOIN" : "ETHEREUM",
        };
      });
  }, [markets]);

  return (
    <section
      className="relative oui-bg-cover oui-bg-center oui-text-black oui-flex oui-justify-center oui-text-center"
      style={{
        backgroundImage: "url('/images/landingpage/markets.png')",
        paddingTop: "120px",
        paddingBottom: "120px",
        minHeight: "835px",
      }}
    >
      <div>
        {/* 標題區 */}
        <p className="oui-text-6xl">Markets</p>
        <p className="oui-text-2xl oui-py-4" style={{ color: "#666" }}>
          Perpetual Markets Available
        </p>

        {/* CTA */}
        <button
          onClick={handleTradeNow}
          className="oui-px-6 oui-py-2 oui-rounded-full oui-border oui-text-white"
          style={{
            background:
              "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
          }}
        >
          View Markets
        </button>

        {/* 市場卡片區 */}
        <Flex
          gap={6}
          direction={isMobile ? "column" : "row"}
          style={{ paddingTop: "64px", paddingBottom: "64px" }}
        >
          {marketData.map((market) => (
            <div
              key={market.pair}
              className="oui-flex oui-flex-col oui-items-center"
            >
              {/* 市場標題 */}
              <p className="oui-mb-4 oui-font-bold oui-text-lg oui-tracking-widest">
                {market.pair}
              </p>

              {/* 卡片 */}
              <div
                className="oui-bg-white oui-rounded-xl oui-p-8 oui-text-left oui-relative"
                style={{
                  width: "280px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                  border: "1px solid #f0f0f0",
                }}
              >
                {/* 幣種標題 */}
                <div className="oui-flex oui-items-center oui-gap-2 oui-mb-2">
                  <span className="oui-text-2xl oui-font-bold">
                    {market.symbol}
                  </span>
                  <span
                    className="oui-text-[10px] oui-text-white oui-px-3 oui-py-1 oui-rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #7b61ff, #b4e391)",
                    }}
                  >
                    {market.tag}
                  </span>
                </div>

                {/* 價格與漲跌 */}
                <div className="oui-flex oui-justify-between oui-items-end">
                  <div>
                    <p className="oui-text-4xl oui-font-bold oui-mb-4">
                      {market.price}
                    </p>
                    <span className="oui-px-4 oui-py-1 oui-bg-gray-100 oui-rounded-lg oui-border oui-border-gray-200 oui-text-sm">
                      {market.change}
                    </span>
                  </div>

                  {/* 價格走勢 */}
                  {/* <div className="oui-w-24">
                    <svg viewBox="0 0 100 40" fill="none">
                      <path
                        d="M0 30 Q 15 10, 30 25 T 60 15 T 100 20"
                        stroke="#ccc"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </Flex>

        {/* Footer Hint */}
        <div className="oui-mt-16 oui-flex oui-items-center oui-justify-center oui-gap-2 oui-cursor-pointer hover:oui-opacity-70">
          <p className="oui-text-xl">More markets coming</p>
          <span className="oui-text-2xl">→</span>
        </div>
      </div>
    </section>
  );
}
