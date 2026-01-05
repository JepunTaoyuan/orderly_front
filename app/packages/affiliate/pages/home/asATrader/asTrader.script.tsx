import { useMemo, useState, useCallback } from "react";
import { useAccount } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import { toast, useScreen } from "@orderly.network/ui";
import { AuthStatusEnum, useAuthStatus } from "@orderly.network/ui-connector";
import { referralApi } from "@/services/referral.client";
import { userApi } from "@/services/user.client";
import { isTestCodeInDevMode, setTestMode } from "@/utils/testCode";
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
    setOptimisticIsAffiliate,
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

  const [isMutating, setIsMutating] = useState(false);

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
    // 基本長度檢查
    if (!code || code.length < 4) {
      toast.error(
        t("affiliate.referralCode.tooShort", "邀請碼至少需要 4 個字元"),
      );
      return;
    }

    try {
      setIsMutating(true);

      // 測試代碼處理：導航到 Affiliate 頁面（因為 TEST_USER.is_affiliate = true）
      if (isTestCodeInDevMode(code)) {
        toast.success(t("affiliate.referralCode.bound"));

        // 設置測試模式 flag
        setTestMode(true);

        // 樂觀更新：設置 isAffiliate 為 true（測試用戶是 affiliate）
        setOptimisticIsAffiliate?.(true);

        mutate(); // 刷新數據

        // 測試用戶是 affiliate，導航到 Affiliate 頁面
        setTab(TabTypes.affiliate);
        setShowHome(false);
        hide();
        return;
      }

      // 先驗證邀請碼是否存在
      try {
        await referralApi.verify(code);
      } catch {
        toast.error(t("affiliate.referralCode.notExist"));
        return;
      }

      // 驗證通過，執行綁定
      await bindReferralCode(code);
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
    isMutating,
    referralInfo,
    onEnterTraderPage,
    code,
    setCode,
    open,
    setOpen,
    onClickConfirm,
    wrongNetwork,
    isMobile,
    warningMessage,
  };
};

export type AsTraderReturns = ReturnType<typeof useAsTraderScript>;
