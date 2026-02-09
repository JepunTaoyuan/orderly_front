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

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const localePath = getLocalePathFromPathname(location.pathname);
  const isLandingPage =
    location.pathname === "/" || location.pathname.includes("landing");
  // if url is include lang, and url lang is not the same as the i18n language, change the i18n language
  if (localePath && localePath !== i18n.language) {
    i18n.changeLanguage(localePath);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
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
