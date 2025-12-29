// app/services/referral.client.ts
// Referral code API endpoints
import {
  api,
  ReferralCodeResponse,
  CreateReferralCodeRequest,
  CreateAffiliateReferralCodeRequest,
  UpdateReferralCodeRequest,
  RenameReferralCodeRequest,
  VerifyReferralCodeResponse,
  MessageResponse,
  ReferralCodeStatsResponse,
} from "./api-refer-client";

export const referralApi = {
  // Create a referral code for regular user
  create: (data: CreateReferralCodeRequest, token?: string) =>
    api.post<ReferralCodeResponse>("/referrals/user", data, token),

  // Create referral code for affiliate (admin)
  createForAffiliate: (
    data: CreateAffiliateReferralCodeRequest,
    token?: string,
  ) => api.post<ReferralCodeResponse>("/referrals/affiliate", data, token),

  // Get referral codes by user
  getByUser: (userId: string, token?: string) =>
    api.get<ReferralCodeResponse[]>(`/referrals/user/${userId}`, token),

  // Get referral code by code string
  getByCode: (code: string, token?: string) =>
    api.get<ReferralCodeResponse>(`/referrals/by-code/${code}`, token),

  // Update referral code fee discount rate
  update: (code: string, data: UpdateReferralCodeRequest, token?: string) =>
    api.put<ReferralCodeResponse>(`/referrals/${code}/discount`, data, token),

  // Rename referral code
  rename: (code: string, data: RenameReferralCodeRequest, token?: string) =>
    api.put<ReferralCodeResponse>(`/referrals/${code}/rename`, data, token),

  // Verify if referral code is valid
  verify: (code: string) =>
    api.get<VerifyReferralCodeResponse>(`/referrals/verify/${code}`),

  // Delete referral code
  // WARNING: This endpoint is NOT implemented in the backend yet
  // Uncomment when backend adds DELETE /referrals/{code} endpoint
  // delete: (code: string, token?: string) =>
  //   api.delete<MessageResponse>(`/referrals/${code}`, token),

  // Get all referral codes with detailed statistics
  getCodesWithStats: (userId: string, token?: string) =>
    api.get<ReferralCodeStatsResponse>(
      `/referrals/codes/${userId}/stats`,
      token,
    ),
};
