"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/**
 * 读取 ?param= 初值。用 useSyncExternalStore 而不是 useSearchParams，是为了让
 * 页面保持静态预渲染；服务端快照返回空串，客户端才取真实值。
 */
export function useUrlParam(name: string): string {
  const read = () => new URLSearchParams(window.location.search).get(name) ?? "";
  return useSyncExternalStore(subscribe, read, () => "");
}
