import { useEffect, useState } from "react";
import { useAccount } from "@orderly.network/hooks";
import { pointsApi } from "../../../../../services/points.client";

interface ProfileData {
  name: string;
  address: string;
  overall: {
    points: number | string;
    rank: number | string;
  };
  lastWeek: {
    points: number | string;
    rank: number | string;
    volume: number | string;
    pnl: number | string;
  };
}

export const useLeaderboardProfile = () => {
  const { state } = useAccount();
  const [data, setData] = useState<ProfileData>({
    name: "--",
    address: "--",
    overall: {
      points: "--",
      rank: "--",
    },
    lastWeek: {
      points: "--",
      rank: "--",
      volume: "--",
      pnl: "--",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.address) {
      setData({
        name: "--",
        address: "--",
        overall: { points: "--", rank: "--" },
        lastWeek: { points: "--", rank: "--", volume: "--", pnl: "--" },
      });
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const address = state.address!;

        // Parallel requests
        const [userPointsRes, historyRes, leaderboardRes] = await Promise.all([
          pointsApi.getUserPoints(address),
          pointsApi.getUserWeeklyHistory(address, 2),
          pointsApi.getLeaderboard(100),
        ]);

        // Process Overall Data
        const totalPoints = userPointsRes.total_points || 0;

        let overallRank: string | number = "100+";
        if (leaderboardRes.success && leaderboardRes.leaderboard) {
          const rankIndex = leaderboardRes.leaderboard.findIndex(
            (entry) => entry.user_id === address,
          );
          if (rankIndex !== -1) {
            overallRank = rankIndex + 1;
          }
        }

        // Process Last Week Data
        let lastWeekPoints: number | string = 0;
        let lastWeekRank: number | string = "100+";
        let lastWeekVolume: number | string = 0;
        let lastWeekPnl: number | string = 0;

        const historyData = historyRes.data || [];
        // Assuming history[1] is the last completed week if history[0] is current
        const lastWeekEntry = historyData.length > 1 ? historyData[1] : null;

        if (lastWeekEntry) {
          lastWeekPoints = lastWeekEntry.weekly_points;
          lastWeekVolume = lastWeekEntry.weekly_volume || 0;
          lastWeekPnl = lastWeekEntry.weekly_positive_pnl || 0;

          // Fetch rank for that specific week
          try {
            const weeklyLbRes = await pointsApi.getWeeklyLeaderboard(
              lastWeekEntry.week_start,
              100,
            );
            if (weeklyLbRes.success && weeklyLbRes.leaderboard) {
              const rankIndex = weeklyLbRes.leaderboard.findIndex(
                (entry) => entry.user_id === address,
              );
              if (rankIndex !== -1) {
                lastWeekRank = rankIndex + 1;
              }
            }
          } catch (err) {
            console.error("Failed to fetch weekly leaderboard", err);
          }
        }

        setData({
          name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          address: address,
          overall: {
            points: totalPoints,
            rank: overallRank,
          },
          lastWeek: {
            points: lastWeekPoints,
            rank: lastWeekRank,
            volume: lastWeekVolume,
            pnl: lastWeekPnl,
          },
        });
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [state.address]);

  return {
    data,
    isLoading,
  };
};
