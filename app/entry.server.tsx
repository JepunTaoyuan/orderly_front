import { renderToPipeableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable, redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import {
  getLocalePathFromPathname,
  removeLangPrefix,
} from "@orderly.network/i18n";
import { PathEnum } from "./constant";
import { DEFAULT_SYMBOL } from "./storage";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  let newPathname: string | null = null;

  const localePath = getLocalePathFromPathname(pathname);

  if (localePath) {
    const stripped = removeLangPrefix(pathname);
    newPathname = stripped === PathEnum.Root ? PathEnum.LandingPage : stripped;
  } else if (pathname === PathEnum.Root) {
    newPathname = PathEnum.LandingPage;
  } else if (pathname === PathEnum.Perp) {
    newPathname = `${PathEnum.Perp}/${DEFAULT_SYMBOL}`;
  } else if (pathname === PathEnum.Strategy) {
    newPathname = `${PathEnum.Strategy}/${DEFAULT_SYMBOL}`;
  }

  if (newPathname && newPathname !== pathname) {
    console.log(`redirect: ${pathname} ==> ${newPathname}`);
    url.pathname = newPathname;
    return redirect(url.toString());
  }

  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
