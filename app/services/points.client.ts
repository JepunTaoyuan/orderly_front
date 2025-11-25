// app/services/points.client.ts
import { api } from "./api-refer-client";

// ==================== 型別定義 ====================

/**
 * 用戶點數回應
 */
export interface UserPointsResponse {
  user_id: string;
  weekly_points: number;
  total_points: number;
}

/**
 * 計算點數回應
 */
export interface CalculatePointsResponse {
  user_id: string;
  weekly_points: number;
  success: boolean;
  message: string;
}

/**
 * 保存點數請求
 */
export interface SavePointsRequest {
  weekly_points: number;
}

/**
 * 保存點數回應
 */
export interface SavePointsResponse {
  user_id: string;
  weekly_points: number;
  success: boolean;
  message: string;
}

/**
 * 批量操作回應
 */
export interface BatchOperationResponse {
  total_users: number;
  computed_users: number;
  skipped_no_credentials: number;
  failed_count: number;
  saved_count: number;
  total_points: number;
  processing_time: number;
  success: boolean;
  message: string;
}

/**
 * 排行榜條目
 */
export interface LeaderboardEntry {
  user_id: string;
  total_points: number;
}

/**
 * 排行榜回應
 */
export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total_users: number;
  success: boolean;
  message: string;
}

// ==================== Points Service ====================

export const pointsService = {
  /**
   * 獲取用戶點數（公開端點，無需認證）
   * GET /points/{user_id}
   */
  async getUserPoints(userId: string): Promise<UserPointsResponse> {
    return api.get<UserPointsResponse>(`/points/${userId}`);
  },

  /**
   * 獲取總點數排行榜（公開端點，無需認證）
   * GET /points/leaderboard?limit=10
   */
  async getLeaderboard(limit: number = 10): Promise<LeaderboardResponse> {
    const params = new URLSearchParams();
    params.append("limit", String(limit));

    const queryString = params.toString();
    const endpoint = `/points/leaderboard${queryString ? `?${queryString}` : ""}`;

    return api.get<LeaderboardResponse>(endpoint);
  },

  /**
   * 計算指定用戶的週點數（管理員專用）
   * POST /points/{user_id}/calculate
   * 需要 admin 權限
   */
  async calculateUserPoints(
    userId: string,
    token: string,
  ): Promise<CalculatePointsResponse> {
    return api.post<CalculatePointsResponse>(
      `/points/${userId}/calculate`,
      {},
      token,
    );
  },

  /**
   * 保存指定用戶的點數（管理員專用）
   * POST /points/{user_id}/save
   * 需要 admin 權限
   */
  async saveUserPoints(
    userId: string,
    weeklyPoints: number,
    token: string,
  ): Promise<SavePointsResponse> {
    const data: SavePointsRequest = {
      weekly_points: weeklyPoints,
    };

    return api.post<SavePointsResponse>(`/points/${userId}/save`, data, token);
  },

  /**
   * 計算並保存指定用戶的點數（管理員專用）
   * POST /points/{user_id}/calculate-and-save
   * 需要 admin 權限
   */
  async calculateAndSaveUserPoints(
    userId: string,
    token: string,
  ): Promise<SavePointsResponse> {
    return api.post<SavePointsResponse>(
      `/points/${userId}/calculate-and-save`,
      {},
      token,
    );
  },

  /**
   * 批量計算所有用戶的週點數（管理員專用）
   * POST /points/calculate-all
   * 需要 admin 權限
   */
  async calculateAllUsersPoints(
    token: string,
  ): Promise<BatchOperationResponse> {
    return api.post<BatchOperationResponse>("/points/calculate-all", {}, token);
  },

  /**
   * 批量計算並保存所有用戶的點數（管理員專用）
   * POST /points/calculate-and-save-all
   * 需要 admin 權限
   */
  async calculateAndSaveAllUsersPoints(
    token: string,
  ): Promise<BatchOperationResponse> {
    return api.post<BatchOperationResponse>(
      "/points/calculate-and-save-all",
      {},
      token,
    );
  },
};
