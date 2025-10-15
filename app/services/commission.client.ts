import { api } from "./api-refer-client";

// ==================== 型別定義 ====================

/**
 * 用戶返佣回應
 */
export interface UserCommissionResponse {
  user_id: string;
  total_commission_and_discount: number;
  weekly_commission_and_discount: number;
}

// ==================== Commission Service ====================

export const commissionService = {
  /**
   * 獲取用戶返佣信息
   * GET /commission/{user_id}
   * 無需認證
   */
  async getUserCommission(user_id: string): Promise<UserCommissionResponse> {
    return api.get<UserCommissionResponse>(`/commission/${user_id}`);
  },
};
