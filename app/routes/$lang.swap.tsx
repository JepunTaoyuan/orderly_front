import React, { lazy, Suspense } from "react";
import { Box, useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import { WooFiWidget } from "@/components/custom/WooFiWidget";
import { PathEnum } from "@/constant";
import { useHydrated } from "@/hooks/useHydrated";

const WooFiSwapWidgetReact = lazy(() =>
  import("woofi-swap-widget-kit/react").then((m) => ({
    default: m.WooFiSwapWidgetReact,
  })),
);

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

  if (!isHydrated) {
    return (
      <BaseLayout initialMenu={PathEnum.Swap}>
        <LoadingSpinner />
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
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
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
                Widget={WooFiSwapWidgetReact}
                brokerAddress={brokerAddress}
                config={widgetConfig}
              />
            </Box>
          </ErrorBoundary>
        </Suspense>
      </Box>
    </BaseLayout>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[Swap] Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <SwapError error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
