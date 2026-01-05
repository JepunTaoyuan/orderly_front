import { useCallback, useEffect, useMemo, useState } from "react";
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
  PaginatedReferralDetailResponse,
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
  const { userId } = useReferralContext();
  const [commissionRange, setCommissionRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 90),
      to: subDays(new Date(), 1),
    },
  );

  const isLG = useMediaQuery("(max-width: 767px)");

  const { page, pageSize, setPage, parsePagination } = usePagination();

  // orderly_refer API 數據
  const [apiData, setApiData] = useState<CommissionHistoryItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiMeta, setApiMeta] = useState({
    total: 0,
    current_page: 1,
    records_per_page: 10,
  });

  const fetchCommissionHistory = useCallback(async () => {
    if (!userId) return;
    setApiLoading(true);
    try {
      const response = await commissionApi.getCommissionHistory(userId, {
        startDate: commissionRange?.from
          ? format(commissionRange.from, "yyyy-MM-dd")
          : undefined,
        endDate: commissionRange?.to
          ? format(commissionRange.to, "yyyy-MM-dd")
          : undefined,
        page: !isLG ? page : undefined,
        pageSize,
      });
      setApiData(response.data || []);
      setApiMeta({
        total: response.total || 0,
        current_page: response.page || 1,
        records_per_page: response.page_size || pageSize,
      });
    } catch {
      setApiData([]);
    } finally {
      setApiLoading(false);
    }
  }, [userId, commissionRange, page, pageSize, isLG]);

  useEffect(() => {
    fetchCommissionHistory();
  }, [fetchCommissionHistory]);

  // Legacy Orderly API (回退)
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

  useEffect(() => {
    refresh();
  }, [commissionRange]);

  const pagination = useMemo(() => {
    // 優先使用 orderly_refer API 的分頁
    if (apiData.length > 0) {
      return parsePagination(apiMeta);
    }
    return parsePagination(meta);
  }, [parsePagination, apiData.length, apiMeta, meta]);

  useEffect(() => {
    setPage(1);
  }, [commissionRange]);

  // 轉換數據格式以兼容現有組件
  const finalData = useMemo(() => {
    if (apiData.length > 0) {
      // 轉換 orderly_refer 數據為 Orderly API 格式
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
    setDateRange: setCommissionRange,
    isLoading: apiLoading || orderlyLoading,
    loadMore,
  };
};

const useRefereesDataScript = (): ListReturns<
  RefferalAPI.RefereeInfoItem[] | undefined
> => {
  const { userId } = useReferralContext();
  const [commissionRange, setCommissionRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 90),
      to: subDays(new Date(), 1),
    },
  );

  const isLG = useMediaQuery("(max-width: 767px)");

  const { page, pageSize, setPage, parsePagination } = usePagination();

  // orderly_refer API 數據
  const [apiData, setApiData] = useState<ReferralDetailItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiMeta, setApiMeta] = useState({
    total: 0,
    current_page: 1,
    records_per_page: 10,
  });

  const fetchReferralsDetail = useCallback(async () => {
    if (!userId) return;
    setApiLoading(true);
    try {
      const response = await userApi.getReferralsDetail(
        userId,
        !isLG ? page : 1,
        pageSize,
      );
      setApiData(response.referrals || []);
      setApiMeta({
        total: response.total || 0,
        current_page: response.page || 1,
        records_per_page: response.page_size || pageSize,
      });
    } catch {
      setApiData([]);
    } finally {
      setApiLoading(false);
    }
  }, [userId, page, pageSize, isLG]);

  useEffect(() => {
    fetchReferralsDetail();
  }, [fetchReferralsDetail]);

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

  useEffect(() => {
    refresh();
  }, [commissionRange]);

  const pagination = useMemo(() => {
    // 優先使用 orderly_refer API 的分頁
    if (apiData.length > 0) {
      return parsePagination(apiMeta);
    }
    return parsePagination(meta);
  }, [parsePagination, apiData.length, apiMeta, meta]);

  useEffect(() => {
    setPage(1);
  }, [commissionRange]);

  // 轉換數據格式 (orderly_refer -> UI 期望格式)
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
    data: finalData,
    rawData: apiData, // 原始 ReferralDetailItem[] 用於 Edit modal
    pagination,
    dateRange: commissionRange,
    setDateRange: setCommissionRange,
    isLoading: apiLoading || orderlyLoading,
    loadMore,
    refresh: fetchReferralsDetail,
  };
};

const useSubAgentDataScript = (): SubAgentReturns => {
  const { userId, isTopLevelAgent } = useReferralContext();
  const [data, setData] = useState<SubAffiliateItem[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { page, pageSize, parsePagination } = usePagination();

  const fetchSubAgents = useCallback(async () => {
    if (!userId || !isTopLevelAgent) {
      setData(undefined);
      return;
    }

    setIsLoading(true);
    try {
      const response = await userApi.getSubAffiliates(userId);
      setData(response.sub_affiliates || []);
    } catch (error) {
      console.error("Failed to fetch sub-agents:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isTopLevelAgent]);

  useEffect(() => {
    fetchSubAgents();
  }, [fetchSubAgents]);

  const pagination = useMemo(
    () =>
      parsePagination({
        total: data?.length || 0,
        current_page: page,
        records_per_page: pageSize,
      }),
    [parsePagination, data?.length, page, pageSize],
  );

  return {
    data,
    isLoading,
    pagination,
    refresh: fetchSubAgents,
  };
};
