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

  const checkBackendApiKey = async () => {
    try {
      // 若帳戶尚未初始化，略過後端檢查，避免傳遞 undefined
      if (!state?.accountId) {
        console.warn(
          "[useStrategyTabGuard] accountId not ready, skip checkBackendApiKey",
        );
        return;
      }
      const response = await gridBotService.checkUserApiKey(
        state.accountId as string,
      );

      console.log(
        "[useStrategyTabGuard] checkBackendApiKey response:",
        response,
      );

      const data = response.data;
      setHasApiKey(data);

      if (!data) {
        setShowDialog(true);
      }
    } catch (error) {
      console.error("Failed to check API key:", error);
      setHasApiKey(false);
      setShowDialog(true);
    }
  };

  return {
    hasApiKey,
    showDialog,
    setShowDialog,
    checkBackendApiKey,
  };
};
