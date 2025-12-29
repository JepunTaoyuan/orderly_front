import { useEffect } from "react";

export const ReferralCodeInterceptor: React.FC = () => {
  useEffect(() => {
    // 從 URL 讀取 referral code
    const searchParams = new URLSearchParams(window.location.search);
    const refCode = searchParams.get("ref");

    if (refCode) {
      // 儲存到 localStorage,供後續使用（統一轉大寫）
      localStorage.setItem("referral_code", refCode.toUpperCase());
    }
  }, []);

  return null;
};
