import React from "react";
import { useMarketsStream } from "@orderly.network/hooks";
import { Flex } from "@orderly.network/ui";

export default function Markets() {
  // 使用 Orderly 的 hook 獲取實時市場數據
  const { data: markets } = useMarketsStream();

  // 過濾出 BTC 和 ETH 的數據
  const marketData = React.useMemo(() => {
    if (!markets) return [];

    return markets
      .filter(
        (market) =>
          market.symbol === "PERP_BTC_USDC" ||
          market.symbol === "PERP_ETH_USDC",
      )
      .map((market) => ({
        symbol: market.symbol.includes("BTC") ? "BTC" : "ETH",
        pair: market.symbol.includes("BTC") ? "BTC-PERP" : "ETH-PERP",
        price: `$${market["24h_close"]?.toFixed(2) || "0.00"}`,
        change: `${(market.change * 100).toFixed(2)}%`,
        tag: market.symbol.includes("BTC") ? "BITCOIN" : "ETHEREUM",
      }));
  }, [markets]);
  //     const marketData = [
  //     {
  //       symbol: 'BTC',
  //       pair: 'BTC-PERP',
  //       price: '$56,623.54',
  //       change: '1.41%',
  //       tag: 'BITCOIN',
  //     },
  //     {
  //       symbol: 'ETH',
  //       pair: 'ETH-PERP',
  //       price: '$4,267.90',
  //       change: '2.22%',
  //       tag: 'ETHEREUM',
  //     },
  //   ];
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
        <p className="oui-text-6xl">Markets</p>
        <p className="oui-text-2xl oui-py-4">Perpetual Markets Available</p>
        <button
          className="oui-px-10 oui-py-3 oui-rounded-full oui-border oui-text-white"
          style={{
            background:
              "linear-gradient(90deg, #7053f3, #70c3b6 44.8%, #d0f473 78.01%)",
          }}
        >
          View Markets
        </button>
        <Flex gap={6} style={{ paddingTop: "64px", paddingBottom: "64px" }}>
          {marketData.map((market) => (
            <div
              key={market.pair}
              className="oui-flex oui-flex-col oui-items-center"
            >
              {/* 市場標題 */}
              <p className="oui-mb-4 oui-font-bold oui-text-lg oui-tracking-widest">
                {market.pair}
              </p>

              {/* 卡片本體 */}
              <div
                className="oui-bg-white oui-rounded-xl oui-p-8 oui-text-left oui-relative"
                style={{
                  width: "280px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                  border: "1px solid #f0f0f0",
                }}
              >
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

                <div className="oui-flex oui-justify-between oui-items-end">
                  <div>
                    <p className="oui-text-4xl oui-font-bold oui-mb-4">
                      {market.price}
                    </p>
                    <span className="oui-px-4 oui-py-1 oui-bg-gray-100 oui-rounded-lg oui-border oui-border-gray-200 oui-text-sm">
                      {market.change}
                    </span>
                  </div>

                  {/* 模擬 Sparkline 曲線圖 */}
                  <div className="oui-w-24">
                    <svg viewBox="0 0 100 40" fill="none">
                      <path
                        d="M0 30 Q 15 10, 30 25 T 60 15 T 100 20"
                        stroke="#ccc"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Flex>
        <div className="oui-mt-16 oui-flex oui-items-center oui-justify-center oui-gap-2 oui-cursor-pointer hover:oui-opacity-70">
          <p className="oui-text-xl">More markets coming</p>
          <span className="oui-text-2xl">→</span>
        </div>
      </div>
    </section>
  );
}
