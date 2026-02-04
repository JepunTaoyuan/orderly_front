// app/services/points.client.ts
// Points-related API endpoints
import {
  api,
  UserPointsResponse,
  LeaderboardResponse,
  CalculatePointsResponse,
  SavePointsRequest,
  SavePointsResponse,
  BatchOperationResponse,
  MessageResponse,
  WeeklyLeaderboardResponse,
  WeeklyHistoryResponse,
} from "./api-refer-client";

export const pointsApi = {
  // Get user points
  getUserPoints: (userId: string, token?: string) =>
    api.get<UserPointsResponse>(`/points/${userId}`, token),

  // Get leaderboard (total points)
  getLeaderboard: (limit: number = 100, token?: string) =>
    api.get<LeaderboardResponse>(`/points/leaderboard?limit=${limit}`, token),

  // Get weekly leaderboard
  getWeeklyLeaderboard: (
    weekStartMs?: number,
    limit: number = 10,
    token?: string,
  ) =>
    api.get<WeeklyLeaderboardResponse>(
      `/points/weekly-leaderboard?${weekStartMs ? `week_start_ms=${weekStartMs}&` : ""}limit=${limit}`,
      token,
    ),

  // Get user weekly history
  getUserWeeklyHistory: (
    userId: string,
    limit: number = 52,
    startWeekMs?: number,
    endWeekMs?: number,
    token?: string,
  ) => {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    if (startWeekMs) params.set("start_week_ms", startWeekMs.toString());
    if (endWeekMs) params.set("end_week_ms", endWeekMs.toString());
    return api.get<WeeklyHistoryResponse>(
      `/points/${userId}/weekly-history?${params.toString()}`,
      token,
    );
  },

  // Calculate points for a user (admin)
  calculate: (userId: string, token?: string) =>
    api.post<CalculatePointsResponse>(`/points/${userId}/calculate`, {}, token),

  // Save points for a user (admin)
  save: (userId: string, data: SavePointsRequest, token?: string) =>
    api.post<SavePointsResponse>(`/points/${userId}/save`, data, token),

  // Calculate points for all users (admin) - does not save
  calculateAll: (token?: string) =>
    api.post<BatchOperationResponse>("/points/calculate-all", {}, token),

  // Calculate and save points for all users (admin)
  calculateAndSaveAll: (token?: string) =>
    api.post<BatchOperationResponse>(
      "/points/calculate-and-save-all",
      {},
      token,
    ),

  // Reset weekly points for all users (admin)
  // WARNING: This endpoint is NOT implemented in the backend yet
  // resetWeekly: (token?: string) =>
  //   api.post<MessageResponse>("/points/reset-weekly", {}, token),

  // Reset all points (admin - dangerous)
  // WARNING: This endpoint is NOT implemented in the backend yet
  // resetAll: (token?: string) =>
  //   api.post<MessageResponse>("/points/reset-all", {}, token),
};
