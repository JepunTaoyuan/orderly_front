// Hook for fetching user's weekly points history with volume and PnL data
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount } from "@orderly.network/hooks";
import { usePagination, PaginationMeta } from "@orderly.network/ui";
import { WeeklyHistoryItem } from "@/services/api-refer-client";
import { pointsApi } from "@/services/points.client";

export interface MyPointsData {
  time: string;
  weekStart: number;
  volume: number;
  pnl: number;
  points: number;
}

export interface UseMyPointsScriptReturn {
  data: MyPointsData[];
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  userId: string | undefined;
  refetch: () => Promise<void>;
  pagination: PaginationMeta;
}

export function useMyPointsScript(options?: {
  pageSize?: number;
}): UseMyPointsScriptReturn {
  const { pageSize = 10 } = options || {};
  const { state } = useAccount();
  const userId = state.address;
  const isConnected = !!userId;

  const [rawData, setRawData] = useState<WeeklyHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { page, setPage, parsePagination } = usePagination({
    pageSize,
  });

  const fetchData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await pointsApi.getUserWeeklyHistory(userId, 104); // Get up to 2 years of weekly data
      setRawData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isConnected) {
      fetchData();
    } else {
      setRawData([]);
    }
  }, [isConnected, fetchData]);

  // Format data for display
  const formattedData = useMemo<MyPointsData[]>(() => {
    return rawData.map((item) => {
      const date = new Date(item.week_start);
      const timeStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

      return {
        time: timeStr,
        weekStart: item.week_start,
        volume: item.weekly_volume ?? 0,
        pnl: item.weekly_positive_pnl ?? 0,
        points: item.weekly_points,
      };
    });
  }, [rawData]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return formattedData.slice(startIndex, endIndex);
  }, [formattedData, page, pageSize]);

  const pagination = useMemo(
    () =>
      parsePagination({
        total: formattedData.length,
        current_page: page,
        records_per_page: pageSize,
      }),
    [parsePagination, formattedData.length, page, pageSize],
  );

  return {
    data: paginatedData,
    isLoading,
    error,
    isConnected,
    userId,
    refetch: fetchData,
    pagination,
  };
}
