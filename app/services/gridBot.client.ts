// app/services/gridBot.server.ts
import { api } from "./api-bot-client";

// ==================== 型別定義 ====================

/**
 * 註冊配置
 */
export interface RegisterConfig {
  user_id: string;
  user_api_key: string;
  user_api_secret: string;
}

/**
 * 方向類型
 */
export type Direction = "LONG" | "SHORT" | "BOTH";

/**
 * 網格類型
 */
export type GridType = "ARITHMETIC" | "GEOMETRIC";

/**
 * 啟動網格配置
 */
export interface StartGridConfig {
  ticker: string; // 必須符合 ^[A-Z]+USDT$
  direction: Direction;
  current_price: number;
  upper_bound: number;
  lower_bound: number;
  grid_type: GridType;
  grid_ratio?: number; // 0-1, GEOMETRIC 時必填
  grid_levels: number; // >= 2
  total_margin: number;
  stop_bot_price?: number;
  stop_top_price?: number;
  user_id: string;
  user_sig: string;
  timestamp: number;
  nonce: string;
}

/**
 * 停止網格配置
 */
export interface StopGridConfig {
  session_id: string;
  user_sig: string;
  timestamp: number;
  nonce: string;
}

/**
 * API 成功回應
 */
export interface ApiSuccessResponse<T = any> {
  success: boolean;
  data: T;
}

/**
 * 網格狀態
 */
export interface GridStatus {
  status: string;
  session_id: string;
  ticker: string;
  direction: Direction;
  current_price: number;
  upper_bound: number;
  lower_bound: number;
  grid_levels: number;
  total_margin: number;
  // ... 其他狀態字段
}

/**
 * 會話列表回應
 */
export interface SessionsResponse {
  sessions: string[];
}

/**
 * 利潤報告
 */
export interface ProfitReport {
  session_id: string;
  total_profit: number;
  realized_profit: number;
  unrealized_profit: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  average_profit_per_trade: number;
  // ... 其他統計字段
}

/**
 * 健康檢查回應
 */
export interface HealthCheckResponse {
  status: string;
  timestamp: number;
  version: string;
}

/**
 * 就緒檢查回應
 */
export interface ReadinessCheckResponse {
  status: string;
  timestamp: number;
  active_sessions: number;
}

/**
 * 指標回應
 */
export interface MetricsResponse {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, any>;
}

/**
 * 挑戰回應
 */
export interface ChallengeResponse {
  timestamp: number;
  nonce: string;
  message: string;
}

// ==================== Grid Bot Service ====================

export const gridBotService = {
  /**
   * 啟用機器人交易(儲存用戶資料進 database)
   * POST /api/user/enable
   * 需要速率限制: auth
   */
  async enableBotTrading(
    data: RegisterConfig,
  ): Promise<ApiSuccessResponse<{ user_id: string }>> {
    return api.post<ApiSuccessResponse<{ user_id: string }>>(
      "/api/user/enable",
      data,
    );
  },
  /**
   * 檢查api key是否已儲存至DB
   * GET /api/user/check_api_key
   * 需要速率限制: auth
   */
  async checkUserApiKey(user_id: string): Promise<ApiSuccessResponse<boolean>> {
    return api.get<ApiSuccessResponse<boolean>>(
      `/api/user/check_api_key/${user_id}`,
    );
  },

  /**
   * 啟動網格交易
   * POST /api/grid/start
   * 需要速率限制: grid_control
   * 需要錢包簽名驗證
   */
  async startGrid(
    config: StartGridConfig,
  ): Promise<ApiSuccessResponse<{ status: string; session_id: string }>> {
    return api.post<ApiSuccessResponse<{ status: string; session_id: string }>>(
      "/api/grid/start",
      config,
    );
  },

  /**
   * 停止網格交易
   * POST /api/grid/stop
   * 需要速率限制: grid_control
   * 需要錢包簽名驗證
   */
  async stopGrid(
    config: StopGridConfig,
  ): Promise<ApiSuccessResponse<{ status: string; session_id: string }>> {
    return api.post<ApiSuccessResponse<{ status: string; session_id: string }>>(
      "/api/grid/stop",
      config,
    );
  },

  /**
   * 獲取網格交易狀態
   * GET /api/grid/status/{session_id}
   * 需要速率限制: status_check
   */
  async getGridStatus(
    session_id: string,
  ): Promise<ApiSuccessResponse<GridStatus>> {
    return api.get<ApiSuccessResponse<GridStatus>>(
      `/api/grid/status/${session_id}`,
    );
  },

  /**
   * 獲取利潤報告
   * GET /api/grid/profit/{session_id}
   * 需要速率限制: status_check
   */
  async getProfitReport(
    session_id: string,
  ): Promise<ApiSuccessResponse<ProfitReport>> {
    return api.get<ApiSuccessResponse<ProfitReport>>(
      `/api/grid/profit/${session_id}`,
    );
  },

  /**
   * 生成簽名挑戰
   * GET /api/auth/challenge
   * 需要速率限制: auth
   */
  async getChallenge(): Promise<ApiSuccessResponse<ChallengeResponse>> {
    return api.get<ApiSuccessResponse<ChallengeResponse>>(
      "/api/auth/challenge",
    );
  },
};

// ==================== 輔助函數 ====================

/**
 * 創建會話 ID
 */
export function createSessionId(userId: string, ticker: string): string {
  return `${userId}_${ticker}`;
}

/**
 * 驗證會話 ID 格式
 */
export function validateSessionId(sessionId: string): boolean {
  const parts = sessionId.split("_");
  return parts.length >= 2;
}

/**
 * 從會話 ID 解析用戶 ID
 */
export function getUserIdFromSessionId(sessionId: string): string | null {
  const parts = sessionId.split("_");
  if (parts.length < 2) {
    return null;
  }
  return parts[parts.length - 2];
}

/**
 * 從會話 ID 解析交易對
 */
export function getTickerFromSessionId(sessionId: string): string | null {
  const parts = sessionId.split("_");
  if (parts.length < 2) {
    return null;
  }
  return parts[parts.length - 1];
}

/**
 * 驗證網格配置
 */
export function validateGridConfig(config: StartGridConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 檢查價格範圍
  if (config.lower_bound >= config.upper_bound) {
    errors.push("下界必須小於上界");
  }

  if (
    config.current_price < config.lower_bound ||
    config.current_price > config.upper_bound
  ) {
    errors.push("當前價格必須在上下界範圍內");
  }

  // 檢查停損價格
  if (config.stop_bot_price && config.stop_bot_price >= config.lower_bound) {
    errors.push("止損價格必須小於下界");
  }

  if (config.stop_top_price && config.stop_top_price <= config.upper_bound) {
    errors.push("止盈價格必須大於上界");
  }

  // 檢查網格類型
  if (config.grid_type === "GEOMETRIC" && !config.grid_ratio) {
    errors.push("等比網格必須提供 grid_ratio");
  }

  // 檢查網格等級
  if (config.grid_levels < 2) {
    errors.push("網格等級必須至少為 2");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
