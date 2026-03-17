// app/services/commission.client.ts
// Commission-related API endpoints
import {
  api,
  UserCommissionResponse,
  CalculateCommissionsRequest,
  CalculateCommissionsResponse,
  ProcessDailyCommissionsRequest,
  ProcessDailyCommissionsResponse,
  SendWeeklyCommissionRequest,
  SendWeeklyCommissionResponse,
  WeeklyCommissionSummaryResponse,
  RetryFailedUserRequest,
  RetryFailedUsersResponse,
  MessageResponse,
  CommissionHistoryResponse,
  RebateHistoryResponse,
  AffiliateDashboardResponse,
  AffiliateDashboardParams,
} from "./api-refer-client";
import type { AuthHeaders } from "./api-refer-client";

export const commissionApi = {
  // Get user commission
  getUserCommission: (userId: string, authHeaders?: AuthHeaders) =>
    api.get<UserCommissionResponse>(`/commissions/${userId}`, authHeaders),

  // Calculate commissions for users
  calculate: (data: CalculateCommissionsRequest, authHeaders?: AuthHeaders) =>
    api.post<CalculateCommissionsResponse>(
      "/commissions/calculate",
      data,
      authHeaders,
    ),

  // Process daily commissions (admin)
  processDaily: (
    data: ProcessDailyCommissionsRequest,
    authHeaders?: AuthHeaders,
  ) =>
    api.post<ProcessDailyCommissionsResponse>(
      "/commissions/process-daily",
      data,
      authHeaders,
    ),

  // Send weekly commissions (admin)
  sendWeekly: (data: SendWeeklyCommissionRequest, authHeaders?: AuthHeaders) =>
    api.post<SendWeeklyCommissionResponse>(
      "/commissions/send-weekly",
      data,
      authHeaders,
    ),

  // Get weekly commission summary (admin)
  getWeeklySummary: (authHeaders?: AuthHeaders) =>
    api.get<WeeklyCommissionSummaryResponse>(
      "/commissions/weekly-summary",
      authHeaders,
    ),

  // Reset weekly commissions (admin)
  resetWeekly: (authHeaders?: AuthHeaders) =>
    api.post<MessageResponse>("/commissions/reset-weekly", {}, authHeaders),

  // Retry failed commission payouts (admin)
  retryFailed: (data: RetryFailedUserRequest, authHeaders?: AuthHeaders) =>
    api.post<RetryFailedUsersResponse>(
      "/commissions/retry-failed",
      data,
      authHeaders,
    ),

  // Reset all commissions (admin - dangerous)
  // WARNING: This endpoint is NOT implemented in the backend yet
  // resetAll: (token?: string) =>
  //   api.post<MessageResponse>("/commissions/reset-all", {}, token),

  // Get commission history (for affiliate charts)
  getCommissionHistory: (
    userId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      page?: number;
      pageSize?: number;
    },
    authHeaders?: AuthHeaders,
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("start_date", params.startDate);
    if (params?.endDate) searchParams.append("end_date", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("page_size", params.pageSize.toString());
    const queryString = searchParams.toString();
    return api.get<CommissionHistoryResponse>(
      `/commissions/${userId}/history${queryString ? `?${queryString}` : ""}`,
      authHeaders,
    );
  },

  // Get rebate history (for trader charts)
  getRebateHistory: (
    userId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      page?: number;
      pageSize?: number;
    },
    authHeaders?: AuthHeaders,
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("start_date", params.startDate);
    if (params?.endDate) searchParams.append("end_date", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("page_size", params.pageSize.toString());
    const queryString = searchParams.toString();
    return api.get<RebateHistoryResponse>(
      `/commissions/rebates/${userId}/history${queryString ? `?${queryString}` : ""}`,
      authHeaders,
    );
  },
};

// ============================================================================
// Affiliate Dashboard Aggregate API
// First-screen: call this ONE endpoint → only ONE wallet-signing prompt needed.
// Edit actions (change discount / note / code) still call the individual write
// APIs, then call refreshDashboard() to sync.
// ============================================================================

export const dashboardApi = {
  /**
   * GET /api/v1/dashboard/affiliate/{user_id}
   * Returns all affiliate dashboard data in a single signed request.
   */
  getAffiliateDashboard: (
    userId: string,
    params?: AffiliateDashboardParams,
    authHeaders?: AuthHeaders,
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.period != null)
      searchParams.append("period", String(params.period));
    if (params?.referrals_page != null)
      searchParams.append("referrals_page", String(params.referrals_page));
    if (params?.referrals_page_size != null)
      searchParams.append(
        "referrals_page_size",
        String(params.referrals_page_size),
      );
    if (params?.sub_agents_page != null)
      searchParams.append("sub_agents_page", String(params.sub_agents_page));
    if (params?.sub_agents_page_size != null)
      searchParams.append(
        "sub_agents_page_size",
        String(params.sub_agents_page_size),
      );
    if (params?.commission_history_page != null)
      searchParams.append(
        "commission_history_page",
        String(params.commission_history_page),
      );
    if (params?.commission_history_page_size != null)
      searchParams.append(
        "commission_history_page_size",
        String(params.commission_history_page_size),
      );
    const qs = searchParams.toString();
    return api.get<AffiliateDashboardResponse>(
      `/dashboard/affiliate/${userId}${qs ? `?${qs}` : ""}`,
      authHeaders,
    );
  },
};
