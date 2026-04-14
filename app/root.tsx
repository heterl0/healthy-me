import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from "react-redux";
import { Alert, ConfigProvider, Result, Typography, theme } from "antd";

import type { Route } from "./+types/root";
import { AntdApp } from "./antd-app";
import { store } from "./store";
import "./app.scss";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AntdApp />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
        <Result status="error" title={message} subTitle={details} />
        {stack ? (
          <Alert
            type="warning"
            showIcon
            message="Stack trace (dev only)"
            description={
              <Typography.Paragraph>
                <pre
                  style={{
                    overflow: "auto",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: 12,
                  }}
                >
                  <code>{stack}</code>
                </pre>
              </Typography.Paragraph>
            }
          />
        ) : null}
      </div>
    </ConfigProvider>
  );
}
