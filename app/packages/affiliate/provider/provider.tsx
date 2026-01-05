// import {
//   FC,
//   PropsWithChildren,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { format, subDays } from "date-fns";
// import {
//   RefferalAPI as API,
//   usePrivateQuery,
//   useDaily,
//   useAccount,
//   useMemoizedFn,
//   noCacheConfig,
// } from "@orderly.network/hooks";
// import { useAppContext } from "@orderly.network/react-app";
// import { AccountStatusEnum } from "@orderly.network/types";
// import { UserResponse } from "@/services/api-refer-client";
// import { commissionApi } from "@/services/commission.client";
// import { userApi } from "@/services/user.client";
// import { MockData } from "../utils/mockData";
// import {
//   ReferralContext,
//   ReferralContextProps,
//   ReferralContextReturns,
//   TabTypes,
//   UserVolumeType,
// } from "./context";
// export const ReferralProvider: FC<PropsWithChildren<ReferralContextProps>> = (
//   props,
// ) => {
//   const {
//     becomeAnAffiliateUrl = "https://orderly.network/",
//     learnAffiliateUrl = "https://orderly.network/",
//     referralLinkUrl = "https://orderly.network/",
//     chartConfig,
//     overwrite,
//     children,
//     splashPage,
//     onBecomeAnAffiliate,
//     bindReferralCodeState,
//     onLearnAffiliate,
//     showReferralPage,
//   } = props;
//   const { state } = useAccount();
//   const useMockData = process.env.NODE_ENV === "development";
//   // 自訂 API 數據狀態
//   const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
//   const [totalCommission, setTotalCommission] = useState<number>(0);
//   const [weeklyCommission, setWeeklyCommission] = useState<number>(0);
//   const [customApiLoading, setCustomApiLoading] = useState<boolean>(false);
//   // 從 Orderly account 取得 userId
//   const userId = state.accountId || null;
//   // 獲取自訂 API 數據
//   const fetchCustomApiData = useCallback(async () => {
//     if (!userId) {
//       setUserInfo(null);
//       setTotalCommission(0);
//       setWeeklyCommission(0);
//       return;
//     }
//     setCustomApiLoading(true);
//     try {
//       // 並行獲取用戶資訊和佣金數據
//       const [userResponse, commissionResponse] = await Promise.all([
//         userApi.getUser(userId).catch(() => null),
//         commissionApi.getUserCommission(userId).catch(() => null),
//       ]);
//       if (userResponse) {
//         setUserInfo(userResponse);
//       }
//       if (commissionResponse) {
//         setTotalCommission(
//           commissionResponse.total_commission_and_discount || 0,
//         );
//         setWeeklyCommission(
//           commissionResponse.weekly_commission_and_discount || 0,
//         );
//       }
//     } catch (error) {
//       console.error("Failed to fetch custom API data:", error);
//     } finally {
//       setCustomApiLoading(false);
//     }
//   }, [userId]);
//   // 當 userId 變化時獲取數據
//   useEffect(() => {
//     fetchCustomApiData();
//   }, [fetchCustomApiData]);
//   // API 調用
//   const {
//     data,
//     mutate: referralInfoMutate,
//     isLoading,
//   } = usePrivateQuery<API.ReferralInfo>("/v1/referral/info", {
//     revalidateOnFocus: true,
//     errorRetryCount: 3,
//     ...noCacheConfig,
//   });
//   const { data: generateCode, mutate: generateCodeMutate } =
//     usePrivateQuery<API.AutoGenerateCode>(
//       "/v1/referral/auto_referral/progress",
//       {
//         revalidateOnFocus: true,
//         errorRetryCount: 2,
//         formatter: (data) => {
//           return {
//             code: data.auto_referral_code,
//             requireVolume: data.required_volume,
//             completedVolume: data.completed_volume,
//           };
//         },
//       },
//     );
//   const [showHome, setShowHome] = useState(isLoading);
//   useEffect(() => {
//     setShowHome(true);
//   }, [isLoading]);
//   const { data: dailyVolume, mutate: dailyVolumeMutate } = useDaily({
//     startDate: subDays(new Date(), 1),
//     endDate: subDays(new Date(), 90),
//   });
//   const { data: volumeStatistics, mutate: volumeStatisticsMutate } =
//     usePrivateQuery<API.UserVolStats>("/v1/volume/user/stats", {
//       revalidateOnFocus: true,
//     });
//   // 根據開發環境決定使用 MockData 還是真實 API
//   const data = useMockData ? MockData.referralInfo : apiData;
//   const generateCode = useMockData
//     ? MockData.autoGenerateCode
//     : apiGenerateCode;
//   const finalReferralInfoMutate = useMockData ? () => {} : referralInfoMutate;
//   const finalGenerateCodeMutate = useMockData ? () => {} : generateCodeMutate;
//   const [showHome, setShowHome] = useState(isLoading);
//   useEffect(() => {
//     setShowHome(true);
//   }, [isLoading]);
//   // 代理人身份判斷 (優先使用自訂 API 數據)
//   const isAffiliate = useMemo(() => {
//     // 優先使用自訂 API
//     if (userInfo) {
//       return userInfo.is_affiliate;
//     }
//     // 回退到 Orderly API
//     return (data?.referrer_info?.referral_codes?.length || 0) > 0;
//   }, [userInfo, data?.referrer_info]);
//   // 樂觀更新：手動設置 isTrader 狀態
//   const [optimisticIsTrader, setOptimisticIsTrader] = useState<boolean | null>(
//     null,
//   );
//   const isTrader = useMemo(() => {
//     // 如果有樂觀更新值，優先使用
//     if (optimisticIsTrader !== null) {
//       return optimisticIsTrader;
//     }
//     // 優先使用自訂 API (有使用過推薦碼)
//     if (userInfo) {
//       return !!userInfo.used_referral_code;
//     }
//     // 回退到 Orderly API
//     return (data?.referee_info?.referer_code?.length || 0) > 0;
//   }, [optimisticIsTrader, userInfo, data?.referee_info]);
//   // 當 API 數據更新後，重置樂觀更新狀態
//   useEffect(() => {
//     if (userInfo?.used_referral_code || data?.referee_info?.referer_code) {
//       setOptimisticIsTrader(null);
//     }
//   }, [userInfo, data?.referee_info]);
//   // 頂級代理判斷 (parent_affiliate_id 為空)
//   const isTopLevelAgent = useMemo(() => {
//     if (!userInfo) return false;
//     return userInfo.is_affiliate && !userInfo.parent_affiliate_id;
//   }, [userInfo]);
//   const userVolume = useMemo<UserVolumeType>(() => {
//     const volume: UserVolumeType = {};
//     if (dailyVolume && dailyVolume.length > 0) {
//       const now = format(new Date(), "yyyy-MM-dd");
//       const index = dailyVolume.findIndex((item) => item.date === now);
//       let oneDayVolume = 0;
//       if (index !== -1) {
//         oneDayVolume = dailyVolume[index].perp_volume;
//       }
//       volume["1d_volume"] = oneDayVolume;
//     }
//     if (volumeStatistics) {
//       volume["7d_volume"] = volumeStatistics.perp_volume_last_7_days;
//       volume["30d_volume"] = volumeStatistics.perp_volume_last_30_days;
//       volume["all_volume"] = volumeStatistics.perp_volume_ltd;
//     }
//     return volume;
//   }, [dailyVolume, volumeStatistics]);
//   useEffect(() => {
//     if (isAffiliate || isTrader) {
//       setShowHome(false);
//     }
//   }, [isAffiliate, isTrader]);
//   const memoMutate = useMemoizedFn(() => {
//     volumeStatisticsMutate();
//     dailyVolumeMutate();
//     finalReferralInfoMutate();
//     finalGenerateCodeMutate();
//     fetchCustomApiData();
//     referralInfoMutate();
//     generateCodeMutate();
//   });
//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const refCode = searchParams.get("ref");
//     if (refCode) {
//       localStorage.setItem("referral_code", refCode);
//     }
//   }, []);
//   const [tab, setTab] = useState<TabTypes>(TabTypes.affiliate);
//   const { wrongNetwork, disabledConnect } = useAppContext();
//   const lastStete = useRef<AccountStatusEnum>(AccountStatusEnum.NotConnected);
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   useEffect(() => {
//     if (lastStete.current !== state.status) {
//       lastStete.current = state.status;
//       timerRef.current = setTimeout(() => {
//         memoMutate();
//       }, 1000);
//     }
//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, [memoMutate, state.status]);
//   const memoizedValue = useMemo<ReferralContextReturns>(() => {
//     return {
//       generateCode,
//       showHome,
//       referralInfo: data,
//       isAffiliate,
//       isTrader,
//       // 樂觀更新
//       setOptimisticIsTrader,
//       // 新增欄位
//       isTopLevelAgent,
//       userId,
//       userInfo,
//       totalCommission,
//       weeklyCommission,
//       // 現有欄位
//       isAffiliate: isAffiliate,
//       isTrader: isTrader,
//       tab,
//       becomeAnAffiliateUrl,
//       learnAffiliateUrl,
//       referralLinkUrl,
//       userVolume,
//       dailyVolume,
//       chartConfig,
//       overwrite,
//       isLoading: isLoading || customApiLoading,
//       wrongNetwork,
//       disabledConnect,
//       setShowHome,
//       setTab: setTab,
//       mutate: memoMutate,
//       onBecomeAnAffiliate,
//       bindReferralCodeState,
//       onLearnAffiliate,
//       showReferralPage,
//       splashPage,
//     };
//   }, [
//     becomeAnAffiliateUrl,
//     chartConfig,
//     customApiLoading,
//     dailyVolume,
//     data,
//     disabledConnect,
//     generateCode,
//     isAffiliate,
//     isLoading,
//     isTopLevelAgent,
//     isTrader,
//     learnAffiliateUrl,
//     memoMutate,
//     overwrite,
//     referralLinkUrl,
//     setOptimisticIsTrader,
//     showHome,
//     tab,
//     totalCommission,
//     userId,
//     userInfo,
//     userVolume,
//     weeklyCommission,
//     wrongNetwork,
//     onBecomeAnAffiliate,
//     bindReferralCodeState,
//     onLearnAffiliate,
//     showReferralPage,
//     splashPage,
//   ]);
//   return (
//     <ReferralContext.Provider value={memoizedValue}>
//       {children}
//     </ReferralContext.Provider>
//   );
// };
// 測試版本
import {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { format, subDays } from "date-fns";
import {
  RefferalAPI as API,
  usePrivateQuery,
  useDaily,
  useAccount,
  useMemoizedFn,
  noCacheConfig,
} from "@orderly.network/hooks";
import { useAppContext } from "@orderly.network/react-app";
import { AccountStatusEnum } from "@orderly.network/types";
import {
  UserResponse,
  AffiliateSummaryResponse,
  TraderSummaryResponse,
  ReferralCodeStatsResponse,
  DailyVolumeItem,
  CommissionHistoryItem,
  RebateHistoryItem,
} from "@/services/api-refer-client";
import { commissionApi } from "@/services/commission.client";
import { referralApi } from "@/services/referral.client";
import { userApi } from "@/services/user.client";
import { MockData } from "../utils/mockData";
import {
  ReferralContext,
  ReferralContextProps,
  ReferralContextReturns,
  TabTypes,
  UserVolumeType,
} from "./context";

export const ReferralProvider: FC<PropsWithChildren<ReferralContextProps>> = (
  props,
) => {
  const {
    becomeAnAffiliateUrl = "https://orderly.network/",
    learnAffiliateUrl = "https://orderly.network/",
    referralLinkUrl = "https://orderly.network/",
    chartConfig,
    overwrite,
    children,
    splashPage,
    onBecomeAnAffiliate,
    bindReferralCodeState,
    onLearnAffiliate,
    showReferralPage,
  } = props;

  const { state } = useAccount();
  const useMockData = process.env.NODE_ENV === "development" && false; // 關閉 mock

  // 從 Orderly account 取得 userId
  const userId = state.accountId || null;

  // ============================================================================
  // orderly_refer API 數據狀態
  // ============================================================================
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [weeklyCommission, setWeeklyCommission] = useState<number>(0);
  const [affiliateSummary, setAffiliateSummary] =
    useState<AffiliateSummaryResponse | null>(null);
  const [traderSummary, setTraderSummary] =
    useState<TraderSummaryResponse | null>(null);
  const [referralCodesStats, setReferralCodesStats] =
    useState<ReferralCodeStatsResponse | null>(null);
  const [dailyVolumeData, setDailyVolumeData] = useState<DailyVolumeItem[]>([]);
  const [commissionHistory, setCommissionHistory] = useState<
    CommissionHistoryItem[]
  >([]);
  const [rebateHistory, setRebateHistory] = useState<RebateHistoryItem[]>([]);
  const [customApiLoading, setCustomApiLoading] = useState<boolean>(false);

  // ============================================================================
  // Legacy Orderly API (逐步淘汰，暫時保留以確保兼容)
  // ============================================================================
  const {
    data: apiData,
    mutate: referralInfoMutate,
    isLoading: orderlyLoading,
  } = usePrivateQuery<API.ReferralInfo>("/v1/referral/info", {
    revalidateOnFocus: true,
    errorRetryCount: 3,
    ...noCacheConfig,
  });

  const { data: apiGenerateCode, mutate: generateCodeMutate } =
    usePrivateQuery<API.AutoGenerateCode>(
      "/v1/referral/auto_referral/progress",
      {
        revalidateOnFocus: true,
        errorRetryCount: 2,
        formatter: (data) => ({
          code: data.auto_referral_code,
          requireVolume: data.required_volume,
          completedVolume: data.completed_volume,
        }),
      },
    );

  // dailyVolume & volumeStatistics
  const { data: dailyVolume, mutate: dailyVolumeMutate } = useDaily({
    startDate: subDays(new Date(), 1),
    endDate: subDays(new Date(), 90),
  });

  const { data: volumeStatistics, mutate: volumeStatisticsMutate } =
    usePrivateQuery<API.UserVolStats>("/v1/volume/user/stats", {
      revalidateOnFocus: true,
    });

  // Mock data 支援
  const referralInfo = useMockData ? MockData.referralInfo : apiData;
  const generateCode = useMockData
    ? MockData.autoGenerateCode
    : apiGenerateCode;

  // ============================================================================
  // 獲取 orderly_refer API 數據
  // ============================================================================
  const fetchCustomApiData = useCallback(async () => {
    if (!userId) {
      setUserInfo(null);
      setTotalCommission(0);
      setWeeklyCommission(0);
      setAffiliateSummary(null);
      setTraderSummary(null);
      setReferralCodesStats(null);
      setDailyVolumeData([]);
      setCommissionHistory([]);
      setRebateHistory([]);
      return;
    }

    setCustomApiLoading(true);
    try {
      // 基本用戶數據
      const [userResponse, commissionResponse] = await Promise.all([
        userApi.getUser(userId).catch(() => null),
        commissionApi.getUserCommission(userId).catch(() => null),
      ]);

      if (userResponse) {
        setUserInfo(userResponse);

        // 根據用戶類型獲取額外數據
        if (userResponse.is_affiliate) {
          // Affiliate: 獲取 summary, codes stats, commission history
          const [summaryRes, codesRes, historyRes] = await Promise.all([
            userApi.getAffiliateSummary(userId).catch(() => null),
            referralApi.getCodesWithStats(userId).catch(() => null),
            commissionApi.getCommissionHistory(userId).catch(() => null),
          ]);

          if (summaryRes) setAffiliateSummary(summaryRes);
          if (codesRes) setReferralCodesStats(codesRes);
          if (historyRes) setCommissionHistory(historyRes.data || []);
        }

        if (userResponse.used_referral_code) {
          // Trader: 獲取 summary, rebate history, daily volume
          const [traderRes, rebateRes, volumeRes] = await Promise.all([
            userApi.getTraderSummary(userId).catch(() => null),
            commissionApi.getRebateHistory(userId).catch(() => null),
            userApi.getUserDailyVolume(userId).catch(() => null),
          ]);

          if (traderRes) setTraderSummary(traderRes);
          if (rebateRes) setRebateHistory(rebateRes.data || []);
          if (volumeRes) setDailyVolumeData(volumeRes.data || []);
        }
      }

      if (commissionResponse) {
        setTotalCommission(
          commissionResponse.total_commission_and_discount || 0,
        );
        setWeeklyCommission(
          commissionResponse.weekly_commission_and_discount || 0,
        );
      }
    } catch (error) {
      console.error("Failed to fetch orderly_refer API data:", error);
    } finally {
      setCustomApiLoading(false);
    }
  }, [userId]);

  // 當 userId 變化時獲取數據
  useEffect(() => {
    fetchCustomApiData();
  }, [fetchCustomApiData]);

  // ============================================================================
  // 身份判斷
  // ============================================================================

  // 樂觀更新：手動設置 isAffiliate 狀態（用於測試模式）
  const [optimisticIsAffiliate, setOptimisticIsAffiliate] = useState<
    boolean | null
  >(null);

  const isAffiliate = useMemo(() => {
    // 優先使用樂觀更新值（測試模式）
    if (optimisticIsAffiliate !== null) {
      return optimisticIsAffiliate;
    }
    // 優先使用 orderly_refer API
    if (userInfo) {
      return userInfo.is_affiliate;
    }
    // 回退到 Orderly API
    return (referralInfo?.referrer_info?.referral_codes?.length || 0) > 0;
  }, [optimisticIsAffiliate, userInfo, referralInfo?.referrer_info]);

  // 樂觀更新：手動設置 isTrader 狀態
  const [optimisticIsTrader, setOptimisticIsTrader] = useState<boolean | null>(
    null,
  );

  const isTrader = useMemo(() => {
    if (optimisticIsTrader !== null) {
      return optimisticIsTrader;
    }
    // 優先使用 orderly_refer API
    if (userInfo) {
      return !!userInfo.used_referral_code;
    }
    // 回退到 Orderly API
    return (referralInfo?.referee_info?.referer_code?.length || 0) > 0;
  }, [optimisticIsTrader, userInfo, referralInfo?.referee_info]);

  // 當 API 數據更新後，重置樂觀更新狀態
  useEffect(() => {
    if (
      userInfo?.used_referral_code ||
      referralInfo?.referee_info?.referer_code
    ) {
      setOptimisticIsTrader(null);
    }
  }, [userInfo, referralInfo?.referee_info]);

  // 頂級代理判斷
  const isTopLevelAgent = useMemo(() => {
    if (!userInfo) return false;
    return userInfo.is_affiliate && !userInfo.parent_affiliate_id;
  }, [userInfo]);

  // ============================================================================
  // UI 狀態
  // ============================================================================
  const [showHome, setShowHome] = useState(orderlyLoading);
  const [tab, setTab] = useState<TabTypes>(TabTypes.affiliate);
  const { wrongNetwork, disabledConnect } = useAppContext();

  useEffect(() => {
    setShowHome(true);
  }, [orderlyLoading]);

  useEffect(() => {
    if (isAffiliate || isTrader) {
      setShowHome(false);
    }
  }, [isAffiliate, isTrader]);

  // 用戶交易量統計 (混合來源)
  const userVolume = useMemo<UserVolumeType>(() => {
    const volume: UserVolumeType = {};

    // 優先使用 orderly_refer dailyVolumeData
    if (dailyVolumeData.length > 0) {
      const now = format(new Date(), "yyyy-MM-dd");
      const todayData = dailyVolumeData.find((item) => item.date === now);
      volume["1d_volume"] = todayData?.volume || 0;
    } else if (dailyVolume && dailyVolume.length > 0) {
      // 回退到 Orderly API
      const now = format(new Date(), "yyyy-MM-dd");
      const index = dailyVolume.findIndex((item) => item.date === now);
      volume["1d_volume"] = index !== -1 ? dailyVolume[index].perp_volume : 0;
    }

    // 使用 traderSummary 或 volumeStatistics
    if (traderSummary) {
      volume["7d_volume"] = traderSummary.day_7_volume;
      volume["30d_volume"] = traderSummary.day_30_volume;
      volume["all_volume"] = traderSummary.all_volume;
    } else if (volumeStatistics) {
      volume["7d_volume"] = volumeStatistics.perp_volume_last_7_days;
      volume["30d_volume"] = volumeStatistics.perp_volume_last_30_days;
      volume["all_volume"] = volumeStatistics.perp_volume_ltd;
    }

    return volume;
  }, [dailyVolumeData, dailyVolume, traderSummary, volumeStatistics]);

  // ============================================================================
  // 刷新方法
  // ============================================================================
  const memoMutate = useMemoizedFn(() => {
    // orderly_refer APIs
    fetchCustomApiData();
    // Legacy Orderly APIs
    volumeStatisticsMutate();
    dailyVolumeMutate();
    referralInfoMutate();
    generateCodeMutate();
  });

  // 處理 URL 中的推薦碼
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const refCode = searchParams.get("ref");
    if (refCode) {
      localStorage.setItem("referral_code", refCode);
    }
  }, []);

  // 帳戶狀態變化時刷新數據
  const lastState = useRef<AccountStatusEnum>(AccountStatusEnum.NotConnected);
  const [tab, setTab] = useState<TabTypes>(TabTypes.affiliate);
  const { wrongNetwork, disabledConnect } = useAppContext();
  const lastStete = useRef<AccountStatusEnum>(AccountStatusEnum.NotConnected);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (lastState.current !== state.status) {
      lastState.current = state.status;
      timerRef.current = setTimeout(() => {
        memoMutate();
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [memoMutate, state.status]);

  // ============================================================================
  // Context Value
  // ============================================================================
  const memoizedValue = useMemo<ReferralContextReturns>(() => {
    return {
      // Legacy Orderly API
      referralInfo,
      generateCode,
      dailyVolume,

      // orderly_refer API 數據
      affiliateSummary: affiliateSummary || undefined,
      traderSummary: traderSummary || undefined,
      referralCodesStats: referralCodesStats || undefined,
      dailyVolumeData,
      commissionHistory,
      rebateHistory,

      // 狀態標誌
      isAffiliate,
      isTrader,
      setOptimisticIsAffiliate,
      setOptimisticIsTrader,
      isTopLevelAgent,

      // 用戶數據
      userId,
      userInfo,
      totalCommission,
      weeklyCommission,

      // UI 狀態
      userVolume,
      isLoading: orderlyLoading || customApiLoading,
      showHome,
      setShowHome,
      tab,
      setTab,
      wrongNetwork,
      disabledConnect,

      // 工具方法
      mutate: memoMutate,

      // Props
      becomeAnAffiliateUrl,
      learnAffiliateUrl,
      referralLinkUrl,
      chartConfig,
      overwrite,
      isLoading,
      wrongNetwork,
      disabledConnect,
      setShowHome,
      setTab,
      mutate: memoMutate,
      onBecomeAnAffiliate,
      bindReferralCodeState,
      onLearnAffiliate,
      showReferralPage,
      splashPage,
    };
  }, [
    referralInfo,
    becomeAnAffiliateUrl,
    chartConfig,
    dailyVolume,
    data,
    disabledConnect,
    generateCode,
    dailyVolume,
    affiliateSummary,
    traderSummary,
    referralCodesStats,
    dailyVolumeData,
    commissionHistory,
    rebateHistory,
    isAffiliate,
    isTrader,
    setOptimisticIsAffiliate,
    setOptimisticIsTrader,
    isTopLevelAgent,
    userId,
    userInfo,
    totalCommission,
    weeklyCommission,
    userVolume,
    orderlyLoading,
    customApiLoading,
    showHome,
    tab,
    wrongNetwork,
    disabledConnect,
    memoMutate,
    becomeAnAffiliateUrl,
    learnAffiliateUrl,
    referralLinkUrl,
    chartConfig,
    overwrite,
    onBecomeAnAffiliate,
    bindReferralCodeState,
    onLearnAffiliate,
    showReferralPage,
    splashPage,
    memoMutate,
  ]);

  return (
    <ReferralContext.Provider value={memoizedValue}>
      {children}
    </ReferralContext.Provider>
  );
};
