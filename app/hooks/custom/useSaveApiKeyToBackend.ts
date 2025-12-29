import { useState, useCallback } from "react";
import { toast } from "@orderly.network/ui";
import { gridBotService } from "@/services/gridBot.client";
import { userApi } from "@/services/user.client";

export type SaveApiKeyOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useSaveApiKeyToBackend = (options: SaveApiKeyOptions) => {
  const { onSuccess, onError } = options;
  const [isSaving, setIsSaving] = useState(false);

  const saveToBackend = useCallback(
    async (
      apiKey: string,
      secretKey: string,
      userId?: string,
      walletAddress?: string,
    ) => {
      setIsSaving(true);
      try {
        if (!userId) {
          throw new Error("Missing userId when saving API key to backend");
        }
        if (!(await userApi.checkExist(userId!))) {
          console.log("User does not exist, creating new user");
          await userApi.createUser({
            user_id: userId!,
            wallet_address: walletAddress!,
          });
        }
        const response = await gridBotService.enableBotTrading({
          user_api_key: apiKey,
          user_api_secret: secretKey,
          user_id: userId!,
        });

        if (!response.success) {
          throw new Error("Failed to save API key to backend");
        }

        const data = response.data;
        toast.success("API key saved to backend successfully");
        onSuccess?.();
        return data;
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
        onError?.(err);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [onSuccess, onError],
  );

  return {
    saveToBackend,
    isSaving,
  };
};
