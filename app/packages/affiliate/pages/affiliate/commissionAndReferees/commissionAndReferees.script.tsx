import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import {
  RefferalAPI,
  useMediaQuery,
  useRefereeInfo,
  useReferralRebateSummary,
} from "@orderly.network/hooks";
import { PaginationMeta, usePagination } from "@orderly.network/ui";
import {
  SubAffiliateItem,
  CommissionHistoryItem,
  ReferralDetailItem,
} from "@/services/api-refer-client";
import { commissionApi } from "@/services/commission.client";
import { userApi } from "@/services/user.client";
import { useReferralContext } from "../../../provider/context";
import { DateRange } from "../../../utils/types";

export type ListReturns<T, R = T> = {
  data: T;
  rawData?: R; // 原始數據 (用於 Edit modal)
  dateRange?: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  isLoading?: boolean;
  loadMore?: () => void;
  pagination: PaginationMeta;
  refresh?: () => void; // 刷新數據
};

export type SubAgentReturns = {
  data: SubAffiliateItem[] | undefined;
  isLoading?: boolean;
  pagination: PaginationMeta;
  refresh: () => void;
};

export type CommissionAndRefereesReturns = {
  commission: ListReturns<RefferalAPI.ReferralRebateSummary[] | undefined>;
  referees: ListReturns<
    RefferalAPI.RefereeInfoItem[] | undefined,
    ReferralDetailItem[]
  >;
  subAgents: SubAgentReturns;
  isTopLevelAgent: boolean;
};

export const useCommissionAndRefereesScript =
  (): CommissionAndRefereesReturns => {
    const { isTopLevelAgent } = useReferralContext();
    const commission = useCommissionDataScript();
    const referees = useRefereesDataScript();
    const subAgents = useSubAgentDataScript();

    return {
      commission,
      referees,
      subAgents,
      isTopLevelAgent,
    };
  };

const useCommissionDataScript = (): ListReturns<
  RefferalAPI.ReferralRebateSummary[] | undefined
