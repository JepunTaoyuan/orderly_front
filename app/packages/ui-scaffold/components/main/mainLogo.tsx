import { FC } from "react";
import { useAppConfig } from "@orderly.network/react-app";
import { Logo } from "@orderly.network/ui";
import { OrderlyLogo } from "../icons";

type MainLogoProps = {
  src?: string;
  alt?: string;
};

export const MainLogo: FC<MainLogoProps> = (props) => {
  return (
    // logo 標題
    <div
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "0.08em",
      }}
    >
      DEXLESS
    </div>
  );
  // const { appIcons } = useAppConfig();

  // if (props.src) {
  //   return <Logo src={props.src} alt={props.alt} />;
  // }

  // const { main } = appIcons || {};

  // if (main?.img) {
  //   return <img src={main?.img} />;
  // }

  // if (main?.component) {
  //   return main.component;
  // }

  // return <OrderlyLogo />;
};
