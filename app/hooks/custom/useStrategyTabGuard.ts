import { useEffect, useState } from "react";
import { useAccount } from "@orderly.network/hooks";
import { gridBotService } from "@/services/gridBot.client";

export enum ScopeType {
  trade = "trade",
  trading = "trading",
  tradeAndTrading = "trade,trading",
}

export const useStrategyTabGuard = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { state } = useAccount();

  // localStorage key for API key check cache
  const getLocalStorageKey = (accountId: string) => {
    return `orderly_apikey_checked_${accountId}`;
  };

  const checkBackendApiKey = async () => {
    try {
      // 若帳戶尚未初始化，略過後端檢查，避免傳遞 undefined
      if (!state?.accountId) {
        console.warn(
          "[useStrategyTabGuard] accountId not ready, skip checkBackendApiKey",
        );
        return;
      }

      const accountId = state.accountId as string;
      const localStorageKey = getLocalStorageKey(accountId);

      // 檢查 localStorage 是否已記錄此錢包的 API key 檢查通過
      const cachedResult = localStorage.getItem(localStorageKey);
      if (cachedResult === "true") {
        console.log(
          "[useStrategyTabGuard] Using cached API key check result for account:",
          accountId,
        );
        setHasApiKey(true);
        return;
      }

      const response = await gridBotService.checkUserApiKey(accountId);

      console.log(
        "[useStrategyTabGuard] checkBackendApiKey response:",
        response,
      );

      const data = response.data;
      setHasApiKey(data);

      // 只有當檢查通過時才將結果存入 localStorage
      // 檢查失敗時不緩存，讓用戶下次可以重新檢查
      if (data) {
        localStorage.setItem(localStorageKey, "true");
        console.log(
          "[useStrategyTabGuard] Cached API key check result for account:",
          accountId,
        );
      } else {
        // 檢查失敗時不緩存，確保用戶創建 API key 後能正確檢測到
        console.log(
          "[useStrategyTabGuard] API key check failed for account:",
          accountId,
        );
        setShowDialog(true);
      }
    } catch (error) {
      console.error("Failed to check API key:", error);
      setHasApiKey(false);
      setShowDialog(true);
    }
  };

  // 清除特定錢包的 localStorage 緩存
  const clearApiKeyCache = (accountId: string) => {
    const localStorageKey = getLocalStorageKey(accountId);
    localStorage.removeItem(localStorageKey);
    console.log(
      "[useStrategyTabGuard] Cleared API key cache for account:",
      accountId,
    );
  };

  // 重置 hasApiKey 狀態，用於錢包變更時
  const resetApiKeyStatus = () => {
    setHasApiKey(null);
    setShowDialog(false);
  };

  return {
    hasApiKey,
    showDialog,
    setShowDialog,
    checkBackendApiKey,
    clearApiKeyCache,
    resetApiKeyStatus,
  };
};
