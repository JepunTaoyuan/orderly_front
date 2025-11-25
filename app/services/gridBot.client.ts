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
 * 訂單信息
 */
export interface OrderInfo {
  price: number;
  side: "BUY" | "SELL";
  quantity: number;
  order_type: "MARKET" | "LIMIT";
}

/**
 * 網格狀態信息
 */
export interface GridStatus {
  is_running: boolean;
  active_orders_count: number;
  active_orders: Record<string, OrderInfo>;
  grid_orders: Record<string, number>;
  order_statistics: {
    total_orders: number;
    filled_orders: number;
    active_orders: number;
    total_fills: number;
    fill_rate: number;
  };
  event_queue_size: number;
  websocket: {
    connected: boolean;
    should_reconnect: boolean;
    reconnect_attempts: number;
    reconnecting: boolean;
  };
  profit_statistics: {
    symbol: string;
    fee_rate: string;
    total_trades: number;
    buy_trades: number;
    sell_trades: number;
    arbitrage_count: number;
    total_arbitrage_profit: string;
    grid_profit: string;
    unpaired_profit: string;
    total_profit: string;
    funding_fees: string;
    trading_fees: string;
    order_modification_pnl: string;
    realized_pnl: string;
    unrealized_pnl: string;
    total_pnl: string;
    capital_utilization: string;
    total_margin_used: string;
    total_buy_cost: string;
    total_sell_revenue: string;
    total_fees: string;
    current_position_qty: string;
    current_position_cost: string;
    avg_entry_price: string;
    open_positions_count: number;
  };
}

/**
 * 用戶網格策略
 */
export interface UserGridStrategy {
  session_id: string;
  user_id: string;
  ticker: string;
  is_running: boolean;
  status: GridStatus;
}

/**
 * 用戶網格策略列表回應
 */
export interface UserGridStrategiesResponse {
  user_id: string;
  strategies: UserGridStrategy[];
  total_strategies: number;
}

/**
 * 啟動網格配置
 */
export interface StartGridConfig {
  ticker: string; // 必須符合 ^PERP_[A-Z]+_USDC$
  direction: Direction;
  current_price: number; // > 0
  upper_bound: number; // > 0
  lower_bound: number; // > 0
  grid_type: GridType;
  grid_ratio?: number; // > 0, < 1 (GEOMETRIC 時必填)
  grid_levels: number; // >= 2
  total_margin: number; // > 0
  stop_bot_price?: number; // > 0 (必須 < lower_bound)
  stop_top_price?: number; // > 0 (必須 > upper_bound)
  user_id: string; // min_length: 1
  user_sig: string; // min_length: 1
  timestamp: number; // > 0
  nonce: string; // min_length: 1
}

/**
 * 停止網格配置
 */
export interface StopGridConfig {
  session_id: string; // min_length: 1
  user_sig: string; // min_length: 1
  timestamp: number; // > 0
  nonce: string; // min_length: 1
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

  // 🔄 核心網格指標
  total_profit: number; // 總盈虧
  realized_profit: number; // 已實現盈虧
  unrealized_profit: number; // 未實現盈虧
  arbitrage_count: number; // 套利次數 ⭐
  total_arbitrage_profit: number; // 總套利利潤 ⭐

  // 💰 資金統計（最重要的指標）
  capital_utilization: number; // 資金利用率 (%) ⭐⭐⭐
  total_margin_used: number; // 已使用保證金
  total_buy_cost: number; // 總買入成本
  total_sell_revenue: number; // 總賣出收入
  total_fees: number; // 總手續費

  // 📦 持倉統計
  current_position_qty: number; // 當前持倉數量
  current_position_cost: number; // 當前持倉成本
  avg_entry_price: number; // 平均入場價格
  open_positions_count: number; // 未平倉筆數

