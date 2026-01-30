import React from "react";

export default function SecurityAndRisk() {
  const steps = [
    {
      img: "/images/landingpage/settlement1.png",
      desc: "On-chain settlement",
      bgGradient:
        "linear-gradient(180deg, white 0%, #E4E4E4 50%, #E0FF98 100%)",
    },
    {
      img: "/images/landingpage/publicly1.png",
      desc: "Publicly verifiable data",
      bgGradient:
        "linear-gradient(180deg, white 0%, #E4E4E4 50%, #8883E9 100%)",
    },
    {
      img: "/images/landingpage/mechanics1.png",
      desc: "Clear liquidation mechanics",
      bgGradient:
        "linear-gradient(180deg, white 0%, #E4E4E4 50%, #E0FF98 100%)",
    },
  ];
  return (
    <section
      className="oui-space-y-5 oui-bg-white oui-text-black oui-flex oui-flex-col oui-items-center oui-text-center"
      style={{
        paddingTop: "120px",
        paddingBottom: "120px",
        minHeight: "835px",
      }}
    >
      <div className="oui-pb-10">
        <p
          style={{
            fontSize: "48px",
            fontWeight: "600",
            lineHeight: "1.1",
            paddingBottom: "24px",
            maxWidth: "100%",
          }}
        >
          Security & Risk
        </p>
        <p
          style={{
            fontSize: "30px",
            fontWeight: "500",
            maxWidth: "830px",
          }}
        >
          Security Philosophy
        </p>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "400",
            color: "#666",
          }}
        >
          DEXless is designed around transparency, verifiability, and risk
          awareness.
        </p>
      </div>
      {/* 卡片排版區域 */}
      <div className="oui-flex oui-flex-wrap oui-justify-center oui-gap-8 oui-w-full oui-max-w-7xl oui-px-6">
        {steps.map((item, index) => (
          <div
            key={index}
            className="oui-flex oui-flex-col oui-items-center"
            style={{ width: "300px" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: item.bgGradient,
                borderRadius: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "32px",
              }}
            >
              <img
                src={item.img}
                alt={item.desc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: "translateY(5%)",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
