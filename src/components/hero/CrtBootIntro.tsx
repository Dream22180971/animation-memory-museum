"use client";

import { useEffect } from "react";

/**
 * 「17:30 开电视」首屏仪式（规范 §9）：
 * 17:29 → 17:30 → 白线展开 → 亮屏闪光 → 弱噪点 → Hero，总长 ~1.2s。
 * 首页限定、每会话一次、reduced-motion 直接跳过——由 layout 的内联脚本在
 * paint 前判定并挂 html[data-crt-boot]，CSS 同步压黑 body 防闪白；
 * 本组件挂载后插入遮罩，动画结束自摘除并记录回访。
 */
const BOOT_MS = 1200;

export default function CrtBootIntro() {
  useEffect(() => {
    if (document.documentElement.dataset.crtBoot !== "on") return;

    const overlay = document.createElement("div");
    overlay.className = "crt-boot-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="crt-boot-clock"><span class="crt-boot-clock-a">17:29</span><span class="crt-boot-clock-b">17:30</span></div>' +
      '<div class="crt-boot-line"></div>' +
      '<div class="crt-boot-flash"></div>' +
      '<div class="crt-boot-noise"></div>';
    document.body.prepend(overlay);

    const timer = setTimeout(() => {
      delete document.documentElement.dataset.crtBoot;
      try {
        sessionStorage.setItem("museum-crt-booted", "1");
      } catch {
        /* 隐私模式下 storage 抛错也不能卡住页面 */
      }
      overlay.remove();
    }, BOOT_MS);

    return () => {
      clearTimeout(timer);
      overlay.remove();
    };
  }, []);

  return null;
}