  // 🕐 時間信息
  created_at: string;
  updated_at: string;
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

/**
 * 會話清理回應
 */
export interface SessionCleanupResponse {
  status: "cleaned" | "no_cleanup_needed";
  session_id: string;
  message: string;
}

/**
 * 系統健康檢查回應
 */
export interface SystemHealthResponse {
  status: "healthy" | "unhealthy" | "error";
  timestamp: number;
  uptime_seconds: number;
  version: string;
  memory_usage_mb: number;
  cpu_usage_percent: number;
  active_sessions: number;
  database_connected: boolean;
  error_rate_5min: number;
  last_error?: string;
}

/**
 * 詳細系統指標回應
 */
export interface SystemMetricsResponse {
  timestamp: number;
  uptime_seconds: number;
  system: {
    cpu_percent: number;
    memory_percent: number;
    memory_used_mb: number;
    memory_available_mb: number;
    disk_usage_percent: number;
    disk_used_gb: number;
    disk_free_gb: number;
  };
  application: {
    active_sessions: number;
    total_requests: number;
    error_rate_5min: number;
    response_time_ms: number;
    database_connected: boolean;
    websocket_connections: number;
  };
  performance: {
    requests_per_second: number;
    avg_response_time_ms: number;
    p95_response_time_ms: number;
    p99_response_time_ms: number;
  };
}

/**
 * 系統統計回應
 */
export interface SystemStatsResponse {
  success: boolean;
  data: {
    timestamp: number;
    uptime_seconds: number;
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    active_sessions: number;
    total_sessions: number;
    total_trades: number;
    total_profit: number;
    memory_usage_mb: number;
    cpu_usage_percent: number;
    error_rate_5min: number;
    database_connected: boolean;
    websocket_connections: number;
  };
}

/**
 * 錯誤恢復統計回應
 */
export interface ErrorRecoveryStatsResponse {
  success: boolean;
  data: {
    total_errors: number;
    recovered_errors: number;
    failed_recoveries: number;
    error_types: Record<string, number>;
    recovery_strategies: Record<string, number>;
    avg_recovery_time_ms: number;
    last_error_time?: string;
    last_recovery_time?: string;
  };
}

/**
 * 垃圾回收回應
 */
export interface GarbageCollectionResponse {
  success: boolean;
  data: {
    collected_objects: number;
    freed_memory_mb: number;
    collection_time_ms: number;
    generation: number;
  };
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
   * 獲取用戶網格策略列表
   * GET /api/user/strategies/{user_id}
   * 需要速率限制: status_check
   */
  async getUserGridStrategies(
    user_id: string,
  ): Promise<ApiSuccessResponse<UserGridStrategiesResponse>> {
    return api.get<ApiSuccessResponse<UserGridStrategiesResponse>>(
      `/api/user/strategies/${user_id}`,
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

  /**
   * 獲取所有會話列表
   * GET /api/grid/sessions
   * 需要速率限制: status_check
   */
  async getAllSessions(): Promise<
    ApiSuccessResponse<{ sessions: string[] }[]>
  > {
    return api.get<ApiSuccessResponse<{ sessions: string[] }[]>>(
      "/api/grid/sessions",
    );
  },

  /**
   * 強制清理會話
   * POST /api/grid/cleanup/{session_id}
   * 需要速率限制: grid_control
   */
  async cleanupSession(
    session_id: string,
  ): Promise<ApiSuccessResponse<SessionCleanupResponse>> {
    return api.post<ApiSuccessResponse<SessionCleanupResponse>>(
      `/api/grid/cleanup/${session_id}`,
      {},
    );
  },
};

// ==================== System Service ====================

export const systemService = {
  /**
   * 系統健康檢查
   * GET /system/health
   */
  async getSystemHealth(): Promise<SystemHealthResponse> {
    return api.get<SystemHealthResponse>("/system/health");
  },

  /**
   * 詳細系統指標
   * GET /system/metrics
   */
  async getSystemMetrics(): Promise<SystemMetricsResponse> {
    return api.get<SystemMetricsResponse>("/system/metrics");
  },

  /**
   * 系統統計
   * GET /system/stats
   */
  async getSystemStats(): Promise<SystemStatsResponse> {
    return api.get<SystemStatsResponse>("/system/stats");
  },

  /**
   * 錯誤恢復統計
   * GET /system/recovery/stats
   */
  async getErrorRecoveryStats(): Promise<ErrorRecoveryStatsResponse> {
    return api.get<ErrorRecoveryStatsResponse>("/system/recovery/stats");
  },

  /**
   * 強制垃圾回收
   * POST /system/gc
   */
  async forceGarbageCollection(): Promise<GarbageCollectionResponse> {
    return api.post<GarbageCollectionResponse>("/system/gc", {});
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

  // 檢查 ticker 格式
  const tickerPattern = /^PERP_[A-Z]+_USDC$/;
  if (!tickerPattern.test(config.ticker)) {
    errors.push("ticker 格式必須符合 PERP_[A-Z]+_USDC");
  }

  // 檢查必填字段
  if (!config.user_id || config.user_id.length < 1) {
    errors.push("用戶 ID 不能為空");
  }

  if (!config.user_sig || config.user_sig.length < 1) {
    errors.push("用戶簽名不能為空");
  }

  if (!config.nonce || config.nonce.length < 1) {
    errors.push("nonce 不能為空");
  }

  if (config.timestamp <= 0) {
    errors.push("時間戳必須大於 0");
  }

  // 檢查價格範圍
  if (config.lower_bound <= 0) {
    errors.push("下界必須大於 0");
  }

  if (config.upper_bound <= 0) {
    errors.push("上界必須大於 0");
  }

  if (config.lower_bound >= config.upper_bound) {
    errors.push("下界必須小於上界");
  }

  if (config.current_price <= 0) {
    errors.push("當前價格必須大於 0");
  }

  if (
    config.current_price < config.lower_bound ||
    config.current_price > config.upper_bound
  ) {
    errors.push("當前價格必須在上下界範圍內");
  }

  // 檢查停損價格
  if (config.stop_bot_price !== undefined) {
    if (config.stop_bot_price <= 0) {
      errors.push("止損價格必須大於 0");
    }
    if (config.stop_bot_price >= config.lower_bound) {
      errors.push("止損價格必須小於下界");
    }
  }

  if (config.stop_top_price !== undefined) {
    if (config.stop_top_price <= 0) {
      errors.push("止盈價格必須大於 0");
    }
    if (config.stop_top_price <= config.upper_bound) {
      errors.push("止盈價格必須大於上界");
    }
  }

  // 檢查網格類型和比例
  if (config.grid_type === "GEOMETRIC") {
    if (config.grid_ratio === undefined) {
      errors.push("等比網格必須提供 grid_ratio");
    } else if (config.grid_ratio <= 0 || config.grid_ratio >= 1) {
      errors.push("grid_ratio 必須大於 0 且小於 1");
    }
  }

  // 檢查網格等級
  if (config.grid_levels < 2) {
    errors.push("網格等級必須至少為 2");
  }

  // 檢查保證金
  if (config.total_margin <= 0) {
    errors.push("總保證金必須大於 0");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
