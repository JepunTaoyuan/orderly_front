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
} from "./api-refer-client";

export const commissionApi = {
  // Get user commission
  getUserCommission: (userId: string, token?: string) =>
    api.get<UserCommissionResponse>(`/commissions/${userId}`, token),

  // Calculate commissions for users
  calculate: (data: CalculateCommissionsRequest, token?: string) =>
    api.post<CalculateCommissionsResponse>(
      "/commissions/calculate",
      data,
      token,
    ),

  // Process daily commissions (admin)
  processDaily: (data: ProcessDailyCommissionsRequest, token?: string) =>
    api.post<ProcessDailyCommissionsResponse>(
      "/commissions/process-daily",
      data,
      token,
    ),

  // Send weekly commissions (admin)
  sendWeekly: (data: SendWeeklyCommissionRequest, token?: string) =>
    api.post<SendWeeklyCommissionResponse>(
      "/commissions/send-weekly",
      data,
      token,
    ),

  // Get weekly commission summary (admin)
  getWeeklySummary: (token?: string) =>
    api.get<WeeklyCommissionSummaryResponse>(
      "/commissions/weekly-summary",
      token,
    ),

  // Reset weekly commissions (admin)
  resetWeekly: (token?: string) =>
    api.post<MessageResponse>("/commissions/reset-weekly", {}, token),

  // Retry failed commission payouts (admin)
  retryFailed: (data: RetryFailedUserRequest, token?: string) =>
    api.post<RetryFailedUsersResponse>(
      "/commissions/retry-failed",
      data,
      token,
    ),

  // Reset all commissions (admin - dangerous)
  // WARNING: This endpoint is NOT implemented in the backend yet
  // resetAll: (token?: string) =>
  //   api.post<MessageResponse>("/commissions/reset-all", {}, token),
};
