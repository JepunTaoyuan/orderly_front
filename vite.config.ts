import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(() => {
  const isProduction = process.env.NODE_ENV === "production";
  const noExternal: any[] = [/^@orderly.*$/, "@uiw/react-split"];
  if (isProduction) {
    noExternal.push("ethers");
  }

  return {
    resolve: {
      alias: {
        "@orderly.network/ui-scaffold": path.resolve(
          __dirname,
          "app/packages/ui-scaffold",
        ),
        "@orderly.network/ui-share": path.resolve(
          __dirname,
          "app/packages/ui-share",
        ),
        "@orderly.network/ui-transfer": path.resolve(
          __dirname,
          "app/packages/ui-transfer",
        ),
        "@orderly.network/ui-tpsl": path.resolve(
          __dirname,
          "app/packages/ui-tpsl",
        ),
        "@orderly.network/ui-leverage": path.resolve(
          __dirname,
          "app/packages/ui-leverage",
        ),

        stream: "node:stream",
      },
    },
    ssr: {
      noExternal,
      // noExternal: [/^@orderly.*$/, "ethers"],
      external: [
        "@solana/web3.js",
        "woofi-swap-widget-kit",
        "woofi-swap-widget-kit/react",
        "stream-browserify",
        "inherits",
        "readable-stream",
      ],
    },
    optimizeDeps: {
      include: [
        "@solana/web3.js",
        "woofi-swap-widget-kit",
        "woofi-swap-widget-kit/react",
      ],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
      exclude: ["react/jsx-dev-runtime", "react/jsx-runtime"],
    },
    plugins: [
      remix({
        ssr: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
      cjsInterop({
        dependencies: [
          "bs58",
          "@coral-xyz/anchor",
          "lodash",
          "@solana/web3.js",
          "woofi-swap-widget-kit",
          "woofi-swap-widget-kit/react",
        ],
      }),
      nodePolyfills({
        include: [
          "buffer",
          "crypto",
          "util",
          "process",
          "events",
          "assert",
          "http",
          "https",
          "os",
          "url",
          "zlib",
        ],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    ],
  };
});
