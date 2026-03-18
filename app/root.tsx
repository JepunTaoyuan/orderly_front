import { useEffect, useLayoutEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { getLocalePathFromPathname, i18n } from "@orderly.network/i18n";
import OrderlyProvider from "@/components/orderlyProvider";
import "./styles/index.css";

// useLayoutEffect runs synchronously before the browser paints, preventing a
// flash of the wrong language.  On the server there is no DOM, so we fall back
// to useEffect (which is a no-op there anyway).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const localePath = getLocalePathFromPathname(location.pathname);
  const isLandingPage =
    location.pathname === "/" || location.pathname.includes("landing");

  // Keep render pure to avoid hydration flashes on first paint.
  useIsomorphicLayoutEffect(() => {
    if (localePath && localePath !== i18n.language) {
      i18n.changeLanguage(localePath);
    }
  }, [localePath]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#181C23" />
        <meta name="msapplication-TileColor" content="#181C23" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <Meta />
        <Links />
      </head>
      <body
        style={
          isLandingPage
            ? {
                backgroundColor: "#121419",
                backgroundImage: "url(/images/landingpage/landingImage.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <OrderlyProvider>{children}</OrderlyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
