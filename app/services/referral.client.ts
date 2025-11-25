import { api } from "./api-refer-client";

// ==================== 型別定義 ====================

/**
 * 創建普通用戶邀請碼請求
 */
export interface CreateUserReferralCodeRequest {
  user_id: string;
  custom_code?: string;
}

/**
 * 創建 Affiliate 邀請碼請求
 */
export interface CreateAffiliateReferralCodeRequest {
  affiliate_id: string;
  fee_discount_rate: number; // 0-1
  custom_code?: string;
}

/**
 * 更新邀請碼折扣請求
 */
export interface UpdateReferralCodeRequest {
  new_fee_discount_rate: number; // 0-1
}

/**
 * 重命名邀請碼請求
 */
export interface RenameReferralCodeRequest {
  new_code: string;
}

/**
 * 邀請碼回應
 */
export interface ReferralCodeResponse {
  code: string;
  owner_user_id: string;
  fee_discount_rate: number;
  owner_commission_ratio: number;
  total_commission: number;
  total_referrals: number;
}

/**
 * 驗證邀請碼回應
 */
export interface VerifyReferralCodeResponse {
  valid: boolean;
}

// ==================== Referral Code Service ====================

export const referralService = {
  /**
   * 為普通用戶創建邀請碼(使用固定配置)
   * POST /referral/user
   * 需要 user 權限
   */
  async createUserReferralCode(
    data: CreateUserReferralCodeRequest,
    token: string,
  ): Promise<ReferralCodeResponse> {
    return api.post<ReferralCodeResponse>("/referral/user", data, token);
  },

  /**
   * 為 Affiliate 創建邀請碼(允許自定義)
   * POST /referral/affiliate
   * 需要 affiliate 權限
   */
  async createAffiliateReferralCode(
    data: CreateAffiliateReferralCodeRequest,
    token: string,
  ): Promise<ReferralCodeResponse> {
    return api.post<ReferralCodeResponse>("/referral/affiliate", data, token);
  },

  /**
   * 通過邀請碼字符串獲取邀請碼信息
   * GET /referral/by-code/{code_str}
   * 無需認證
   */
  async getReferralCodeByString(
    codeStr: string,
  ): Promise<ReferralCodeResponse> {
    return api.get<ReferralCodeResponse>(`/referral/by-code/${codeStr}`);
  },

  /**
   * 通過內部ID獲取邀請碼信息
   * GET /referral/{code_id}
   * 無需認證
   */
  async getReferralCodeById(codeId: string): Promise<ReferralCodeResponse> {
    return api.get<ReferralCodeResponse>(`/referral/${codeId}`);
  },

  /**
   * 獲取用戶的所有邀請碼
   * GET /referral/user/{user_id}
   * 需要 user 權限
   */
  async getUserReferralCodes(
    userId: string,
    token: string,
  ): Promise<ReferralCodeResponse[]> {
    return api.get<ReferralCodeResponse[]>(`/referral/user/${userId}`, token);
  },

  /**
   * 更新邀請碼折扣率(僅供 Affiliate 使用)
   * PUT /referral/{code_id}/discount
   * 需要 affiliate 權限
   */
  async updateReferralCodeDiscount(
    codeStr: string,
    data: UpdateReferralCodeRequest,
    token: string,
  ): Promise<ReferralCodeResponse> {
    return api.put<ReferralCodeResponse>(
      `/referral/${codeStr}/discount`,
      data,
      token,
    );
  },

  /**
   * 重命名邀請碼(僅供 Affiliate 使用)
   * PUT /referral/{code_id}/rename
   * 需要 affiliate 權限
   */
  async renameReferralCode(
    codeStr: string,
    data: RenameReferralCodeRequest,
    token: string,
  ): Promise<ReferralCodeResponse> {
    return api.put<ReferralCodeResponse>(
      `/referral/${codeStr}/rename`,
      data,
      token,
    );
  },

  /**
   * 驗證邀請碼是否存在
   * GET /referral/verify/{code_str}
   * 無需認證
   */
  async verifyReferralCode(
    codeStr: string,
  ): Promise<VerifyReferralCodeResponse> {
    return api.get<VerifyReferralCodeResponse>(`/referral/verify/${codeStr}`);
  },
};
