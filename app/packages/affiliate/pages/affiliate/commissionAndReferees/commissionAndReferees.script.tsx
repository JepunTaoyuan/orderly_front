import { useCallback, useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import {
  RefferalAPI,
  useMediaQuery,
  useRefereeInfo,
  useReferralRebateSummary,
} from "@orderly.network/hooks";
import { PaginationMeta, usePagination } from "@orderly.network/ui";
import { SubAffiliateItem } from "@/services/api-refer-client";
import { userApi } from "@/services/user.client";
import { useReferralContext } from "../../../provider/context";
import { DateRange } from "../../../utils/types";

export type ListReturns<T> = {
  data: T;
  dateRange?: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  isLoading?: boolean;
  loadMore?: () => void;
  pagination: PaginationMeta;
};

export type SubAgentReturns = {
  data: SubAffiliateItem[] | undefined;
  isLoading?: boolean;
  pagination: PaginationMeta;
  refresh: () => void;
};

export type CommissionAndRefereesReturns = {
  commission: ListReturns<RefferalAPI.ReferralRebateSummary[] | undefined>;
  referees: ListReturns<RefferalAPI.RefereeInfoItem[] | undefined>;
  subAgents: SubAgentReturns;
};

export const useCommissionAndRefereesScript =
  (): CommissionAndRefereesReturns => {
    const commission = useCommissionDataScript();
    const referees = useRefereesDataScript();
    const subAgents = useSubAgentDataScript();

    return {
      commission,
      referees,
      subAgents,
    };
  };

const useCommissionDataScript = (): ListReturns<
  RefferalAPI.ReferralRebateSummary[] | undefined
> => {
  const [commissionRange, setCommissionRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 90),
      to: subDays(new Date(), 1),
    },
  );

  const isLG = useMediaQuery("(max-width: 767px)");

  const { page, pageSize, setPage, parsePagination } = usePagination();

  const [commissionData, { refresh, isLoading, loadMore, meta }] =
    useReferralRebateSummary({
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

  // const loadMore = () => {
  //   setPage(page + 1);
  // };

  const pagination = useMemo(
    () => parsePagination(meta),
    [parsePagination, meta],
  );

  useEffect(() => {
    setPage(1);
  }, [commissionRange]);

  return {
    data: commissionData || undefined,
    pagination,
    dateRange: commissionRange,
    setDateRange: setCommissionRange,
    isLoading,
    loadMore,
  };
};

const useRefereesDataScript = (): ListReturns<
  RefferalAPI.RefereeInfoItem[] | undefined
> => {
  const [commissionRange, setCommissionRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 90),
      to: subDays(new Date(), 1),
    },
  );

  const isLG = useMediaQuery("(max-width: 767px)");

  const { page, pageSize, setPage, parsePagination } = usePagination();

  const [commissionData, { refresh, isLoading, loadMore, meta }] =
    useRefereeInfo({
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

  // const loadMore = () => {
  //   setPage(page + 1);
  // };

  const pagination = useMemo(
    () => parsePagination(meta),
    [parsePagination, meta],
  );

  useEffect(() => {
    setPage(1);
  }, [commissionRange]);

  return {
    data: commissionData || undefined,
    pagination,
    dateRange: commissionRange,
    setDateRange: setCommissionRange,
    isLoading,
    loadMore,
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
