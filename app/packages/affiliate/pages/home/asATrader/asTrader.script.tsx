import { useEffect, useMemo, useState, useCallback } from "react";
import { useAccount } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import { toast, useScreen } from "@orderly.network/ui";
import { AuthStatusEnum, useAuthStatus } from "@orderly.network/ui-connector";
import { referralApi } from "@/services/referral.client";
import { userApi } from "@/services/user.client";
import { isTestCodeInDevMode } from "@/utils/testCode";
import { TabTypes, useReferralContext } from "../../../provider";

export const useAsTraderScript = () => {
  const { t } = useTranslation();

  const {
    isTrader,
    referralInfo,
    setShowHome,
    bindReferralCodeState,
    setTab,
    mutate,
    userId,
    setOptimisticIsTrader,
  } = useReferralContext();

  const { wrongNetwork, disabledConnect } = useAppContext();

  const { state } = useAccount();

  const onEnterTraderPage = () => {
    setTab(TabTypes.trader);
    setShowHome(false);
  };

  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (!code || code.length < 4) {
      setIsExist(undefined);
      return;
    }
    setIsLoading(true);

    // 測試代碼在開發模式下直接標記為存在
    if (isTestCodeInDevMode(code)) {
      setIsExist(true);
      setIsLoading(false);
      return;
    }

    referralApi
      .verify(code)
      .then(() => setIsExist(true))
      .catch(() => setIsExist(false))
      .finally(() => setIsLoading(false));
  }, [code]);

  const hide = () => {
    setOpen(false);
  };

  // 使用自訂 API 進行綁定
  const bindReferralCode = useCallback(
    async (referralCode: string) => {
      if (!userId) {
        throw new Error("用戶未登入");
      }
      return userApi.bindReferralCode(userId, { referral_code: referralCode });
    },
    [userId],
  );

  const onClickConfirm = async () => {
    try {
      setIsMutating(true);
      // 測試代碼在開發模式下跳過實際 bind
      if (!isTestCodeInDevMode(code)) {
        await bindReferralCode(code);
      }
      toast.success(t("affiliate.referralCode.bound"));

      // 樂觀更新：立即設置 isTrader 為 true，不等待 API 返回
      setOptimisticIsTrader?.(true);

      mutate();

      // 導航到 trader 頁面
      setTab(TabTypes.trader);
      setShowHome(false);

      if (bindReferralCodeState) {
        bindReferralCodeState(true, null, hide, { tab: 1 });
      } else {
        hide();
      }
    } catch (e: any) {
      let errorText = `${e}`;
      if ("message" in e) {
        errorText = e.message;
      }

      if ("referral code not exist" === errorText) {
        errorText = t("affiliate.referralCode.notExist");
      }

      if (bindReferralCodeState) {
        toast.error(errorText);
        bindReferralCodeState(false, e, hide, {});
      } else {
        toast.error(errorText);
      }
    } finally {
      setIsMutating(false);
    }
  };

  const { isMobile } = useScreen();

  const authStatus = useAuthStatus();

  const warningMessage = useMemo(() => {
    const message: { [key in AuthStatusEnum]?: string } = {
      [AuthStatusEnum.ConnectWallet]: t("affiliate.connectWallet.tooltip"),
      [AuthStatusEnum.CreateAccount]: t("affiliate.createAccount.tooltip"),
      [AuthStatusEnum.WrongNetwork]: t("connector.wrongNetwork.tooltip"),
    };
    return message[authStatus];
  }, [authStatus]);

  return {
    isTrader,
    isLoading,
    referralInfo,
    onEnterTraderPage,
    code,
    setCode,
    open,
    setOpen,
    onClickConfirm,
    isExist,
    wrongNetwork,
    isMobile,
    warningMessage,
  };
};

export type AsTraderReturns = ReturnType<typeof useAsTraderScript>;
