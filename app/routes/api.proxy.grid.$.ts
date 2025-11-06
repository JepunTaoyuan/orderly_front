/**
 * Remix API Proxy for Grid Bot Backend
 *
 * This resource route proxies requests from the browser to the grid-bot backend service
 * running in the Docker internal network.
 *
 * Routes:
 * - /api/proxy/grid/* -> http://grid-bot:8001/*
 */
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";

const GRID_BOT_API_URL = process.env.GRID_BOT_API_URL || "http://grid-bot:8001";

/**
 * Proxy function that forwards requests to the backend
 */
async function proxyRequest(request: Request, path: string) {
  const url = new URL(request.url);
  const targetUrl = `${GRID_BOT_API_URL}${path}${url.search}`;

  // Copy headers from original request
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Skip host header to avoid issues
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  // Forward the request to backend
  const backendRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-ignore - duplex is needed for streaming
    duplex: request.body ? "half" : undefined,
  });

  try {
    const response = await fetch(backendRequest);

    // Copy response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Add CORS headers if needed
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    responseHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Grid Bot API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to proxy request to grid bot backend",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

/**
 * Handle GET requests
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const path = `/${params["*"] || ""}`;
  return proxyRequest(request, path);
}

/**
 * Handle POST, PUT, DELETE, PATCH requests
 */
export async function action({ request, params }: ActionFunctionArgs) {
  const path = `/${params["*"] || ""}`;
  return proxyRequest(request, path);
}
