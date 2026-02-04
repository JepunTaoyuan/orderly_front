// app/services/api-refer-client.ts
// Shared types and base API client for the referral system

// Use Remix API proxy route for all environments
// This proxy runs on the server-side and can access internal Docker services
const API_URL = "/api/proxy/referral/api/v1";

// ============================================================================
// User Types
// ============================================================================

export interface UserResponse {
  user_id: string;
  wallet_address: string;
  is_affiliate: boolean;
  used_referral_code?: string;
  parent_affiliate_id?: string;
  max_referral_rate?: number;
  fee_discount_rate?: number;
  is_admin: boolean;
}

export interface UserRoleResponse {
  user_id: string;
  is_affiliate: boolean;
  is_admin: boolean;
}

export interface CreateUserRequest {
  user_id: string;
  wallet_address: string;
  used_referral_code?: string;
}

export interface UpgradeToSubAffiliateRequest {
  max_referral_rate?: number;
}

export interface UpdateUserFeeDiscountRequest {
  new_fee_discount_rate: number;
}

export interface UpdateReferralNoteRequest {
  note: string;
}

export interface BindReferralCodeRequest {
  referral_code: string;
}

export interface PaginatedReferralsResponse {
  referrals: UserResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ReferralDetailItem {
  user_id: string;
  wallet_address: string;
  is_affiliate: boolean;
  referral_code_str?: string;
  total_commission: number;
  total_volume: number;
  commission_rate_you: number;
  commission_rate_invitee: number;
  note?: string;
  created_at?: number;
}

export interface PaginatedReferralDetailResponse {
  referrals: ReferralDetailItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SubAffiliateItem {
  user_id: string;
  wallet_address: string;
  invited_users: number;
  total_commission: number;
  total_volume: number;
  commission_rate_you: number;
  commission_rate_sub: number;
  max_referral_rate: number;
  note?: string;
  created_at?: number;
}

export interface SubAffiliatesListResponse {
  sub_affiliates: SubAffiliateItem[];
  total: number;
}

export interface SyncVolumeResponse {
  date: string;
  total_users: number;
  updated_users: number;
  total_volume: number;
  success: boolean;
}

export interface UserVolumeResponse {
  user_id: string;
  total_volume: number;
  weekly_volume: number;
  exists: boolean;
}

export interface ResetWeeklyVolumeResponse {
  modified_count: number;
  success: boolean;
}

// ============================================================================
// Affiliate/Trader Summary Types
// ============================================================================

export interface AffiliateSummaryResponse {
  affiliate_id: string;
  total_invites: number;
  total_traded: number;
  total_referee_volume: number;
  total_referrer_rebate: number;
  day_1_invites: number;
  day_1_traded: number;
  day_1_referee_volume: number;
  day_1_referrer_rebate: number;
  day_7_invites: number;
  day_7_traded: number;
  day_7_referee_volume: number;
  day_7_referrer_rebate: number;
  day_30_invites: number;
  day_30_traded: number;
  day_30_referee_volume: number;
  day_30_referrer_rebate: number;
}

export interface TraderSummaryResponse {
  user_id: string;
  referer_code?: string;
  referee_rebate_rate: number;
  total_referee_rebate: number;
  all_volume: number;
  day_1_referee_rebate: number;
  day_1_volume: number;
  day_7_referee_rebate: number;
  day_7_volume: number;
  day_30_referee_rebate: number;
  day_30_volume: number;
}

// ============================================================================
// Commission/Rebate History Types
// ============================================================================

export interface CommissionHistoryItem {
  date: string;
  referral_rebate: number;
  referee_rebate: number;
  referral_volume: number;
  total_invites: number;
  total_traded: number;
}

export interface CommissionHistoryResponse {
  user_id: string;
  data: CommissionHistoryItem[];
  start_date: string;
  end_date: string;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RebateHistoryItem {
  date: string;
  referee_rebate: number;
  volume: number;
}

export interface RebateHistoryResponse {
  user_id: string;
  data: RebateHistoryItem[];
  start_date: string;
  end_date: string;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ============================================================================
// Daily Volume Types
// ============================================================================

export interface DailyVolumeItem {
  date: string;
  volume: number;
  perp_volume: number;
  spot_volume: number;
}

export interface DailyVolumeResponse {
  user_id: string;
  data: DailyVolumeItem[];
  start_date: string;
  end_date: string;
  total_volume: number;
}

// ============================================================================
// Referral Code Types
// ============================================================================

export interface ReferralCodeResponse {
  code: string;
  owner_user_id: string;
  fee_discount_rate: number;
  owner_commission_ratio: number;
  total_commission: number;
  total_referrals: number;
}

export interface CreateReferralCodeRequest {
  user_id: string;
  custom_code?: string;
}

export interface CreateAffiliateReferralCodeRequest {
  affiliate_id: string;
  fee_discount_rate: number;
  custom_code?: string;
}

export interface UpdateReferralCodeRequest {
  new_fee_discount_rate: number;
}

export interface RenameReferralCodeRequest {
  new_code: string;
}

export interface VerifyReferralCodeResponse {
  valid: boolean;
}

export interface ReferralCodeStatsItem {
  code: string;
  fee_discount_rate: number;
  owner_commission_ratio: number;
  total_commission: number;
  total_referrals: number;
  total_invites: number;
  total_traded: number;
  total_volume: number;
  day_1_volume: number;
  day_7_volume: number;
  day_30_volume: number;
}

export interface ReferralCodeStatsResponse {
  user_id: string;
  codes: ReferralCodeStatsItem[];
  total_codes: number;
}

// ============================================================================
// Commission Types
// ============================================================================

export interface UserCommissionResponse {
  user_id: string;
  total_commission_and_discount: number;
  weekly_commission_and_discount: number;
}

export interface CalculateCommissionsRequest {
  user_daily_fees: Record<string, number>;
  add_to_weekly?: boolean;
}

export interface CalculateCommissionsResponse {
  commissions: Record<string, number>;
  total_commission: number;
  user_count: number;
}

export interface ProcessDailyCommissionsRequest {
  target_date: string;
  force?: boolean;
}

export interface ProcessDailyCommissionsResponse {
  date: string;
  commissions: Record<string, number>;
  total_commission: number;
  users_with_fees: number;
  users_with_commission: number;
}

export interface SendWeeklyCommissionRequest {
  batch_size?: number;
  max_retries?: number;
  retry_delay?: number;
}

export interface FailedUserItem {
  user_id: string;
  amount: number;
  error: string;
  batch_num: number;
}

export interface SendWeeklyCommissionResponse {
  total_users: number;
  successful_batches: number;
  failed_batches: number;
  total_amount: number;
  failed_users: FailedUserItem[];
  processing_time: number;
}

export interface WeeklyCommissionSummaryResponse {
  total_users: number;
  users_with_commission: number;
  total_amount: number;
  average_amount: number;
  top_users: Array<{ user_id: string; amount: number }>;
}

export interface RetryFailedUserRequest {
  failed_users: FailedUserItem[];
  max_retries?: number;
  retry_delay?: number;
}

export interface RetryFailedUserItem extends FailedUserItem {
  retry_error: string;
  retry_attempts: number;
}

export interface RetryFailedUsersResponse {
  total_users: number;
  successful_users: number;
  failed_users: RetryFailedUserItem[];
  total_amount: number;
  processing_time: number;
}

// ============================================================================
// Points Types
// ============================================================================

export interface UserPointsResponse {
  user_id: string;
  weekly_points: number;
  total_points: number;
}

export interface LeaderboardEntry {
  user_id: string;
  total_points: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total_users: number;
  success: boolean;
  message: string;
}

export interface CalculatePointsResponse {
  user_id: string;
  weekly_points: number;
  success: boolean;
  message: string;
}

export interface SavePointsRequest {
  weekly_points: number;
}

export interface SavePointsResponse {
  user_id: string;
  weekly_points: number;
  success: boolean;
  message: string;
}

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

export interface WeeklyLeaderboardEntry {
  user_id: string;
  weekly_points: number;
}

export interface WeeklyLeaderboardResponse {
  week_start: number;
  leaderboard: WeeklyLeaderboardEntry[];
  total_users: number;
  success: boolean;
  message: string;
}

export interface WeeklyHistoryItem {
  week_start: number;
  weekly_points: number;
}

export interface WeeklyHistoryResponse {
  user_id: string;
  data: WeeklyHistoryItem[];
  success: boolean;
  message: string;
}

// ============================================================================
// Global Types
// ============================================================================

export interface HealthResponse {
  status: string;
  service: string;
}

export interface RateLimitStatusResponse {
  status: string;
  data: {
    current_timestamp: number;
    rate_limits: Record<string, unknown>;
    client_info: { ip: string; user_id: string };
    slowapi_config: Record<string, unknown>;
  };
}

export interface AuditLogItem {
  user_id?: string;
  event_type: string;
  severity: string;
  timestamp: number;
  details: Record<string, unknown>;
}

export interface AuditLogsResponse {
  status: string;
  data: {
    logs: AuditLogItem[];
    pagination: { limit: number; offset: number; total: number };
  };
}

export interface UserActivityResponse {
  status: string;
  data: {
    user_id: string;
    days: number;
    total_events: number;
    recent_actions: string[];
    event_types: string[];
  };
}

export interface AuthChallengeResponse {
  timestamp: number;
  nonce: string;
  message: string;
  signature_validity_window: number;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// Error Class
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================================================
// Base Request Function
// ============================================================================

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // 檢查是否處於測試模式
  const isTestMode = localStorage.getItem("test_mode") === "true";

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // 如果是測試模式，添加 X-Test-Mode header
      ...(isTestMode ? { "X-Test-Mode": "true" } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || error.detail || `請求失敗: ${response.status}`,
      response.status,
    );
  }

  // 處理 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============================================================================
// Generic API Client
// ============================================================================

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  post: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  put: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  patch: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  delete: <T = void>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};
