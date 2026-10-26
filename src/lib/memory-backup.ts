/** 回忆册只存在本机浏览器里：备份文件是换设备、清缓存前唯一能带走它的方式 */

export type MemoryEntry = {
  animationName: string;
  memory: string;
  nickname: string;
  createdAt: string;
};

const BACKUP_KIND = "animation-memory-book";
const BACKUP_VERSION = 1;

export function isMemoryEntry(value: unknown): value is MemoryEntry {
  const entry = value as Partial<MemoryEntry> | null;
  return !!entry && typeof entry.animationName === "string" && typeof entry.memory === "string";
}

/** 旧数据或手改过的备份可能缺昵称、日期，补齐成完整记录，且丢弃空片名/空回忆 */
function normalizeEntry(entry: MemoryEntry): MemoryEntry | null {
  const animationName = entry.animationName.trim();
  const memory = entry.memory.trim();
  if (!animationName || !memory) return null;
  const createdAt = Number.isNaN(new Date(entry.createdAt).getTime()) ? new Date().toISOString() : entry.createdAt;
  return { animationName, memory, nickname: typeof entry.nickname === "string" ? entry.nickname : "", createdAt };
}

export function serializeBackup(entries: MemoryEntry[]) {
  return JSON.stringify({ kind: BACKUP_KIND, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), entries }, null, 2);
}

/** 接受本站导出的备份对象，也接受裸数组；认不出来返回 null */
export function parseBackup(text: string): MemoryEntry[] | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const backup = data as { kind?: unknown; entries?: unknown } | null;
  const list = Array.isArray(data) ? data : backup?.kind === BACKUP_KIND ? backup.entries : null;
  if (!Array.isArray(list)) return null;
  return list.filter(isMemoryEntry).map(normalizeEntry).filter((entry): entry is MemoryEntry => entry !== null);
}

const entryKey = (entry: MemoryEntry) => `${entry.createdAt}\u0000${entry.animationName}\u0000${entry.memory}`;

/**
 * 合并本机与备份：同一条回忆（时间 + 片名 + 正文都相同）只留一份，
 * 按写下时间从新到旧排，超出上限时丢掉最早的。
 */
export function mergeEntries(current: MemoryEntry[], incoming: MemoryEntry[], max: number) {
  const seen = new Set(current.map(entryKey));
  const fresh = incoming.filter((entry) => {
    const key = entryKey(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const all = [...current, ...fresh].sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
  return { entries: all.slice(0, max), added: fresh.length, dropped: Math.max(0, all.length - max) };
}