> => {
  const {
    userId,
    getAuthHeaders,
    dashboardData,
    dashboardLoaded,
    isLoading: providerLoading,
  } = useReferralContext();

  const [commissionRange, setCommissionRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 90),
      to: subDays(new Date(), 1),
    },
  );

  const isLG = useMediaQuery("(max-width: 767px)");
  const {
    page,
    pageSize,
    setPage: _setPage,
    parsePagination,
  } = usePagination();

  // Whether the user has explicitly changed pagination or date range.
  // When true we always fetch from the individual API (signs once per action).
  const [userInteracted, setUserInteracted] = useState(false);

  // Local API state (only used after user interaction)
  const [localApiData, setLocalApiData] = useState<CommissionHistoryItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [localMeta, setLocalMeta] = useState({
    total: 0,
    current_page: 1,
    records_per_page: 10,
  });

  // Wrap setPage so user-driven pagination triggers a fresh fetch
  const setPage = useCallback(
    (p: number) => {
      setUserInteracted(true);
      _setPage(p);
    },
    [_setPage],
  );

  const handleSetDateRange: React.Dispatch<
    React.SetStateAction<DateRange | undefined>
  > = useCallback((action) => {
    setUserInteracted(true);
    setCommissionRange(action);
  }, []);

  const fetchCommissionHistory = useCallback(async () => {
    if (!userId || !getAuthHeaders) return;
    setApiLoading(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        setLocalApiData([]);
        return;
      }
      const response = await commissionApi.getCommissionHistory(
        userId,
        {
          startDate: commissionRange?.from
            ? format(commissionRange.from, "yyyy-MM-dd")
            : undefined,
          endDate: commissionRange?.to
            ? format(commissionRange.to, "yyyy-MM-dd")
            : undefined,
          page: !isLG ? page : undefined,
          pageSize,
        },
        headers,
      );
      setLocalApiData(response.data || []);
      setLocalMeta({
        total: response.total || 0,
        current_page: response.page || 1,
        records_per_page: response.page_size || pageSize,
      });
    } catch {
      setLocalApiData([]);
    } finally {
      setApiLoading(false);
    }
  }, [userId, getAuthHeaders, commissionRange, page, pageSize, isLG]);

  // Fetch from individual API only when:
  // a) user has interacted (changed page / date range), OR
  // b) dashboardLoaded but no dashboardData (aggregate API unavailable → fallback)
  useEffect(() => {
    if (userInteracted) {
      fetchCommissionHistory();
      return;
    }
    if (dashboardLoaded && !dashboardData) {
      fetchCommissionHistory();
    }
  }, [userInteracted, dashboardLoaded, dashboardData, fetchCommissionHistory]);

  // Reset to page 1 when date range changes (user-initiated; setPage already sets flag)
  useEffect(() => {
    if (userInteracted) _setPage(1);
  }, [commissionRange, userInteracted, _setPage]);

  // Active data: context items for initial view, local items after user interacts
  const contextItems = dashboardData?.commission_history?.items || [];
  const contextPagination = dashboardData?.commission_history?.pagination;

  const apiData = userInteracted ? localApiData : contextItems;
  const apiMeta = userInteracted
    ? localMeta
    : {
        total: contextPagination?.total ?? 0,
        current_page: contextPagination?.page ?? 1,
        records_per_page: contextPagination?.page_size ?? pageSize,
      };

  // Legacy Orderly API (回退: only shown when both our APIs return nothing)
  const [
    commissionData,
    { refresh, isLoading: orderlyLoading, loadMore, meta },
  ] = useReferralRebateSummary({
    startDate:
      commissionRange?.from !== undefined
        ? format(commissionRange.from, "yyyy-MM-dd")
        : undefined,
    endDate:
      commissionRange?.to !== undefined
        ? format(commissionRange.to, "yyyy-MM-dd")
        : undefined,
    size: pageSize,
    page: !isLG ? page : undefined,
  });

  const pagination = useMemo(() => {
    if (apiData.length > 0) return parsePagination(apiMeta);
    return parsePagination(meta);
  }, [parsePagination, apiData.length, apiMeta, meta]);

  // Convert orderly_refer format → UI-expected format
  const finalData = useMemo(() => {
    if (apiData.length > 0) {
      return apiData.map((item) => ({
        date: item.date,
        referral_rebate: item.referral_rebate,
        volume: item.referral_volume,
        daily_traded_referral: item.total_traded,
      })) as unknown as RefferalAPI.ReferralRebateSummary[];
    }
    return commissionData || undefined;
  }, [apiData, commissionData]);

  return {
    data: finalData,
    pagination,
    dateRange: commissionRange,
    setDateRange: handleSetDateRange,
    isLoading:
      apiLoading ||
      (userInteracted ? false : providerLoading) ||
      orderlyLoading,
    loadMore,
  };
};

const useRefereesDataScript = (): ListReturns<
  RefferalAPI.RefereeInfoItem[] | undefined,
  ReferralDetailItem[]
