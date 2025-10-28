import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";
import { useAccount } from "@orderly.network/hooks";
import { useMultiChainWallet } from "@/hooks/custom/useMultiChainWallet";
import {
  gridBotService,
  type UserGridStrategy,
  type UserGridStrategiesResponse,
  type StopGridConfig,
  type ChallengeResponse,
  type ProfitReport,
} from "@/services/gridBot.client";

interface GridStrategiesContextType {
  strategies: UserGridStrategy[];
  strategyCount: number;
  loading: boolean;
  error: string | null;
  // Enhanced aggregated data
  totalGridProfit: number;
  totalMarginUsed: number;
  totalCapitalUtilization: number;
  strategiesBySymbol: Record<string, UserGridStrategy[]>;
  symbolSummaries: Record<
    string,
    {
      count: number;
      totalGridProfit: number;
      totalMarginUsed: number;
      avgCapitalUtilization: number;
      activeOrdersCount: number;
    }
  >;

  // Control methods
  refetch: (force?: boolean) => Promise<void>;
  stopStrategy: (session_id: string) => Promise<void>;
  stopping: boolean;
  getStrategyProfit: (session_id: string) => Promise<ProfitReport | null>;

  // Page visibility control
  setStrategyPageVisible: (visible: boolean) => void;

  // Operation completion triggers
  triggerRefreshAfterStart: () => void;
  triggerRefreshAfterStop: () => void;
}

const GridStrategiesContext = createContext<GridStrategiesContextType | null>(
  null,
);

export const useGridStrategiesGlobal = (): GridStrategiesContextType => {
  const context = useContext(GridStrategiesContext);
  if (!context) {
    throw new Error(
      "useGridStrategiesGlobal must be used within GridStrategiesProvider",
    );
  }
  return context;
};

interface GridStrategiesProviderProps {
  children: React.ReactNode;
}

const DEBOUNCE_DELAY = 500; // 500ms debounce
const CACHE_DURATION = 30000; // 30 seconds cache

