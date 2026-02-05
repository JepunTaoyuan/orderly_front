/**
 * Remix API Proxy for Referral Backend
 *
 * This resource route proxies requests from the browser to the referral backend service
 * running in the Docker internal network.
 *
 * Routes:
 * - /api/proxy/referral/* -> http://referral:8000/*
 */
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";

const REFERRAL_API_URL = process.env.REFERRAL_API_URL || "http://referral:8000";

/**
 * Proxy function that forwards requests to the backend
 */
async function proxyRequest(request: Request, path: string) {
  const url = new URL(request.url);
  const targetUrl = `${REFERRAL_API_URL}${path}${url.search}`;

  console.log(
    `[Referral Proxy] Forwarding ${request.method} ${url.pathname} -> ${targetUrl}`,
  );

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
    console.error("Referral API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to proxy request to referral backend",
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
