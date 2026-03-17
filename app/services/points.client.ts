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
import type { AuthHeaders } from "./api-refer-client";

export const pointsApi = {
  // Get user points
  getUserPoints: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<UserPointsResponse>(`/points/${userId}`, authHeaders),

  // Get leaderboard (total points)
  getLeaderboard: (limit: number = 100, authHeaders?: AuthHeaders) =>
    api.get<LeaderboardResponse>(
      `/points/leaderboard?limit=${limit}`,
      authHeaders,
    ),

  // Get weekly leaderboard
  getWeeklyLeaderboard: (
    weekStartMs?: number,
    limit: number = 10,
    authHeaders?: AuthHeaders,
  ) =>
    api.get<WeeklyLeaderboardResponse>(
      `/points/weekly-leaderboard?${weekStartMs ? `week_start_ms=${weekStartMs}&` : ""}limit=${limit}`,
      authHeaders,
    ),

  // Get user weekly history
  getUserWeeklyHistory: (
    userId: string,
    limit: number = 52,
    startWeekMs?: number,
    endWeekMs?: number,
    authHeaders?: AuthHeaders,
  ) => {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    if (startWeekMs) params.set("start_week_ms", startWeekMs.toString());
    if (endWeekMs) params.set("end_week_ms", endWeekMs.toString());
    return api.get<WeeklyHistoryResponse>(
      `/points/${userId}/weekly-history?${params.toString()}`,
      authHeaders,
    );
  },

  // Calculate points for a user (admin)
  calculate: (userId: string, authHeaders?: AuthHeaders) =>
    api.post<CalculatePointsResponse>(
      `/points/${userId}/calculate`,
      {},
      authHeaders,
    ),

  // Save points for a user (admin)
  save: (userId: string, data: SavePointsRequest, authHeaders?: AuthHeaders) =>
    api.post<SavePointsResponse>(`/points/${userId}/save`, data, authHeaders),

  // Calculate points for all users (admin) - does not save
  calculateAll: (authHeaders?: AuthHeaders) =>
    api.post<BatchOperationResponse>("/points/calculate-all", {}, authHeaders),

  // Calculate and save points for all users (admin)
  calculateAndSaveAll: (authHeaders?: AuthHeaders) =>
    api.post<BatchOperationResponse>(
      "/points/calculate-and-save-all",
      {},
      authHeaders,
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