export const GridStrategiesProvider: React.FC<GridStrategiesProviderProps> = ({
  children,
}) => {
  const [strategies, setStrategies] = useState<UserGridStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stopping, setStopping] = useState(false);
  const [strategyPageVisible, setInternalStrategyPageVisible] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const { state } = useAccount();
  const { chainType, address, signMessage, detectChainType } =
    useMultiChainWallet(state.address || "");

  // Refs for debouncing and state tracking
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const isStrategyPageActiveRef = useRef(false);
  const lastAccountIdRef = useRef<string | null>(null);

  // Calculate aggregated metrics
  const aggregatedData = React.useMemo(() => {
    if (!strategies.length) {
      return {
        totalGridProfit: 0,
        totalMarginUsed: 0,
        totalCapitalUtilization: 0,
        strategiesBySymbol: {},
        symbolSummaries: {},
      };
    }

    let totalGridProfit = 0;
    let totalMarginUsed = 0;
    let totalCapitalUtilization = 0;
    const strategiesBySymbol: Record<string, UserGridStrategy[]> = {};
    const symbolSummaries: Record<
      string,
      {
        count: number;
        totalGridProfit: number;
        totalMarginUsed: number;
        avgCapitalUtilization: number;
        activeOrdersCount: number;
      }
    > = {};

    strategies.forEach((strategy) => {
      const symbol = strategy.ticker;
      const gridProfit = parseFloat(
        strategy.status?.profit_statistics?.grid_profit || "0",
      );
      const marginUsed = parseFloat(
        strategy.status?.profit_statistics?.total_margin_used || "0",
      );
      const capitalUtilization = parseFloat(
        strategy.status?.profit_statistics?.capital_utilization || "0",
      );
      const activeOrdersCount = strategy.status?.active_orders_count || 0;

      // Accumulate totals
      totalGridProfit += gridProfit;
      totalMarginUsed += marginUsed;
      totalCapitalUtilization += capitalUtilization;

      // Group by symbol
      if (!strategiesBySymbol[symbol]) {
        strategiesBySymbol[symbol] = [];
        symbolSummaries[symbol] = {
          count: 0,
          totalGridProfit: 0,
          totalMarginUsed: 0,
          avgCapitalUtilization: 0,
          activeOrdersCount: 0,
        };
      }

      strategiesBySymbol[symbol].push(strategy);

      // Update symbol summaries
      const summary = symbolSummaries[symbol];
      summary.count++;
      summary.totalGridProfit += gridProfit;
      summary.totalMarginUsed += marginUsed;
      summary.avgCapitalUtilization += capitalUtilization;
      summary.activeOrdersCount += activeOrdersCount;
    });

    // Calculate averages for each symbol
    Object.keys(symbolSummaries).forEach((symbol) => {
      const summary = symbolSummaries[symbol];
      if (summary.count > 0) {
        summary.avgCapitalUtilization =
          summary.avgCapitalUtilization / summary.count;
      }
    });

    return {
      totalGridProfit,
      totalMarginUsed,
      totalCapitalUtilization,
      strategiesBySymbol,
      symbolSummaries,
    };
  }, [strategies]);

  const strategyCount = React.useMemo(() => {
    return strategies.length;
  }, [strategies.length]);

  // Core fetch function with debouncing and caching
  const fetchStrategies = useCallback(
    async (force: boolean = false) => {
      if (!state?.accountId) {
        setLoading(false);
        setStrategies([]);
        return;
      }

      // Prevent concurrent requests
      if (isLoadingRef.current && !force) {
        return;
      }

      // Check if user account changed
      if (lastAccountIdRef.current !== state.accountId) {
        lastAccountIdRef.current = state.accountId;
        setStrategies([]);
        setLastFetchTime(0); // Reset cache when account changes
      }

      // Check cache validity
      const now = Date.now();
      if (!force && now - lastFetchTime < CACHE_DURATION) {
        console.log("[GridStrategiesContext] Using cached data");
        return;
      }

      // Debounce the request
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      fetchTimeoutRef.current = setTimeout(async () => {
        try {
          isLoadingRef.current = true;
          setLoading(true);
          setError(null);

          console.log(
            "[GridStrategiesContext] Fetching strategies for user:",
            state.accountId,
          );
          const response = await gridBotService.getUserGridStrategies(
            state.accountId as any,
          );

          // When backend returns success and has data, extract strategies
          const list = Array.isArray(response?.data?.strategies)
            ? response.data.strategies
            : [];

          // Only show running strategies, combining is_running and status.is_running
          const activeStrategies = list.filter((s) => {
            return s.is_running && s.status?.is_running;
          });

          setStrategies(activeStrategies);
          setLastFetchTime(now);
          setError(null);
          console.log(
            "[GridStrategiesContext] Successfully fetched strategies:",
            activeStrategies.length,
          );
        } catch (err) {
          console.error(
            "[GridStrategiesContext] Failed to fetch strategies:",
            err,
          );
          // Set visible error for UI
          if (err instanceof Error) {
            setError(err.message || "Failed to load strategies");
          } else {
            setError("Failed to load strategies");
          }
          setStrategies([]);
        } finally {
          setLoading(false);
          isLoadingRef.current = false;
          fetchTimeoutRef.current = null;
        }
      }, DEBOUNCE_DELAY);
    },
    [state?.accountId],
  );

  // Smart refetch function
  const refetch = useCallback(
    async (force: boolean = false) => {
      // Only allow fetch if strategy page is visible or force refresh
      if (isStrategyPageActiveRef.current || force) {
        await fetchStrategies(force);
      } else {
        console.log(
          "[GridStrategiesContext] Skipping fetch - strategy page not visible",
        );
      }
    },
    [fetchStrategies],
  );

  // Stop strategy with optimistic update
  const stopStrategy = useCallback(
    async (session_id: string) => {
      if (!state?.accountId) {
        toast.error("User account not found");
        return;
      }

      try {
        setStopping(true);

        // 1. Get challenge for signature
        const challenge = await gridBotService.getChallenge();
        const handleSign = async () => {
          try {
            // Use challenge data to generate signature
            const messageToSign =
              challenge.data.message ||
              `${challenge.data.timestamp}-${challenge.data.nonce}`;
            const sig = await signMessage(
              messageToSign,
              detectChainType(state.address || ""),
            );
            console.log("Signature:", sig);
            return sig;
          } catch (error) {
            console.error("Failed to sign message:", error);
            throw new Error("Failed to generate signature");
          }
        };

        // 2. Create stop configuration
        const stopConfig: StopGridConfig = {
          session_id,
          user_sig: await handleSign(),
          timestamp: challenge.data.timestamp,
          nonce: challenge.data.nonce,
        };

        // 3. Call stop API
        const response = await gridBotService.stopGrid(stopConfig);
        console.log(
          "[GridStrategiesContext] Stop strategy response:",
          response,
        );

        // 4. Optimistic update: remove strategy from local state first
        setStrategies((prev) =>
          prev.filter((s) => s.session_id !== session_id),
        );
        setLastFetchTime(Date.now()); // Update cache time

        toast.success("Strategy closed successfully");
      } catch (err) {
        console.error("[GridStrategiesContext] Failed to stop strategy:", err);
        toast.error("Failed to close strategy");
        // If failed, refresh strategies list to restore state
        await refetch(true);
      } finally {
        setStopping(false);
      }
    },
    [state?.accountId, refetch],
  );

  // Get strategy profit report
  const getStrategyProfit = useCallback(
    async (session_id: string): Promise<ProfitReport | null> => {
      try {
        const response = await gridBotService.getProfitReport(session_id);
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error(
          `[GridStrategiesContext] Failed to get profit for ${session_id}:`,
          error,
        );
        return null;
      }
    },
    [],
  );

  // Set strategy page visibility
  const setStrategyPageVisible = useCallback(
    (visible: boolean) => {
      isStrategyPageActiveRef.current = visible;
      setInternalStrategyPageVisible(visible);

      // When page becomes visible, fetch data if needed
      if (visible && state?.accountId) {
        refetch();
      }
    },
    [refetch, state?.accountId],
  );

  // Trigger refresh after start operation
  const triggerRefreshAfterStart = useCallback(() => {
    console.log(
      "[GridStrategiesContext] Triggering refresh after start operation",
    );
    refetch(true); // Force refresh after start
  }, [refetch]);

  // Trigger refresh after stop operation (already handled by stopStrategy, but included for completeness)
  const triggerRefreshAfterStop = useCallback(() => {
    console.log(
      "[GridStrategiesContext] Triggering refresh after stop operation",
    );
    refetch(true); // Force refresh after stop
  }, [refetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  const contextValue: GridStrategiesContextType = {
    strategies,
    strategyCount,
    loading,
    error,
    ...aggregatedData,
    refetch,
    stopStrategy,
    stopping,
    getStrategyProfit,
    setStrategyPageVisible,
    triggerRefreshAfterStart,
    triggerRefreshAfterStop,
  };

  return (
    <GridStrategiesContext.Provider value={contextValue}>
      {children}
    </GridStrategiesContext.Provider>
  );
};
