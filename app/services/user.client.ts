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
  AffiliateSummaryResponse,
  TraderSummaryResponse,
  DailyVolumeResponse,
} from "./api-refer-client";
import type { AuthHeaders } from "./api-refer-client";

export const userApi = {
  // Create a new user
  createUser: (data: CreateUserRequest) =>
    api.post<UserResponse>("/users", data),

  // Check if user exists
  checkExist: (userId: string) => api.get<boolean>(`/users/${userId}/exist`),

  // Get user by ID
  getUser: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<UserResponse>(`/users/${userId}`, authHeaders),

  // Get user role information
  getUserRole: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<UserRoleResponse>(`/users/${userId}/role`, authHeaders),

  // Upgrade user to sub-affiliate (affiliate upgrades their referral to sub-affiliate)
  upgradeToSubAffiliate: (
    affiliateId: string,
    userId: string,
    data: UpgradeToSubAffiliateRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.post<UserResponse>(
      `/users/affiliates/${affiliateId}/upgrade-referral/${userId}`,
      data,
      authHeaders,
    ),

  // Update referral user's fee discount rate (affiliate modifies their referral's discount)
  updateFeeDiscount: (
    affiliateId: string,
    userId: string,
    data: UpdateUserFeeDiscountRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.put<UserResponse>(
      `/users/affiliates/${affiliateId}/referrals/${userId}/fee-discount`,
      data,
      authHeaders,
    ),

  // Update referral note for a user
  updateReferralNote: (
    affiliateId: string,
    referralUserId: string,
    data: UpdateReferralNoteRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.put<UserResponse>(
      `/users/affiliates/${affiliateId}/referrals/${referralUserId}/note`,
      data,
      authHeaders,
    ),

  // Update sub-affiliate note
  // Note: Sub-affiliates are also referrals, use updateReferralNote instead
  // Backend does not have a separate endpoint for sub-affiliate notes
  updateSubAffiliateNote: (
    affiliateId: string,
    subAffiliateId: string,
    data: UpdateReferralNoteRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.put<UserResponse>(
      `/users/affiliates/${affiliateId}/referrals/${subAffiliateId}/note`,
      data,
      authHeaders,
    ),

  // Bind referral code to user
  bindReferralCode: (
    userId: string,
    data: BindReferralCodeRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.post<UserResponse>(
      `/users/${userId}/bind-referral-code`,
      data,
      authHeaders,
    ),

  // Get affiliate's referrals (paginated)
  getReferrals: (
    affiliateId: string,
    page: number = 1,
    pageSize: number = 10,
    authHeaders?: AuthHeaders,
  ) =>
    api.get<PaginatedReferralsResponse>(
      `/users/affiliates/${affiliateId}/referrals?page=${page}&page_size=${pageSize}`,
      authHeaders,
    ),

  // Get affiliate's referrals with detail
  getReferralsDetail: (
    affiliateId: string,
    page: number = 1,
    pageSize: number = 10,
    authHeaders?: AuthHeaders,
  ) =>
    api.get<PaginatedReferralDetailResponse>(
      `/users/affiliates/${affiliateId}/referrals-detail?page=${page}&page_size=${pageSize}`,
      authHeaders,
    ),

  // Get affiliate's sub-affiliates
  getSubAffiliates: (affiliateId: string, authHeaders?: AuthHeaders) =>
    api.get<SubAffiliatesListResponse>(
      `/users/affiliates/${affiliateId}/sub-affiliates`,
      authHeaders,
    ),

  // Sync volume data (admin)
  syncVolume: (targetDate?: string, authHeaders?: AuthHeaders) => {
    const params = targetDate ? `?target_date=${targetDate}` : "";
    return api.post<SyncVolumeResponse>(
      `/users/volume/sync${params}`,
      {},
      authHeaders,
    );
  },

  // Get user volume
  getUserVolume: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<UserVolumeResponse>(`/users/volume/${userId}`, authHeaders),

  // Reset weekly volume (admin)
  resetWeeklyVolume: (authHeaders?: AuthHeaders) =>
    api.post<ResetWeeklyVolumeResponse>(
      "/users/volume/reset-weekly",
      {},
      authHeaders,
    ),

  // Get affiliate summary statistics
  getAffiliateSummary: (affiliateId: string, authHeaders?: AuthHeaders) =>
    api.get<AffiliateSummaryResponse>(
      `/users/affiliates/${affiliateId}/summary`,
      authHeaders,
    ),

  // Get trader summary statistics
  getTraderSummary: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<TraderSummaryResponse>(
      `/users/traders/${userId}/summary`,
      authHeaders,
    ),

  // Get user daily volume history
  getUserDailyVolume: (
    userId: string,
    startDate?: string,
    endDate?: string,
    authHeaders?: AuthHeaders,
  ) => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    const queryString = params.toString();
    return api.get<DailyVolumeResponse>(
      `/users/volume/${userId}/daily${queryString ? `?${queryString}` : ""}`,
      authHeaders,
    );
  },
};
