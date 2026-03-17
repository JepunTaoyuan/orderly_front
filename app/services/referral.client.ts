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
  ReferralCodeStatsResponse,
} from "./api-refer-client";
import type { AuthHeaders } from "./api-refer-client";

export const referralApi = {
  // Create a referral code for regular user
  create: (data: CreateReferralCodeRequest, authHeaders?: AuthHeaders) =>
    api.post<ReferralCodeResponse>("/referrals/user", data, authHeaders),

  // Create referral code for affiliate (admin)
  createForAffiliate: (
    data: CreateAffiliateReferralCodeRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.post<ReferralCodeResponse>("/referrals/affiliate", data, authHeaders),

  // Get referral codes by user
  getByUser: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<ReferralCodeResponse[]>(`/referrals/user/${userId}`, authHeaders),

  // Get referral code by code string
  getByCode: (code: string, authHeaders?: AuthHeaders) =>
    api.get<ReferralCodeResponse>(`/referrals/by-code/${code}`, authHeaders),

  // Update referral code fee discount rate
  update: (
    code: string,
    data: UpdateReferralCodeRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.put<ReferralCodeResponse>(
      `/referrals/${code}/discount`,
      data,
      authHeaders,
    ),

  // Rename referral code
  rename: (
    code: string,
    data: RenameReferralCodeRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.put<ReferralCodeResponse>(
      `/referrals/${code}/rename`,
      data,
      authHeaders,
    ),

  // Verify if referral code is valid (public endpoint, no auth needed)
  verify: (code: string) =>
    api.get<VerifyReferralCodeResponse>(`/referrals/verify/${code}`),

  // Get all referral codes with detailed statistics
  getCodesWithStats: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<ReferralCodeStatsResponse>(
      `/referrals/codes/${userId}/stats`,
      authHeaders,
    ),
};
