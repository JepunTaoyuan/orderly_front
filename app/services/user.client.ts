// app/services/user.client.ts
// User-related API endpoints
import {
  api,
  UserResponse,
  UserRoleResponse,
  CreateUserRequest,
  UpgradeToSubAffiliateRequest,
  UpdateUserFeeDiscountRequest,
  UpdateReferralNoteRequest,
  BindReferralCodeRequest,
  PaginatedReferralsResponse,
  PaginatedReferralDetailResponse,
  SubAffiliatesListResponse,
  SyncVolumeResponse,
  UserVolumeResponse,
  ResetWeeklyVolumeResponse,
} from "./api-refer-client";

export const userApi = {
  // Create a new user
  createUser: (data: CreateUserRequest) =>
    api.post<UserResponse>("/users", data),

  // Check if user exists
  checkExist: (userId: string) => api.get<boolean>(`/users/${userId}/exist`),

  // Get user by ID
  getUser: (userId: string, token?: string) =>
    api.get<UserResponse>(`/users/${userId}`, token),

  // Get user role information
  getUserRole: (userId: string, token?: string) =>
    api.get<UserRoleResponse>(`/users/${userId}/role`, token),

  // Upgrade user to sub-affiliate (affiliate upgrades their referral to sub-affiliate)
  upgradeToSubAffiliate: (
    affiliateId: string,
    userId: string,
    data: UpgradeToSubAffiliateRequest,
    token?: string,
  ) =>
    api.post<UserResponse>(
      `/users/affiliates/${affiliateId}/upgrade-referral/${userId}`,
      data,
      token,
    ),

  // Update referral user's fee discount rate (affiliate modifies their referral's discount)
  updateFeeDiscount: (
    affiliateId: string,
    userId: string,
    data: UpdateUserFeeDiscountRequest,
    token?: string,
  ) =>
    api.put<UserResponse>(
      `/users/affiliates/${affiliateId}/referrals/${userId}/fee-discount`,
      data,
      token,
    ),

  // Update referral note for a user
  updateReferralNote: (
    affiliateId: string,
    referralUserId: string,
    data: UpdateReferralNoteRequest,
    token?: string,
  ) =>
    api.put<UserResponse>(
      `/users/affiliates/${affiliateId}/referrals/${referralUserId}/note`,
      data,
      token,
    ),

  // Update sub-affiliate note
  // Note: Sub-affiliates are also referrals, use updateReferralNote instead
  // Backend does not have a separate endpoint for sub-affiliate notes
  updateSubAffiliateNote: (
    affiliateId: string,
    subAffiliateId: string,
    data: UpdateReferralNoteRequest,
    token?: string,
  ) =>
    api.put<UserResponse>(
      `/users/affiliates/${affiliateId}/referrals/${subAffiliateId}/note`,
      data,
      token,
    ),

  // Bind referral code to user
  bindReferralCode: (
    userId: string,
    data: BindReferralCodeRequest,
    token?: string,
  ) =>
    api.post<UserResponse>(`/users/${userId}/bind-referral-code`, data, token),

  // Get affiliate's referrals (paginated)
  getReferrals: (
    affiliateId: string,
    page: number = 1,
    pageSize: number = 10,
    token?: string,
  ) =>
    api.get<PaginatedReferralsResponse>(
      `/users/affiliates/${affiliateId}/referrals?page=${page}&page_size=${pageSize}`,
      token,
    ),

  // Get affiliate's referrals with detail
  getReferralsDetail: (
    affiliateId: string,
    page: number = 1,
    pageSize: number = 10,
    token?: string,
  ) =>
    api.get<PaginatedReferralDetailResponse>(
      `/users/affiliates/${affiliateId}/referrals-detail?page=${page}&page_size=${pageSize}`,
      token,
    ),

  // Get affiliate's sub-affiliates
  getSubAffiliates: (affiliateId: string, token?: string) =>
    api.get<SubAffiliatesListResponse>(
      `/users/affiliates/${affiliateId}/sub-affiliates`,
      token,
    ),

  // Sync volume data (admin)
  syncVolume: (targetDate?: string, token?: string) => {
    const params = targetDate ? `?target_date=${targetDate}` : "";
    return api.post<SyncVolumeResponse>(
      `/users/volume/sync${params}`,
      {},
      token,
    );
  },

  // Get user volume
  getUserVolume: (userId: string, token?: string) =>
    api.get<UserVolumeResponse>(`/users/volume/${userId}`, token),

  // Reset weekly volume (admin)
  resetWeeklyVolume: (token?: string) =>
    api.post<ResetWeeklyVolumeResponse>(
      "/users/volume/reset-weekly",
      {},
      token,
    ),
};
