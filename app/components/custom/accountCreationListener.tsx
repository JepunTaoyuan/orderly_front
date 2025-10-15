import { useEffect, useRef } from "react";
import { useAccount } from "@orderly.network/hooks";
import { AccountStatusEnum } from "@orderly.network/types";
import { userService } from "@/services/user.client";

interface AccountCreationData {
  user_id: string;
  wallet_address: string;
  referral_code?: string;
}

export const AccountCreationListener: React.FC = () => {
  const { state } = useAccount();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (
      state.status === AccountStatusEnum.DisabledTrading &&
      state.isNew &&
      state.accountId &&
      state.address &&
      !hasProcessedRef.current
    ) {
      hasProcessedRef.current = true;

      // 立即讀取並清除 referral code
      const referralCode = localStorage.getItem("referral_code");
      localStorage.removeItem("referral_code");

      const accountData: AccountCreationData = {
        user_id: state.accountId,
        wallet_address: state.address,
        referral_code: referralCode || undefined,
      };

      // 發送到您的後端
      userService
        .createUser(accountData)
        .then(() => {
          console.log("Account saved successfully:", accountData);
        })
        .catch((error) => {
          console.error("Failed to save account:", error);
          hasProcessedRef.current = false;
        });
    }

    if (state.status < AccountStatusEnum.SignedIn) {
      hasProcessedRef.current = false;
    }
  }, [state.status, state.isNew, state.accountId, state.address]);

  return null;
};