> => {
  const {
    userId,
    getAuthHeaders,
    dashboardData,
    dashboardLoaded,
    isLoading: providerLoading,
  } = useReferralContext();

  const [commissionRange, setCommissionRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 90),
      to: subDays(new Date(), 1),
    },
  );

  const isLG = useMediaQuery("(max-width: 767px)");
  const {
    page,
    pageSize,
    setPage: _setPage,
    parsePagination,
  } = usePagination();

  const [userInteracted, setUserInteracted] = useState(false);

  const [localApiData, setLocalApiData] = useState<ReferralDetailItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [localMeta, setLocalMeta] = useState({
    total: 0,
    current_page: 1,
    records_per_page: 10,
  });

  const setPage = useCallback(
    (p: number) => {
      setUserInteracted(true);
      _setPage(p);
    },
    [_setPage],
  );

  const handleSetDateRange: React.Dispatch<
    React.SetStateAction<DateRange | undefined>
  > = useCallback((action) => {
    setUserInteracted(true);
    setCommissionRange(action);
  }, []);

  const fetchReferralsDetail = useCallback(async () => {
    if (!userId || !getAuthHeaders) return;
    setApiLoading(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        setLocalApiData([]);
        return;
      }
      const response = await userApi.getReferralsDetail(
        userId,
        !isLG ? page : 1,
        pageSize,
        headers,
      );
      setLocalApiData(response.referrals || []);
      setLocalMeta({
        total: response.total || 0,
        current_page: response.page || 1,
        records_per_page: response.page_size || pageSize,
      });
    } catch {
      setLocalApiData([]);
    } finally {
      setApiLoading(false);
    }
  }, [userId, getAuthHeaders, page, pageSize, isLG]);

  useEffect(() => {
    if (userInteracted) {
      fetchReferralsDetail();
      return;
    }
    if (dashboardLoaded && !dashboardData) {
      fetchReferralsDetail();
    }
  }, [userInteracted, dashboardLoaded, dashboardData, fetchReferralsDetail]);

  useEffect(() => {
    if (userInteracted) _setPage(1);
  }, [commissionRange, userInteracted, _setPage]);

  // Active data
  const contextItems = dashboardData?.referrals_detail?.items || [];
  const contextPagination = dashboardData?.referrals_detail?.pagination;

  const apiData = userInteracted ? localApiData : contextItems;
  const apiMeta = userInteracted
    ? localMeta
    : {
        total: contextPagination?.total ?? 0,
        current_page: contextPagination?.page ?? 1,
        records_per_page: contextPagination?.page_size ?? pageSize,
      };

  // Legacy Orderly API (回退)
  const [
    commissionData,
    { refresh, isLoading: orderlyLoading, loadMore, meta },
  ] = useRefereeInfo({
    startDate:
      commissionRange?.from !== undefined
        ? format(commissionRange.from, "yyyy-MM-dd")
        : undefined,
    endDate:
      commissionRange?.to !== undefined
        ? format(commissionRange.to, "yyyy-MM-dd")
        : undefined,
    size: pageSize,
    page: !isLG ? page : undefined,
    sort: "descending_code_binding_time",
  });

  const pagination = useMemo(() => {
    if (apiData.length > 0) return parsePagination(apiMeta);
    return parsePagination(meta);
  }, [parsePagination, apiData.length, apiMeta, meta]);

  // Convert orderly_refer → UI-expected format
  const finalData = useMemo(() => {
    if (apiData.length > 0) {
      return apiData.map((item) => ({
        user_address: item.wallet_address,
        referral_code: item.referral_code_str || "",
        referral_rebate: item.total_commission,
        volume: item.total_volume,
        code_binding_time: item.created_at
          ? new Date(item.created_at * 1000).toISOString()
          : "",
      })) as unknown as RefferalAPI.RefereeInfoItem[];
    }
    return commissionData || undefined;
  }, [apiData, commissionData]);

  return {
    data: finalData as RefferalAPI.RefereeInfoItem[] | undefined,
    rawData: apiData as ReferralDetailItem[],
    pagination,
    dateRange: commissionRange,
    setDateRange: handleSetDateRange,
    isLoading:
      apiLoading ||
      (userInteracted ? false : providerLoading) ||
      orderlyLoading,
    loadMore,
    refresh: fetchReferralsDetail,
  };
};

const useSubAgentDataScript = (): SubAgentReturns => {
  const {
    userId,
    isTopLevelAgent,
    getAuthHeaders,
    dashboardData,
    dashboardLoaded,
    isLoading: providerLoading,
  } = useReferralContext();

  const [localData, setLocalData] = useState<SubAffiliateItem[] | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userRefreshed, setUserRefreshed] = useState(false);

  const { page, pageSize, parsePagination } = usePagination();

  const fetchSubAgents = useCallback(async () => {
    if (!userId || !isTopLevelAgent || !getAuthHeaders) {
      setLocalData(undefined);
      return;
    }

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        setLocalData([]);
        return;
      }
      const response = await userApi.getSubAffiliates(userId, headers);
      setLocalData(response.sub_affiliates || []);
    } catch (error) {
      console.error("Failed to fetch sub-agents:", error);
      setLocalData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isTopLevelAgent, getAuthHeaders]);

  // Fetch when: explicit refresh triggered, OR fallback (aggregate not available)
  useEffect(() => {
    if (userRefreshed) {
      fetchSubAgents();
      return;
    }
    if (dashboardLoaded && !dashboardData) {
      fetchSubAgents();
    }
  }, [userRefreshed, dashboardLoaded, dashboardData, fetchSubAgents]);

  const contextItems = dashboardData?.sub_affiliates?.items;
  const activeData = userRefreshed ? localData : contextItems;

  const pagination = useMemo(
    () =>
      parsePagination({
        total: activeData?.length || 0,
        current_page: page,
        records_per_page: pageSize,
      }),
    [parsePagination, activeData?.length, page, pageSize],
  );

  return {
    data: activeData,
    isLoading: isLoading || (!userRefreshed && providerLoading),
    pagination,
    refresh: () => {
      setUserRefreshed(true);
      fetchSubAgents();
    },
  };
};
