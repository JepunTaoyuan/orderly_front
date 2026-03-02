import React from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useScaffoldContext } from "@orderly.network/ui-scaffold";

export default function LandingPageFooter() {
  const { routerAdapter } = useScaffoldContext();
  // 精確設定 768px 斷點
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navLinks = [
    { name: "Docs", href: "#" },
    { name: "Security", href: "#" },
    { name: "Risk Disclosure", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Privacy", href: "#" },
  ];

  return (
    <footer
      className="oui-flex oui-flex-col"
      style={{
        backgroundColor: "#000",
        padding: isMobile ? "40px 24px" : "100px 0 60px",
        width: "100%",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
        // 768px 以上保持置中，以下則改為靠左
        alignItems: isMobile ? "flex-start" : "center",
      }}
    >
      {/* ================== 上層：Logo 與 Trade Now 按鈕 ================== */}
      <div
        className="oui-flex"
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "1100px",
          // 768px 以上是垂直堆疊置中，以下改為水平分置兩端
          flexDirection: isMobile ? "row" : "column",
          justifyContent: isMobile ? "space-between" : "center",
          alignItems: "center",
          marginBottom: isMobile ? "40px" : "60px",
        }}
      >
        <div style={{ marginBottom: isMobile ? "0" : "32px" }}>
          <svg
            width={isMobile ? "120" : "160"}
            height="32"
            viewBox="0 0 114 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0156 1.5127C13.7304 2.78937 14.6112 4.8548 14.6113 7.63574C14.6113 12.5884 11.817 15.2724 6.49707 15.2725H0V12.8281L12.0156 1.5127ZM95.1201 0.899414C98.2365 0.899483 100.11 2.26785 100.11 4.2168H98.8682C98.7629 2.86749 97.4781 1.89258 95.0986 1.89258C92.7192 1.89263 91.5615 2.88632 91.5615 4.31055C91.5616 5.60354 92.5509 6.42813 94.5303 6.78418L96.4043 7.12109C99.0786 7.62708 100.574 8.58328 100.574 10.626C100.574 12.9497 98.6155 14.374 95.3096 14.374C91.7508 14.374 89.792 12.7248 89.792 10.5322H91.0771C91.1825 12.2375 92.5718 13.3808 95.3301 13.3809C97.8781 13.3809 99.2471 12.3122 99.2471 10.6631C99.2469 9.10796 98.089 8.39611 96.0469 8.04004L94.1719 7.70215C91.54 7.2336 90.2344 6.09069 90.2344 4.31055C90.2344 2.26785 91.9404 0.899414 95.1201 0.899414ZM108.715 0.899414C111.894 0.899491 113.537 2.28692 113.537 4.08594H112.674C112.569 2.77416 111.473 1.63093 108.715 1.63086C106.019 1.63086 104.861 2.71757 104.861 4.2168C104.861 5.54724 105.787 6.44707 108.104 6.85938L109.999 7.19629C112.231 7.58984 114 8.47107 114 10.7012C114 12.8936 112.252 14.374 108.841 14.374C105.219 14.374 103.514 12.6872 103.514 10.6445H104.377C104.482 12.3312 105.872 13.6436 108.862 13.6436C111.747 13.6435 113.095 12.4437 113.095 10.7197C113.095 8.92065 111.62 8.20842 109.662 7.87109L107.788 7.53418C105.051 7.0282 103.955 5.82841 103.955 4.2168C103.955 2.30528 105.472 0.899414 108.715 0.899414ZM26.8057 1.06836C31.3331 1.06836 33.7754 3.41136 33.7754 7.62793C33.7752 11.8442 31.3329 14.1865 26.8057 14.1865H20.7412V1.06836H26.8057ZM46.8545 3.80469H40.1162V6.35352H46.2227V8.78906H40.1162V11.4502H47.0654V14.1865H36.5996V1.06836H46.8545V3.80469ZM55.7891 5.04102L58.7373 1.06836H62.2744L57.5576 7.4209L62.5693 14.1865H59.0322L55.7891 9.82031L52.5459 14.1865H49.0088L54.0205 7.4209L49.3027 1.06836H52.8408L55.7891 5.04102ZM67.3447 12.4814H74.6514V14.1865H65.1543V1.06836H67.3447V12.4814ZM86.9307 2.43652H79.2861V6.82129H86.2988V8.07715H79.2861V12.8184H87.1406V14.1865H77.5596V1.06836H86.9307V2.43652ZM24.7207 11.1133H26.3848C28.9745 11.1132 29.6903 10.1762 29.6904 7.62793C29.6904 5.06057 28.9747 4.14165 26.3848 4.1416H24.7207V11.1133ZM6.49707 0C7.73254 7.41565e-06 8.8313 0.146379 9.79102 0.430664L0 9.65137V0H6.49707Z"
              fill="white"
            />
          </svg>
        </div>
        <button
          onClick={() =>
            routerAdapter?.onRouteChange?.({
              href: "/perp/PERP_BTC_USDC",
              name: "Trade Now",
            })
          }
          style={{
            background: "linear-gradient(90deg, #826AFA 0%, #A5F3B5 100%)",
            borderRadius: "100px",
            padding: isMobile ? "10px 24px" : "12px 28px",
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: "700",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(130, 106, 250, 0.4)",
          }}
        >
          Trade Now
        </button>
      </div>

      {/* ================== 中層：導航連結與 X ================== */}
      <div
        className="oui-flex"
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "1100px",
          // 768px 以上水平排列，以下垂直堆疊並靠左
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "flex-start" : "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          padding: isMobile ? "0 0 32px" : "0 24px 32px",
          gap: isMobile ? "24px" : "0",
        }}
      >
        <nav
          className="oui-flex"
          style={{
            // 768px 以上水平，以下垂直
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "20px" : "32px",
            alignItems: "flex-start",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: isMobile ? "16px" : "14px",
                fontWeight: isMobile ? "600" : "400",
                color: isMobile ? "#FFF" : "#A3A3A3",
                textDecoration: "none",
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* X (Twitter) */}
        <a
          href="https://x.com/DexlessEx"
          target="_blank"
          className="oui-flex oui-items-center"
          style={{ gap: "10px" }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#111",
              border: "1px solid #333",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
              <path d="M9.29424 6.75718L15.1159 0H13.7365L8.68114 5.87625L4.64448 0H0L6.10543 8.8854L0 16H1.37947L6.71805 9.76634L11.0053 16H15.6498L9.29391 6.75718H9.29424ZM7.41908 8.9507L6.80058 8.06606L1.87693 0.992648H4.00414L7.96783 6.64951L8.58633 7.53415L13.7371 14.8967H11.6099L7.41908 8.95103V8.9507Z" />
            </svg>
          </div>
          <span
            style={{ fontSize: "14px", color: "#A3A3A3", fontWeight: "600" }}
          >
            @DexlessEx
          </span>
        </a>
      </div>
      {/* ================== 下層：分隔線與法律資訊 ================== */}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "1150px", // 此處對齊導航區寬度，不要 w-100
          margin: isMobile ? "0" : "0 auto",
          padding: isMobile ? "0" : "0 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "24px",
          }}
        />

        <div
          className="oui-flex"
          style={{
            width: "100%",
            // 關鍵：768px 以上 row (左右)，以下 column (上下)
            flexDirection: isMobile ? "column" : "row",
            // 768px 以上分散兩端，以下靠左
            justifyContent: isMobile ? "flex-start" : "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "12px" : "0px",
          }}
        >
          {/* 左側：Partner 文字 */}
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Partner Orderly Network
          </p>

          {/* 右側：風險提示文字 */}
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              margin: 0,
              lineHeight: "1.6",
              textAlign: isMobile ? "left" : "right",
              maxWidth: isMobile ? "100%" : "500px", // 限制寬度避免桌機版過長
            }}
          >
            DEXless does not provide investment advice. Trading derivatives
            involves substantial risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
