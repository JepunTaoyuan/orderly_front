import { useCallback, useEffect, useMemo, useState } from "react";
import { format, subDays, toDate } from "date-fns";
import {
  useRefereeRebateSummary,
  RefferalAPI,
  useDaily,
  useMediaQuery,
} from "@orderly.network/hooks";
import { usePagination } from "@orderly.network/ui";
import { RebateHistoryItem } from "@/services/api-refer-client";
import { commissionApi } from "@/services/commission.client";
import { useReferralContext } from "../../../provider";
import { DateRange } from "../../../utils/types";
import { compareDate, formatDateTimeToUTC } from "../../../utils/utils";

export type RebatesItem = RefferalAPI.RefereeRebateSummary & {
  vol?: number;
};

export const useRebatesScript = () => {
  const { userId, dailyVolumeData } = useReferralContext();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: subDays(new Date(), 1),
  });

  const isLG = useMediaQuery("(max-width: 767px)");
  const { page, pageSize, setPage, parsePagination } = usePagination();

  // orderly_refer API 數據
  const [apiData, setApiData] = useState<RebateHistoryItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiMeta, setApiMeta] = useState({
    total: 0,
    current_page: 1,
    records_per_page: 10,
  });

  const fetchRebateHistory = useCallback(async () => {
    if (!userId) return;
    setApiLoading(true);
    try {
      const response = await commissionApi.getRebateHistory(userId, {
        startDate: dateRange?.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : undefined,
        endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
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
  }, [userId, dateRange, page, pageSize, isLG]);

  useEffect(() => {
    fetchRebateHistory();
  }, [fetchRebateHistory]);

  // Legacy Orderly API (回退)
  const {
    data: distributionData,
    mutate,
    isLoading: orderlyLoading,
  } = useRefereeRebateSummary({
    startDate: dateRange?.from,
    endDate: dateRange?.to,
  });

  const { data: dailyVolume, mutate: dailyVolumeMutate } = useDaily({
    startDate: dateRange?.to,
    endDate: dateRange?.from,
  });

  const dataSource = useMemo((): RebatesItem[] => {
    // 優先使用 orderly_refer API
    if (apiData.length > 0) {
      return apiData.map((item) => {
        const createdTime = item.date;
        // 優先使用 orderly_refer dailyVolumeData
        const volumeFromApi = dailyVolumeData?.find(
          (v) => v.date === createdTime,
        );
        if (volumeFromApi) {
          return {
            date: item.date,
            referee_rebate: item.referee_rebate,
            vol: volumeFromApi.volume,
          } as RebatesItem;
        }
        // 回退到 Orderly dailyVolume
        const volume = dailyVolume?.filter((v) => {
          return compareDate(toDate(createdTime), toDate(v.date));
        })?.[0];
        if (volume) {
          return {
            date: item.date,
            referee_rebate: item.referee_rebate,
            vol: volume.perp_volume,
          } as RebatesItem;
        }
        return {
          date: item.date,
          referee_rebate: item.referee_rebate,
        } as RebatesItem;
      });
    }

    // 回退到 Orderly API
    if (typeof distributionData === "undefined") return [];

    return distributionData.map((item) => {
      const createdTime = item.date;

      const volume = dailyVolume?.filter((v) => {
        return compareDate(toDate(createdTime), toDate(v.date));
      })?.[0];
      if (volume) {
        return { ...item, vol: volume.perp_volume };
      }

      return item;
    });
  }, [apiData, distributionData, dailyVolumeData, dailyVolume]);

  let displayDate = undefined;
  if ((dataSource?.length || 0) > 0) {
    displayDate = formatDateTimeToUTC(dataSource?.[0].date);
  }

  const pagination = useMemo(() => {
    // 優先使用 orderly_refer API 的分頁
    if (apiData.length > 0) {
      return parsePagination(apiMeta);
    }
    return parsePagination({
      total: dataSource.length,
      current_page: page,
      records_per_page: pageSize,
    });
  }, [
    parsePagination,
    apiData.length,
    apiMeta,
    dataSource.length,
    page,
    pageSize,
  ]);

  useEffect(() => {
    setPage(1);
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    displayDate,
    dataSource,
    pagination,
    isLoading: apiLoading || orderlyLoading,
  };
};

export type RebatesReturns = ReturnType<typeof useRebatesScript>;
