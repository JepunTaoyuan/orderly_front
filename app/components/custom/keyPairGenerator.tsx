import React, { useState, useEffect } from "react";
import { useAccount } from "@orderly.network/hooks";
import { i18n } from "@orderly.network/i18n";
import { AccountStatusEnum } from "@orderly.network/types";
import { Text, SimpleDialog } from "@orderly.network/ui";
import { useSaveApiKeyToBackend } from "@/hooks/custom/useSaveApiKeyToBackend";
import { useStrategyTabGuard } from "@/hooks/custom/useStrategyTabGuard";

export const KeyPairGenerator: React.FC = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const { account, state, isSubAccount } = useAccount();
  const {
    hasApiKey,
    showDialog,
    setShowDialog,
    checkBackendApiKey,
    clearApiKeyCache,
    resetApiKeyStatus,
  } = useStrategyTabGuard();
  const { saveToBackend, isSaving } = useSaveApiKeyToBackend({
    onSuccess: () => {
      setShowDialog(false);
      setIsBlurred(false);
    },
  });

  // 監聽錢包變更，當錢包地址變更時重置狀態
  useEffect(() => {
    // 當錢包地址變更時，重置狀態，這樣會觸發重新檢查
    resetApiKeyStatus();
    setIsBlurred(false);
  }, [state?.accountId]);

  // 等待 accountId 就緒後再進行後端檢查，避免傳遞 undefined
  useEffect(() => {
    if (state?.accountId && state.status === AccountStatusEnum.EnableTrading) {
      checkBackendApiKey();
    }
  }, [state?.accountId, state?.status]);

  useEffect(() => {
    if (hasApiKey === false) {
      setIsBlurred(true);
    } else if (hasApiKey === true) {
      setIsBlurred(false);
    }
  }, [hasApiKey]);

  const handleCreateApiKey = async () => {
    try {
      // 創建 API key
      const generateKeyRes = await account.createApiKey(365, {
        tag: "strategyAutoCreated",
        scope: "read,trading",
      });

      if (!generateKeyRes) {
        throw new Error("API key generation returned empty result");
      }

      // 保存到後端
      if (generateKeyRes) {
        await saveToBackend(
          generateKeyRes.key,
          generateKeyRes.secretKey,
          state.accountId,
          state.address,
        );
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  };
  const handleSkip = () => {
    localStorage.setItem("orderly_console_skip_apikey_creation", "true");
    setShowDialog(false);
    setIsBlurred(false);
  };

  return (
    <div className={isBlurred ? "oui-blur-sm" : ""}>
      {showDialog && (
        <SimpleDialog
          open={showDialog}
          onOpenChange={() => {}}
          title="Create API Key for Strategy"
          actions={{
            primary: {
              label: "Create API Key",
              onClick: handleCreateApiKey,
              disabled: isSaving,
            },
            secondary: {
              label: "Skip",
              onClick: handleSkip,
            },
          }}
        >
          <Text>
            {i18n.t("common.strategy.apikey1", { defaultValue: "" })}
            <br />
          </Text>
          <Text>{i18n.t("common.strategy.apikey2", { defaultValue: "" })}</Text>
          <ul>
            <li>Scope: read, trading</li>
            <li>Duration: 365 days</li>
          </ul>
        </SimpleDialog>
      )}
    </div>
  );
};
