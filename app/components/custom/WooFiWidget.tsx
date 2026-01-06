import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWalletConnector } from "@orderly.network/hooks";
import { Box } from "@orderly.network/ui";
import "woofi-swap-widget-kit/style.css";

interface WooFiWidgetProps {
  Widget: React.ComponentType<{
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
  brokerAddress: string;
  config: Record<string, boolean>;
}

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
      <div className="loading-text">Initializing wallet...</div>
    </Box>
  );
}

/**
 * Creates a wrapper around the EVM provider that prevents Vue's reactivity
 * system from traversing the wallet extension's proxy object.
 *
 * Vue's defineReactive attempts to call .bind() on all function properties,
 * but wallet extensions (like MetaMask) inject Proxy objects with traps that
 * may return non-functions for properties Vue expects to be functions.
 *
 * This wrapper creates a minimal interface that only exposes the essential
 * EIP-1193 methods without allowing deep traversal.
 */
function createNonReactiveProvider(provider: any): any {
  if (!provider) return undefined;

  // Create an object that Vue's reactivity system won't deeply observe
  // by only exposing the necessary methods through a frozen wrapper
  const wrapper = Object.create(null);

  // Define essential EIP-1193 properties as non-enumerable to prevent Vue traversal
  Object.defineProperty(wrapper, "request", {
    value: (...args: any[]) => provider.request(...args),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(wrapper, "on", {
    value: (...args: any[]) => provider.on(...args),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(wrapper, "removeListener", {
    value: (...args: any[]) => provider.removeListener?.(...args),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Add a marker to identify this as a wrapped provider
  Object.defineProperty(wrapper, "__isWrappedProvider", {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Freeze to prevent any modifications that could trigger reactivity
  return Object.freeze(wrapper);
}

export function WooFiWidget({
  Widget,
  brokerAddress,
  config,
}: WooFiWidgetProps) {
  const { wallet, setChain, connectedChain, connect } = useWalletConnector();
  const [isWidgetMountReady, setIsWidgetMountReady] = useState(false);

  // Use ref to store provider - refs are not traversed by Vue's reactivity
  const providerRef = useRef<any>(null);
  const wrappedProviderRef = useRef<any>(null);

  const handleConnectWallet = useCallback(() => {
    connect();
  }, [connect]);

  const handleChainSwitch = useCallback(
    (targetChain: { chainName: string; chainId?: string; key: string }) => {
      if (targetChain.chainId) {
        setChain({ chainId: Number(targetChain.chainId) });
      }
    },
    [setChain],
  );

  // Update provider ref when wallet changes
  useEffect(() => {
    const provider = wallet?.provider;

    if (provider && typeof provider === "object") {
      providerRef.current = provider;
      // Create a non-reactive wrapper for the provider
      wrappedProviderRef.current = createNonReactiveProvider(provider);
    } else {
      providerRef.current = null;
      wrappedProviderRef.current = null;
    }
  }, [wallet?.provider]);

  // Generate a key to force widget remount when provider changes
  const widgetKey = useMemo(() => {
    return wallet?.provider ? "connected" : "disconnected";
  }, [wallet?.provider]);

  // Delayed mount to ensure everything is ready
  useEffect(() => {
    // Small delay to ensure provider wrapper is set
    const timer = setTimeout(() => {
      setIsWidgetMountReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Create widget props without including the raw provider in useMemo dependencies
  // This prevents React from comparing the provider object which could trigger Vue issues
  const widgetProps = useMemo(
    () => ({
      brokerAddress,
      config,
      onConnectWallet: handleConnectWallet,
      onChainSwitch: handleChainSwitch,
    }),
    [brokerAddress, config, handleConnectWallet, handleChainSwitch],
  );

  // Guard: Wait for widget mount to be ready
  if (!isWidgetMountReady) {
    return <LoadingSpinner />;
  }

  // Pass wrapped provider and current chain directly (not through useMemo)
  // to avoid React comparing the provider object
  return (
    <Widget
      key={widgetKey}
      {...widgetProps}
      evmProvider={wrappedProviderRef.current}
      currentChain={connectedChain?.id ? Number(connectedChain.id) : undefined}
    />
  );
}
