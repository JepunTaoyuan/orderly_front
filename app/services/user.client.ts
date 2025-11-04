// app/services/user.server.ts
import { api } from "./api-refer-client";

// ==================== 型別定義 ====================

/**
 * 創建用戶請求
 */
export interface CreateUserRequest {
  user_id: string;
  wallet_address: string;
  used_referral_code?: string;
}

/**
 * 用戶回應
 */
export interface UserResponse {
  user_id: string;
  wallet_address: string;
  is_affiliate: boolean;
  used_referral_code?: string;
  parent_affiliate_id?: string;
  max_referral_rate?: number;
  is_admin: boolean;
}

/**
 * 用戶角色回應
 */
export interface UserRoleResponse {
  user_id: string;
  is_affiliate: boolean;
  is_admin: boolean;
}

/**
 * 分頁參數
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * 分頁回應
 */
export interface PaginatedReferralsResponse {
  referrals: UserResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ==================== User Service ====================

export const userService = {
  /**
   * 創建用戶
   * POST /users/
   */
  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return api.post<UserResponse>("/users", data);
  },

  /**
   * 檢查用戶是否存在
   * GET /users/{user_id}/exist
   */
  async checkUserExist(userId: string): Promise<boolean> {
    return api.get<boolean>(`/users/${userId}/exist`);
  },

  /**
   * 獲取用戶信息
   * GET /users/{user_id}
   * 需要認證
   */
  async getUser(userId: string, token: string): Promise<UserResponse> {
    return api.get<UserResponse>(`/users/${userId}`, token);
  },

  /**
   * 升級用戶為 affiliate (Admin Only)
   * POST /users/{user_id}/upgrade
   * 需要 admin 權限
   */
  async upgradeToAffiliate(
    userId: string,
    token: string,
  ): Promise<UserResponse> {
    return api.post<UserResponse>(`/users/${userId}/upgrade`, {}, token);
  },

  /**
   * Affiliate 升級自己的直接下級為子 affiliate
   * POST /users/affiliates/{affiliate_id}/upgrade-referral/{user_id}
   * 需要 affiliate 權限
   */
  async upgradeReferralToAffiliate(
    affiliateId: string,
    userId: string,
    token: string,
  ): Promise<UserResponse> {
    return api.post<UserResponse>(
      `/users/affiliates/${affiliateId}/upgrade-referral/${userId}`,
      {},
      token,
    );
  },

  /**
   * 獲取 Affiliate 的所有直接下級用戶(帶分頁)
   * GET /users/affiliates/{affiliate_id}/referrals
   * 需要 affiliate 權限
   */
  async getAffiliateReferrals(
    affiliateId: string,
    pagination: PaginationParams = {},
    token: string,
  ): Promise<PaginatedReferralsResponse> {
    const params = new URLSearchParams();

    if (pagination.page) {
      params.append("page", String(pagination.page));
    }
    if (pagination.page_size) {
      params.append("page_size", String(pagination.page_size));
    }

    const queryString = params.toString();
    const endpoint = `/users/affiliates/${affiliateId}/referrals${queryString ? `?${queryString}` : ""}`;

    return api.get<PaginatedReferralsResponse>(endpoint, token);
  },

  /**
   * 獲取用戶角色(測試用,不需要認證)
   * GET /users/users/{user_id}/role
   */
  async getUserRole(userId: string): Promise<UserRoleResponse> {
    return api.get<UserRoleResponse>(`/users/${userId}/role`);
  },
};
