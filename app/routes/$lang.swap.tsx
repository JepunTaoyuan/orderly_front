import React, { useEffect, useState } from "react";
import { Box, useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import { WooFiWidget } from "@/components/custom/WooFiWidget";
import { PathEnum } from "@/constant";
import { useHydrated } from "@/hooks/useHydrated";

// Stream shim for browser compatibility
// This provides minimal stream classes that the widget might need
function setupStreamShim() {
  if (typeof window !== "undefined" && !(window as any).__streamShimInstalled) {
    const EventEmitter = class {
      private listeners: Record<string, Function[]> = {};
      on(event: string, fn: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
        return this;
      }
      emit(event: string, ...args: any[]) {
        if (this.listeners[event]) {
          this.listeners[event].forEach((fn) => fn(...args));
        }
        return true;
      }
      removeListener(event: string, fn: Function) {
        if (this.listeners[event]) {
          this.listeners[event] = this.listeners[event].filter((f) => f !== fn);
        }
        return this;
      }
    };

    class StreamBase extends EventEmitter {
      readable = true;
      writable = true;
      pipe(dest: any) {
        return dest;
      }
      read() {
        return null;
      }
      write() {
        return true;
      }
      end() {}
      destroy() {}
    }

    const streamShim = {
      Stream: StreamBase,
      Readable: class extends StreamBase {},
      Writable: class extends StreamBase {},
      Duplex: class extends StreamBase {},
      Transform: class extends StreamBase {},
      PassThrough: class extends StreamBase {},
    };

    // Install shim globally
    (window as any).stream = streamShim;
    (window as any).__streamShimInstalled = true;
  }
}

// Define the Widget type
type WooFiWidgetType = React.ComponentType<{
  brokerAddress: string;
  config: Record<string, boolean>;
  evmProvider?: unknown;
  currentChain?: number;
  onConnectWallet: () => void;
  onChainSwitch: (targetChain: {
    chainName: string;
    chainId?: string;
    key: string;
  }) => void;
}>;

function LoadingSpinner() {
  return (
    <Box className="oui-flex oui-flex-col oui-items-center oui-justify-center oui-min-h-[400px] oui-gap-4">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loader {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(127, 251, 255, 0.2);
            border-radius: 50%;
            border-top-color: rgb(127, 251, 255);
            animation: spin 1s linear infinite;
          }
          .loading-text {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            letter-spacing: 0.5px;
          }
        `}
      </style>
      <div className="loader"></div>
      <div className="loading-text">Loading Swap Widget...</div>
    </Box>
  );
}

function SwapError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Box className="oui-flex oui-flex-col oui-items-center oui-justify-center oui-min-h-[400px] oui-gap-4 oui-p-8">
      <style>
        {`
          .error-icon {
            width: 64px;
            height: 64px;
            color: rgba(245, 97, 139, 0.8);
          }
          .error-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            font-weight: 600;
            margin: 0;
          }
          .error-detail {
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            max-width: 400px;
            text-align: center;
            margin: 0;
          }
          .retry-button {
            margin-top: 16px;
            padding: 12px 32px;
            background: linear-gradient(90deg, rgb(82, 65, 158), rgb(127, 251, 255));
            border: none;
            border-radius: 50px;
            color: rgba(255, 255, 255, 1);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(127, 251, 255, 0.3);
          }
        `}
      </style>
      <svg
        className="error-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="error-text">Failed to Load Swap Widget</p>
      <p className="error-detail">{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    </Box>
  );
}

const brokerAddress = "0xBf60A23Ee6748d0E762A75172659B5917958E7B6";

const widgetConfig = {
  enableSolana: true,
  enableLinea: false,
  enableMerlin: false,
  enableHyperevm: false,
  enableZksync: false,
};

export default function SwapLayout() {
  const isHydrated = useHydrated();
  const { isMobile } = useScreen();
  const [Widget, setWidget] = useState<WooFiWidgetType | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Client-side dynamic import - only runs in useEffect after hydration
  useEffect(() => {
    if (!isHydrated) return;

    // Setup stream shim before loading the widget
    setupStreamShim();

    import("woofi-swap-widget-kit/react")
      .then((m) => {
        setWidget(() => m.WooFiSwapWidgetReact);
      })
      .catch((err) => {
        console.error("[Swap] Failed to load widget:", err);
        setLoadError(err.message);
      });
  }, [isHydrated]);

  // Show loading spinner during SSR and while loading widget
  if (!isHydrated || (!Widget && !loadError)) {
    return (
      <BaseLayout initialMenu={PathEnum.Swap}>
        <Box
          className="oui-flex oui-flex-col oui-items-center oui-justify-center oui-w-full"
          style={{
            minHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 80px)",
          }}
        >
          <LoadingSpinner />
        </Box>
      </BaseLayout>
    );
  }

  // Show error if widget failed to load
  if (loadError) {
    return (
      <BaseLayout initialMenu={PathEnum.Swap}>
        <Box
          className="oui-flex oui-flex-col oui-items-center oui-justify-center oui-w-full"
          style={{
            minHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 80px)",
          }}
        >
          <SwapError
            error={loadError}
            onRetry={() => window.location.reload()}
          />
        </Box>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      initialMenu={PathEnum.Swap}
      classNames={{
        content:
          "oui-flex oui-justify-center oui-items-center oui-p-4 md:oui-p-8",
      }}
    >
      <Box
        className="oui-flex oui-flex-col oui-items-center oui-justify-center oui-w-full"
        style={{
          minHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 80px)",
        }}
      >
        <Box
          className="oui-w-full oui-max-w-[480px]"
          style={{
            animation: "fadeIn 0.6s ease-out",
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
          <WooFiWidget
            Widget={Widget as WooFiWidgetType}
            brokerAddress={brokerAddress}
            config={widgetConfig}
          />
        </Box>
      </Box>
    </BaseLayout>
  );
}
