import { useMediaQuery } from "@orderly.network/hooks";

export const useScreenSize = () => {
  // 偵測 1920px 以上
  const is5XL = useMediaQuery("(min-width: 1920px)");

  // 偵測 1440px 到 1919px
  const is3XL = useMediaQuery("(min-width: 1440px) and (max-width: 1919px)");

  // 偵測 1024px 到 1439px
  const isXL = useMediaQuery("(min-width: 1024px) and (max-width: 1439px)");

  // 偵測 1024px 以下
  const isBelowXL = useMediaQuery("(max-width: 1023px)");

  return {
    size: is5XL ? "1920+" : is3XL ? "1440" : isXL ? "1024" : "small",
    is5XL,
    is3XL,
    isXL,
    isBelowXL,
  };
};
