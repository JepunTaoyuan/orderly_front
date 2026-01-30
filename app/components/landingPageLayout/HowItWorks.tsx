import React from "react";
import { useMediaQuery } from "@orderly.network/hooks";

export default function HowItWorks() {
  const is2XL = useMediaQuery("(min-width: 1280px)");

  const steps = [
    {
      id: 1,
      img: "/images/landingpage/step1.png",
      desc: "Connect your wallet",
    },
    { id: 2, img: "/images/landingpage/step2.png", desc: "Deposit collateral" },
    {
      id: 3,
      img: "/images/landingpage/step3.png",
      desc: "Choose a perpetual market",
    },
    {
      id: 4,
      img: "/images/landingpage/step4.png",
      desc: "Set leverage and risk parameters",
    },
    {
      id: 5,
      img: "/images/landingpage/step5.png",
      desc: "Trade and manage positions with full transparency",
    },
  ];

  const LeftArrowSVG = () => (
    <svg
      width="220"
      height="200"
      viewBox="0 0 218 231"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M68.8236 192.264C68.0454 194.033 65.9765 194.843 64.2396 193.995C49.7758 186.931 37.5179 176.002 28.8425 162.39C19.5391 147.792 14.7733 130.764 15.1477 113.458C15.5222 96.1515 21.0202 79.3451 30.9463 65.1636C40.2025 51.9393 52.9216 41.5514 67.6774 35.1197C69.4494 34.3474 71.4813 35.246 72.1822 37.0474C72.8831 38.8488 71.9872 40.8703 70.2179 41.6488C56.7513 47.5744 45.1432 57.0875 36.681 69.1775C27.5487 82.2248 22.4905 97.6871 22.1459 113.609C21.8014 129.531 26.1861 145.198 34.7454 158.628C42.6767 171.073 53.8625 181.079 67.0602 187.581C68.7941 188.436 69.6017 190.494 68.8236 192.264Z"
        fill="url(#paint0)"
      />
      <path
        d="M84.0763 195.626C85.7666 198.2 84.0368 201.638 80.9626 201.815L63.3646 202.828C60.2905 203.005 58.1776 199.787 59.5615 197.037L67.4834 181.29C68.8673 178.539 72.7099 178.318 74.4002 180.892L84.0763 195.626Z"
        fill="url(#paint1)"
      />
      <defs>
        <linearGradient
          id="paint0"
          x1="64"
          y1="190"
          x2="69"
          y2="39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" />
          <stop offset="1" stopColor="#999999" />
        </linearGradient>
        <linearGradient
          id="paint1"
          x1="63"
          y1="188"
          x2="81"
          y2="203"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" />
          <stop offset="1" stopColor="#E6E6E6" />
        </linearGradient>
      </defs>
    </svg>
  );

  const RightArrowSVG = () => (
    <svg
      width="220"
      height="200"
      viewBox="0 0 225 231"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M149.176 192.264C149.955 194.033 152.023 194.843 153.76 193.995C168.224 186.931 180.482 176.003 189.158 162.39C198.461 147.793 203.227 130.764 202.852 113.458C202.478 96.1518 196.98 79.3453 187.054 65.1638C177.798 51.9395 165.078 41.5517 150.323 35.12C148.551 34.3476 146.519 35.2463 145.818 37.0477C145.117 38.8491 146.013 40.8706 147.782 41.6491C161.249 47.5746 172.857 57.0878 181.319 69.1777C190.451 82.225 195.51 97.6873 195.854 113.609C196.199 129.531 191.814 145.198 183.255 158.628C175.323 171.073 164.138 181.079 150.94 187.582C149.206 188.436 148.398 190.494 149.176 192.264Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M133.924 195.626C132.233 198.2 133.963 201.638 137.037 201.815L154.635 202.828C157.709 203.005 159.822 199.788 158.438 197.037L150.516 181.29C149.133 178.539 145.29 178.318 143.6 180.892L133.924 195.626Z"
        fill="url(#paint1_linear)"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="153.745"
          y1="190.667"
          x2="148.959"
          y2="39.2135"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" />
          <stop offset="1" stopColor="#999999" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="154.771"
          y1="188.276"
          x2="136.309"
          y2="202.976"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" />
          <stop offset="1" stopColor="#E6E6E6" />
        </linearGradient>
      </defs>
    </svg>
  );

  const VerticalGridWorkFlow = () => (
    <div
      className="oui-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr", // 單欄結構，箭頭和圖片各佔一個 Row
        width: "100%",
        maxWidth: "420px",
      }}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const arrowType = index % 2 === 0 ? "left" : "right";

        return (
          <React.Fragment key={step.id}>
            {/* 圖片與文字 Row */}
            <div className="oui-flex oui-flex-col oui-items-center oui-text-center">
              <div
                style={{
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={step.img}
                  alt={step.desc}
                  style={{ maxWidth: "200px", objectFit: "contain" }}
                />
              </div>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginTop: "0px",
                  maxWidth: "280px",
                }}
              >
                {step.desc}
              </p>
            </div>

            {/* 箭頭獨立 Row */}
            {!isLast && (
              <div
                style={{
                  display: "grid",
                  width: "100%",
                  marginBottom: "-20px",
                }}
              >
                <div
                  style={{
                    justifySelf: arrowType === "left" ? "start" : "end",
                  }}
                >
                  {arrowType === "left" ? <LeftArrowSVG /> : <RightArrowSVG />}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const HorizontalWorkFlow = () => (
    <div className="oui-w-full oui-max-w-[1400px] oui-mx-auto">
      {/* 使用 Grid 確保每一欄寬度絕對一致 */}
      <div
        className="oui-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", // 5 等分
          gap: "0px",
          position: "relative", // 讓箭頭可以相對於此容器定位
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="oui-flex oui-flex-col oui-items-center"
            style={{ position: "relative" }}
          >
            {/* 圖片區塊 */}
            <div
              style={{
                height: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={step.img}
                alt={step.desc}
                style={{
                  maxWidth: "160px",
                  maxHeight: "160px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* 文字區塊：現在與圖片在同一個 Flex Col 下，絕對垂直對齊 */}
            <div className="oui-mt-6" style={{ minHeight: "60px" }}>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "0 15px",
                  lineHeight: "1.3",
                }}
              >
                {step.desc}
              </p>
            </div>

            {/* 箭頭區塊：絕對定位在兩張圖片中間 */}
            {index !== steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  right: "-30px", // 調整至兩欄中間
                  top: "90px", // 對齊圖片中心 (180px / 2)
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                <img
                  src="/images/landingpage/arrow.png"
                  alt="arrow"
                  style={{ width: "60px" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      className="oui-bg-white oui-text-black oui-flex oui-flex-col oui-items-center"
      style={{ padding: "100px 24px" }}
    >
      <div className="oui-pb-16 oui-text-center">
        <h2
          style={{ fontSize: "48px", fontWeight: "600", marginBottom: "20px" }}
        >
          How It Works
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "#666",
            maxWidth: "830px",
            lineHeight: "1.4",
          }}
        >
          Trading platforms shouldn’t just execute trades — they should help
          traders understand, improve, and evolve.
        </p>
      </div>

      {is2XL ? <HorizontalWorkFlow /> : <VerticalGridWorkFlow />}
    </section>
  );
}
