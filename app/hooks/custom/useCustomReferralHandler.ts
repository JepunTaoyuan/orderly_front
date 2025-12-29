import { useState, useEffect } from "react";
import { useAccount } from "@orderly.network/hooks";
import { AccountStatusEnum } from "@orderly.network/types";
import { referralApi } from "@/services/referral.client";

export const useCustomReferralHandler = () => {
  const { createAccount, createOrderlyKey, state } = useAccount();
  const [refCode, setRefCode] = useState("");
  const [helpText, setHelpText] = useState("");

  useEffect(() => {
    // 從 localStorage 讀取 referral code (可能來自 URL 或手動輸入)
    const savedRefCode = localStorage.getItem("referral_code");
    if (savedRefCode) {
      setRefCode(savedRefCode);
    }
  }, []);

  const checkRefCode = async () => {
    if (refCode.length === 0) {
      return Promise.resolve(undefined);
    }

    try {
      const response = await referralApi.verify(refCode);

      if (!response.valid) {
        // 顯示警告並阻止創建
        setHelpText("此推薦碼不存在,請輸入正確的推薦碼");
      }
    } catch (error) {
      console.warn("Referral code verification failed:", error);
    }

    return Promise.resolve(undefined);
  };

  // 創建帳戶 - 不阻止流程
  const signIn = async () => {
    await checkRefCode();

    // 儲存到 localStorage,供 AccountCreationListener 使用
    if (refCode) {
      localStorage.setItem("referral_code", refCode);
    }

    // 直接創建帳戶,不等待驗證結果
    return createAccount();
  };

  // 啟用交易
  const enableTrading = async (remember: boolean) => {
    return createOrderlyKey(remember);
  };

  // 完成後不調用 Orderly 的 bind API
  const enableTradingCompleted = () => {
    console.log("Trading enabled, referral code handled by custom backend");
  };

  return {
    enableTrading,
    signIn,
    enableTradingCompleted,
    refCode,
    setRefCode,
    helpText,
    showRefCodeInput: true,
    initAccountState: state.status,
  };
};
