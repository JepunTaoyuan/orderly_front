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
} from "./api-refer-client";

export const pointsApi = {
  // Get user points
  getUserPoints: (userId: string, token?: string) =>
    api.get<UserPointsResponse>(`/points/${userId}`, token),

  // Get leaderboard
  getLeaderboard: (limit: number = 100, token?: string) =>
    api.get<LeaderboardResponse>(`/points/leaderboard?limit=${limit}`, token),

  // Calculate points for a user
  calculate: (userId: string, token?: string) =>
    api.post<CalculatePointsResponse>(`/points/${userId}/calculate`, {}, token),

  // Save points for a user
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
