// Hook for fetching Points leaderboard data from the referral backend
import { useState, useEffect, useCallback } from "react";
import {
  LeaderboardEntry,
  WeeklyLeaderboardEntry,
} from "@/services/api-refer-client";
import { pointsApi } from "@/services/points.client";

export type PointsLeaderboardType = "total" | "weekly";

export interface UsePointsLeaderboardOptions {
  type?: PointsLeaderboardType;
  limit?: number;
  weekStartMs?: number;
}

export interface UsePointsLeaderboardReturn {
  data: LeaderboardEntry[] | WeeklyLeaderboardEntry[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  weekStart?: number;
  totalUsers: number;
}

export function usePointsLeaderboard(
  options: UsePointsLeaderboardOptions = {},
): UsePointsLeaderboardReturn {
  const { type = "total", limit = 100, weekStartMs } = options;

  const [data, setData] = useState<
    LeaderboardEntry[] | WeeklyLeaderboardEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [weekStart, setWeekStart] = useState<number | undefined>();
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === "weekly") {
        const response = await pointsApi.getWeeklyLeaderboard(
          weekStartMs,
          limit,
        );
        setData(response.leaderboard);
        setWeekStart(response.week_start);
        setTotalUsers(response.total_users);
      } else {
        const response = await pointsApi.getLeaderboard(limit);
        setData(response.leaderboard);
        setTotalUsers(response.total_users);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  }, [type, limit, weekStartMs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    weekStart,
    totalUsers,
  };
}
