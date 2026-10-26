import { SITE_URL } from "@/lib/constants";

/** 分享卡片统一 1200×630，和社交平台的大图预览比例一致 */
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;
export const CARD_PADDING = 92;

export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const lines: string[] = [];
  let current = "";
  for (const char of text) {
    if (current && ctx.measureText(current + char).width > maxWidth) {
      lines.push(current);
      current = char;
      if (lines.length >= maxLines) return lines;
    } else {
      current += char;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

/**
 * 卡片用 canvas 画，避免为一张分享图引入截图依赖。
 * 这里只画所有卡片共用的底：暖色渐变、左上辉光、扫描线、金色边框、站点域名；
 * 内容由各自的 draw 回调写上去。
 */
export async function renderShareCard(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  await document.fonts.ready;

  const background = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  background.addColorStop(0, "#17120a");
  background.addColorStop(1, "#060505");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const glow = ctx.createRadialGradient(210, 130, 0, 210, 130, 620);
  glow.addColorStop(0, "rgba(255,210,77,.24)");
  glow.addColorStop(1, "rgba(255,210,77,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.fillStyle = "rgba(255,255,255,.035)";
  for (let y = 0; y < CARD_HEIGHT; y += 6) ctx.fillRect(0, y, CARD_WIDTH, 1);

  ctx.strokeStyle = "rgba(255,210,77,.42)";
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, CARD_WIDTH - 92, CARD_HEIGHT - 92);

  draw(ctx);

  ctx.fillStyle = "rgba(217,195,154,.62)";
  ctx.font = "600 22px 'Geist Mono', monospace";
  ctx.fillText(SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""), CARD_PADDING, CARD_HEIGHT - 92);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

export function safeFileName(text: string, fallback: string) {
  return text.replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 24) || fallback;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * 桌面 Chrome 上 canShare(文件) 会返回 true，但 navigator.share 在没有分享目标时
 * 可能永远不 settle，所以必须带超时兜底，否则按钮会卡在「生成中」。
 */
export async function tryShareFile(file: File, title: string, text: string): Promise<"shared" | "cancelled" | "unsupported"> {
  const data = { files: [file], title, text };
  if (!navigator.canShare?.(data)) return "unsupported";

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      navigator.share(data),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DOMException("timeout", "TimeoutError")), 4000);
      }),
    ]);
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    return "unsupported";
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** 先尝试系统分享面板（手机），不支持就直接下载 PNG（桌面） */
export async function shareOrDownloadCard(blob: Blob, filename: string, title: string, text: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const outcome = await tryShareFile(file, title, text);
  if (outcome === "unsupported") downloadBlob(blob, filename);
  return outcome;
}
