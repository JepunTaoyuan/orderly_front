import { useEffect, useRef, useCallback } from "react";
import { useAccount } from "@orderly.network/hooks";
import { AccountStatusEnum } from "@orderly.network/types";
import { userService } from "@/services/user.client";

interface AccountCreationData {
  user_id: string;
  wallet_address: string;
  referral_code?: string;
}

// 生成唯一請求 ID
function generateRequestId(): string {
  return `user_registration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 檢查請求是否已經處理過
function isRequestProcessed(requestId: string): boolean {
  const processedRequests = JSON.parse(
    sessionStorage.getItem("processedRegistrationRequests") || "[]",
  );
  return processedRequests.includes(requestId);
}

// 標記請求為已處理
function markRequestProcessed(requestId: string): void {
  const processedRequests = JSON.parse(
    sessionStorage.getItem("processedRegistrationRequests") || "[]",
  );
  processedRequests.push(requestId);
  sessionStorage.setItem(
    "processedRegistrationRequests",
    JSON.stringify(processedRequests),
  );
}

// 清理過期的請求記錄（超過 5 分鐘）
function cleanupExpiredRequests(): void {
  const now = Date.now();
  const requestTimestamps = JSON.parse(
    sessionStorage.getItem("registrationRequestTimestamps") || "{}",
  );
  const expiredRequests = Object.entries(requestTimestamps)
    .filter(([_, timestamp]) => now - (timestamp as number) > 5 * 60 * 1000) // 5 分鐘過期
    .map(([requestId]) => requestId);

  if (expiredRequests.length > 0) {
    const processedRequests = JSON.parse(
      sessionStorage.getItem("processedRegistrationRequests") || "[]",
    );
    const remainingRequests = processedRequests.filter(
      (id: string) => !expiredRequests.includes(id),
    );
    sessionStorage.setItem(
      "processedRegistrationRequests",
      JSON.stringify(remainingRequests),
    );

    expiredRequests.forEach((requestId) => delete requestTimestamps[requestId]);
    sessionStorage.setItem(
      "registrationRequestTimestamps",
      JSON.stringify(requestTimestamps),
    );
  }
}

export const AccountCreationListener: React.FC = () => {
  const { state } = useAccount();
  const hasProcessedRef = useRef(false);
  const currentRequestIdRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);

  const handleAccountCreation = useCallback(
    async (accountData: AccountCreationData) => {
      // 防止重複提交
      if (isSubmittingRef.current) {
        console.log("Registration already in progress, skipping...");
        return;
      }

      const requestId = generateRequestId();
      currentRequestIdRef.current = requestId;

      // 檢查是否已經處理過相同請求
      if (isRequestProcessed(requestId)) {
        console.log("Request already processed, skipping...");
        return;
      }

      isSubmittingRef.current = true;
      hasProcessedRef.current = true;

      // 記錄請求時間戳
      const requestTimestamps = JSON.parse(
        sessionStorage.getItem("registrationRequestTimestamps") || "{}",
      );
      requestTimestamps[requestId] = Date.now();
      sessionStorage.setItem(
        "registrationRequestTimestamps",
        JSON.stringify(requestTimestamps),
      );

      try {
        console.log("Starting user registration:", {
          ...accountData,
          requestId,
        });

        await userService.createUser(accountData);

        // 標記請求為已處理
        markRequestProcessed(requestId);

        console.log("Account saved successfully:", {
          ...accountData,
          requestId,
        });
      } catch (error) {
        console.error("Failed to save account:", error);

        // 只有在確實是重複錯誤時才重置，其他錯誤保持已處理狀態
        if (error && typeof error === "object" && "status" in error) {
          const apiError = error as { status: number; message?: string };
          if (
            apiError.status === 500 &&
            apiError.message?.includes(
              "Duplicate values are found for unique index",
            )
          ) {
            // 這是重複錯誤，可能是因為請求已經成功處理了，保持 hasProcessedRef.current = true
            console.log(
              "Duplicate registration detected, assuming previous request succeeded",
            );
          } else {
            // 其他錯誤，重置狀態允許重試
            hasProcessedRef.current = false;
          }
        } else {
          // 未知錯誤，重置狀態允許重試
          hasProcessedRef.current = false;
        }
      } finally {
        isSubmittingRef.current = false;
        currentRequestIdRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    // 清理過期的請求記錄
    cleanupExpiredRequests();

    if (
      state.status === AccountStatusEnum.DisabledTrading &&
      state.isNew &&
      state.accountId &&
      state.address &&
      !hasProcessedRef.current &&
      !isSubmittingRef.current
    ) {
      // 立即讀取並清除 referral code
      const referralCode = localStorage.getItem("referral_code");
      localStorage.removeItem("referral_code");

      const accountData: AccountCreationData = {
        user_id: state.accountId,
        wallet_address: state.address,
        referral_code: referralCode || undefined,
      };

      handleAccountCreation(accountData);
    }

    // 只有在完全斷開連接時才重置處理狀態
    if (state.status < AccountStatusEnum.SignedIn) {
      // 但要小心，不要在正常的連接狀態波動時重置
      if (!state.accountId) {
        hasProcessedRef.current = false;
        isSubmittingRef.current = false;
        currentRequestIdRef.current = null;
      }
    }
  }, [
    state.status,
    state.isNew,
    state.accountId,
    state.address,
    handleAccountCreation,
  ]);

  return null;
};
