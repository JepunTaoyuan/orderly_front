import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";
import { defineConfig, Plugin } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

// Custom plugin to provide stream polyfill for client builds only
function clientStreamPolyfill(): Plugin {
  const virtualModuleId = "virtual:stream-polyfill";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  // Minimal stream shim for browser
  const streamShimCode = `
    class EventEmitter {
      constructor() { this._events = {}; }
      on(e, fn) { (this._events[e] = this._events[e] || []).push(fn); return this; }
      emit(e, ...args) { (this._events[e] || []).forEach(fn => fn(...args)); return true; }
      removeListener(e, fn) { this._events[e] = (this._events[e] || []).filter(f => f !== fn); return this; }
      once(e, fn) { const onceFn = (...args) => { this.removeListener(e, onceFn); fn(...args); }; return this.on(e, onceFn); }
    }
    class Stream extends EventEmitter {
      constructor() { super(); this.readable = true; this.writable = true; }
      pipe(dest) { return dest; }
      read() { return null; }
      write() { return true; }
      end() {}
      destroy() {}
    }
    export class Readable extends Stream {}
    export class Writable extends Stream {}
    export class Duplex extends Stream {}
    export class Transform extends Stream {}
    export class PassThrough extends Stream {}
    export { Stream };
    export default { Stream, Readable, Writable, Duplex, Transform, PassThrough };
  `;

  return {
    name: "client-stream-polyfill",
    enforce: "pre",
    resolveId(id, importer, options) {
      // Only apply to client builds (not SSR)
      if (options?.ssr) return null;

      // Intercept stream imports for client
      if (id === "stream" || id === "node:stream") {
        return resolvedVirtualModuleId;
      }
      return null;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return streamShimCode;
      }
      return null;
    },
  };
}

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
        plugins: [
          {
            name: "stream-polyfill",
            setup(build) {
              // Provide a minimal stream shim for browser
              build.onResolve({ filter: /^stream$|^node:stream$/ }, () => ({
                path: "stream-shim",
                namespace: "stream-shim",
              }));
              build.onLoad({ filter: /.*/, namespace: "stream-shim" }, () => ({
                contents: `
                    class EventEmitter {
                      constructor() { this._events = {}; }
                      on(e, fn) { (this._events[e] = this._events[e] || []).push(fn); return this; }
                      emit(e, ...args) { (this._events[e] || []).forEach(fn => fn(...args)); return true; }
                      removeListener(e, fn) { this._events[e] = (this._events[e] || []).filter(f => f !== fn); return this; }
                      once(e, fn) { const onceFn = (...args) => { this.removeListener(e, onceFn); fn(...args); }; return this.on(e, onceFn); }
                    }
                    class Stream extends EventEmitter {
                      constructor() { super(); this.readable = true; this.writable = true; }
                      pipe(dest) { return dest; }
                      read() { return null; }
                      write() { return true; }
                      end() {}
                      destroy() {}
                    }
                    export class Readable extends Stream {}
                    export class Writable extends Stream {}
                    export class Duplex extends Stream {}
                    export class Transform extends Stream {}
                    export class PassThrough extends Stream {}
                    export { Stream };
                    export default { Stream, Readable, Writable, Duplex, Transform, PassThrough };
                  `,
                loader: "js",
              }));
            },
          },
        ],
      },
      exclude: ["react/jsx-dev-runtime", "react/jsx-runtime"],
    },
    plugins: [
      clientStreamPolyfill(),
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
