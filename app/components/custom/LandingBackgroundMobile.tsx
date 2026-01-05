import React from "react";

export const LandingBackgroundMobile: React.FC = () => {
  return (
    <div
      className="oui-absolute oui-inset-0 oui-z-0 oui-pointer-events-none"
      style={{
        backgroundImage: "url('/images/landingpage/landingPageBackground.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "black",
      }}
    />
  );
};
