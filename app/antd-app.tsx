import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { useMemo } from "react";
import { Outlet } from "react-router";

export function AntdApp() {
  const cache = useMemo(() => createCache(), []);
  const isServer = typeof document === "undefined";

  return (
    <>
      <StyleProvider hashPriority="high" cache={cache}>
        <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
          <Outlet />
        </ConfigProvider>
      </StyleProvider>
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: isServer ? extractStyle(cache) : "",
        }}
      />
    </>
  );
}
