"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { BookOpen, Hand, Link2, Maximize2, Minus, Network, Plus, RotateCcw, Sparkles, Tags, Users, X } from "lucide-react";
import { animations, type AnimationRecord } from "@/lib/animations";
import { FEEDBACK_URL } from "@/lib/constants";

const W = 960;
const H = 620;
const CX = W / 2;
const CY = H / 2 + 8;
const NODE_R = 38;
const MIN_K = 0.55;
const MAX_K = 3.2;
const CLICK_SLOP = 4;
const MARGIN_X = 112;
const MARGIN_Y = 104;

/** 馆藏里有 45 种关系措辞，逐条上色读不过来，先收敛成语义族 */
const RELATION_FAMILIES = [
  { key: "kin", label: "亲缘与情感", color: "#ff8fa3", match: /兄妹|夫妻|恋人|暗恋|青梅竹马|暧昧|父子|兄弟|母女|姐妹/ },
  { key: "lineage", label: "师承与统属", color: "#61c7bb", match: /师徒|师生|传人|传承|统帅|麾下|队长|队员/ },
  { key: "bond", label: "同伴与战友", color: "#ffd24d", match: /同伴|伙伴|搭档|战友|小队|好友|结盟|同盟|协同|守护|并肩|护送/ },
  { key: "rival", label: "对手与宿敌", color: "#ff7a5c", match: /对手|宿敌|敌对|先敌|争|同代/ },
] as const;

const OTHER_FAMILY = { key: "other", label: "其他羁绊", color: "#c9a25f" } as const;

const familyOf = (label: string) =>
  RELATION_FAMILIES.find((family) => family.match.test(label)) ?? OTHER_FAMILY;

type Point = { x: number; y: number };

const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

const labelWidth = (text: string) => [...text].length * 13 + 14;

const nodeFontSize = (name: string) => ([...name].length >= 5 ? 13 : [...name].length >= 4 ? 14.5 : 16.5);

/** 深色底上直接用地本色会发闷，向白提亮一档再用作描边与光晕 */
function liftColor(hex: string, amount: number) {
  const digits = hex.replace("#", "");
  const full = digits.length === 3 ? digits.split("").map((digit) => digit + digit).join("") : digits;
  const parsed = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(parsed)) return hex;
  const channel = (shift: number) => {
    const base = (parsed >> shift) & 0xff;
    return Math.round(base + (255 - base) * amount);
  };
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
}

/** 环上顺序决定读图观感：从羁绊最多的角色起，优先把有关系的角色排到相邻位 */
function orderByBond(characters: string[], relations: { from: string; to: string }[]) {
  const degree = new Map(characters.map((name) => [name, 0]));
  const bump = (name: string) => degree.set(name, (degree.get(name) ?? 0) + 1);
  relations.forEach((relation) => {
    if (degree.has(relation.from)) bump(relation.from);
    if (degree.has(relation.to)) bump(relation.to);
  });
  const richest = (names: string[]) =>
    names.reduce((best, name) => ((degree.get(name) ?? 0) > (degree.get(best) ?? 0) ? name : best), names[0]);

  const pool = new Set(characters);
  const ordered: string[] = [];
  let cursor = richest(characters);
  while (pool.size > 0) {
    ordered.push(cursor);
    pool.delete(cursor);
    const linked = [...pool].filter((name) =>
      relations.some(
        (relation) =>
          (relation.from === cursor && relation.to === name) ||
          (relation.to === cursor && relation.from === name),
      ),
    );
    cursor = linked.length > 0 ? richest(linked) : [...pool][0];
  }
  return ordered;
}

/** 均匀布环后按画布可用区域做仿射贴合，角色少的时候也不会缩在中间 */
function ringLayout(characters: string[], relations: { from: string; to: string }[]): Record<string, Point> {
  const count = characters.length;
  if (count === 0) return {};
  const ordered = orderByBond(characters, relations);
  const ring = ordered.map((name, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    return { name, ux: Math.cos(angle), uy: Math.sin(angle) };
  });
  const axis = (key: "ux" | "uy") => ring.map((node) => node[key]);
  const fit = (values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { middle: (min + max) / 2, scale: 1 / ((max - min) / 2 || 1) };
  };
  const fx = fit(axis("ux"));
  const fy = fit(axis("uy"));
  const rx = (W - MARGIN_X * 2) / 2;
  const ry = (H - MARGIN_Y * 2) / 2;
  return Object.fromEntries(
    ring.map((node) => [
      node.name,
      {
        x: CX + (node.ux - fx.middle) * fx.scale * rx,
        y: CY + (node.uy - fy.middle) * fy.scale * ry,
      },
    ]),
  );
}

const keepInside = (p: Point): Point => ({
  x: clamp(p.x, MARGIN_X - 40, W - MARGIN_X + 40),
  y: clamp(p.y, MARGIN_Y - 34, H - MARGIN_Y + 34),
});

type Gesture = {
  mode: "none" | "pan" | "node" | "pinch";
  node: string | null;
  lastX: number;
  lastY: number;
  originX: number;
  originY: number;
  moved: boolean;
  pinchBase: number;
  pinchK: number;
};

const idleGesture = (): Gesture => ({
  mode: "none",
  node: null,
  lastX: 0,
  lastY: 0,
  originX: 0,
  originY: 0,
  moved: false,
  pinchBase: 0,
  pinchK: 1,
});

export default function CharacterGraph() {
  const [slug, setSlug] = useState<string>(animations[0].slug);
  const animation = useMemo(
    () => animations.find((item) => item.slug === slug) ?? animations[0],
    [slug],
  );
  const totalCharacters = animations.reduce((total, item) => total + item.characters.length, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Character Constellation</p>
          <h1 className="retro-title mt-2 flex items-center gap-3 text-5xl text-[#fff6e8]">
            角色关系图谱 <Network size={26} className="text-[#ffd24d]" />
          </h1>
          <p className="memory-text mt-3 max-w-2xl text-base text-[#d9c39a]/82">
            每一部馆藏都是一个小宇宙。点亮一部动画，拖动角色、滚轮缩放，看羁绊如何连成星座。
          </p>
        </div>
        <span className="cassette-label w-fit">
          <Users size={14} />
          {animations.length} 部馆藏 · {totalCharacters} 位角色
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {animations.map((item) => {
          const active = item.slug === animation.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSlug(item.slug)}
              aria-pressed={active}
              className={`tag-pill ${
                active
                  ? "border-[#ffd24d]/60 bg-[#ffd24d]/15 text-[#ffd24d]"
                  : "border-[#c99a45]/20 bg-[#070806]/50 text-[#d9c39a]/70 hover:border-[#ffd24d]/30 hover:text-[#ffd24d]/80"
              }`}
            >
              {item.name}
              <span className="ml-1 text-[10px] opacity-50">{item.characters.length}</span>
            </button>
          );
        })}
      </div>

      <Constellation key={animation.slug} animation={animation} />
    </div>
  );
}

function Constellation({ animation }: { animation: AnimationRecord }) {
  const reduceMotion = useReducedMotion();
  const slug = animation.slug;
  const layout = useMemo(
    () => ringLayout(animation.characters.map((character) => character.name), animation.relations),
    [animation],
  );
  const ink = useMemo(() => liftColor(animation.color, 0.44), [animation.color]);
  const [positions, setPositions] = useState<Record<string, Point>>(layout);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [zoomLabel, setZoomLabel] = useState(100);
  const [gestureOn, setGestureOn] = useState(false);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);

  const isCoarse = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(pointer: coarse)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );

  const gestureUnlocked = !isCoarse || gestureOn;

  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<SVGGElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture>(idleGesture());

  const vx = useMotionValue(0);
  const vy = useMotionValue(0);
  const k = useMotionValue(1);

  /* Pan and zoom write straight to the SVG transform attribute through motion
     values, so dragging never waits on a React render. */
  useEffect(() => {
    const group = viewRef.current;
    if (!group) return;
    const apply = () =>
      group.setAttribute("transform", `translate(${vx.get()} ${vy.get()}) scale(${k.get()})`);
    const report = () => {
      const next = Math.round(k.get() * 100);
      setZoomLabel((prev) => (prev === next ? prev : next));
    };
    const unsubscribes = [
      vx.on("change", apply),
      vy.on("change", apply),
      k.on("change", apply),
      k.on("change", report),
    ];
    apply();
    return () => unsubscribes.forEach((stop) => stop());
  }, [vx, vy, k]);

  const stopViewAnimations = useCallback(() => {
    [vx, vy, k].forEach((value) => value.stop());
  }, [k, vx, vy]);

  const clampTranslate = useCallback((tx: number, ty: number, scale: number) => {
    const slack = 160;
    return {
      x: clamp(tx, -(scale * W) + slack, W - slack),
      y: clamp(ty, -(scale * H) + slack, H - slack),
    };
  }, []);

  const animateView = useCallback(
    (targetK: number, tx: number, ty: number) => {
      stopViewAnimations();
      const spring = { type: "spring", stiffness: 430, damping: 38, mass: 0.6 } as const;
      animate(k, targetK, spring);
      animate(vx, tx, spring);
      animate(vy, ty, spring);
    },
    [k, stopViewAnimations, vx, vy],
  );

  const setView = useCallback(
    (targetK: number, tx: number, ty: number) => {
      k.set(targetK);
      vx.set(tx);
      vy.set(ty);
    },
    [k, vx, vy],
  );

  const resetView = useCallback(() => {
    stopViewAnimations();
    const spring = { type: "spring", stiffness: 260, damping: 30, mass: 0.8 } as const;
    animate(k, 1, spring);
    animate(vx, 0, spring);
    animate(vy, 0, spring);
  }, [k, stopViewAnimations, vx, vy]);

  const toViewBox = useCallback((clientX: number, clientY: number): Point & { scale: number } => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: clientX, y: clientY, scale: 1 };
    const inverse = ctm.inverse();
    return {
      x: clientX * inverse.a + clientY * inverse.c + inverse.e,
      y: clientX * inverse.b + clientY * inverse.d + inverse.f,
      scale: ctm.a || 1,
    };
  }, []);

  const projectZoom = useCallback(
    (px: number, py: number, nextK: number) => {
      const kk = clamp(nextK, MIN_K, MAX_K);
      const k0 = k.get();
      const wx = (px - vx.get()) / k0;
      const wy = (py - vy.get()) / k0;
      const moved = clampTranslate(px - wx * kk, py - wy * kk, kk);
      return { kk, tx: moved.x, ty: moved.y };
    },
    [clampTranslate, k, vx, vy],
  );

  const zoomAt = useCallback(
    (px: number, py: number, nextK: number) => {
      const { kk, tx, ty } = projectZoom(px, py, nextK);
      if (reduceMotion) setView(kk, tx, ty);
      else animateView(kk, tx, ty);
    },
    [animateView, projectZoom, reduceMotion, setView],
  );

  const zoomFromToolbar = useCallback(
    (factor: number) => zoomAt(CX, CY, k.get() * factor),
    [k, zoomAt],
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const point = toViewBox(event.clientX, event.clientY);
      zoomAt(point.x, point.y, k.get() * Math.exp(-event.deltaY * 0.0016));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [k, toViewBox, zoomAt]);

  const beginGesture = (event: ReactPointerEvent) => {
    svgRef.current?.setPointerCapture(event.pointerId);
    const current = gesture.current;
    current.lastX = event.clientX;
    current.lastY = event.clientY;
    current.originX = event.clientX;
    current.originY = event.clientY;
    current.moved = false;
  };

  const startPinch = () => {
    const [a, b] = [...pointers.current.values()];
    gesture.current = {
      ...idleGesture(),
      mode: "pinch",
      pinchBase: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      pinchK: k.get(),
    };
    setIsPanning(false);
    setGrabbed(null);
  };

  const onNodePointerDown = (name: string) => (event: ReactPointerEvent<SVGGElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const touchLocked = event.pointerType !== "mouse" && !gestureUnlocked;
    event.stopPropagation();
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (!touchLocked && pointers.current.size === 2) {
      startPinch();
      return;
    }
    gesture.current.mode = "node";
    gesture.current.node = name;
    setGrabbed(name);
    if (touchLocked) {
      const current = gesture.current;
      current.lastX = event.clientX;
      current.lastY = event.clientY;
      current.originX = event.clientX;
      current.originY = event.clientY;
      current.moved = false;
      return;
    }
    beginGesture(event);
  };

  const onCanvasPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.pointerType !== "mouse" && !gestureUnlocked) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      startPinch();
      return;
    }
    gesture.current.mode = "pan";
    setIsPanning(true);
    beginGesture(event);
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const tracked = pointers.current;
    if (!tracked.has(event.pointerId)) return;
    tracked.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const current = gesture.current;

    if (current.mode === "pinch" && tracked.size >= 2) {
      const [a, b] = [...tracked.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > 0) {
        const mid = toViewBox((a.x + b.x) / 2, (a.y + b.y) / 2);
        const { kk, tx, ty } = projectZoom(mid.x, mid.y, (current.pinchK * distance) / current.pinchBase);
        setView(kk, tx, ty);
      }
      return;
    }

    if (current.mode === "none") return;
    if (event.pointerType !== "mouse" && !gestureUnlocked) return;
    if (Math.hypot(event.clientX - current.originX, event.clientY - current.originY) > CLICK_SLOP) {
      current.moved = true;
    }

    const scale = toViewBox(event.clientX, event.clientY).scale;
    const dx = (event.clientX - current.lastX) / scale;
    const dy = (event.clientY - current.lastY) / scale;
    current.lastX = event.clientX;
    current.lastY = event.clientY;

    if (current.mode === "pan") {
      stopViewAnimations();
      const next = clampTranslate(vx.get() + dx, vy.get() + dy, k.get());
      vx.set(next.x);
      vy.set(next.y);
      return;
    }

    if (current.mode === "node" && current.node) {
      const name = current.node;
      const kk = k.get();
      setPositions((prev) => {
        const point = prev[name];
        if (!point) return prev;
        return { ...prev, [name]: keepInside({ x: point.x + dx / kk, y: point.y + dy / kk }) };
      });
    }
  };

  const endGesture = (event: ReactPointerEvent<SVGSVGElement>, allowClick = true) => {
    const tracked = pointers.current;
    const wasThere = tracked.delete(event.pointerId);
    if (gesture.current.mode === "pinch" && tracked.size === 1) {
      const [, remaining] = [...tracked.entries()][0];
      gesture.current = {
        ...idleGesture(),
        mode: "pan",
        lastX: remaining.x,
        lastY: remaining.y,
        originX: remaining.x,
        originY: remaining.y,
        moved: true,
      };
      setIsPanning(true);
      return;
    }

    const current = gesture.current;
    if (allowClick && wasThere && !current.moved) {
      if (current.mode === "node" && current.node) {
        const name = current.node;
        setSelected((prev) => (prev === name ? null : name));
      } else if (current.mode === "pan") {
        setSelected(null);
      }
    }
    gesture.current = idleGesture();
    setGrabbed(null);
    setIsPanning(false);
  };

  const onDoubleClick = (event: ReactMouseEvent<SVGSVGElement>) => {
    const point = toViewBox(event.clientX, event.clientY);
    if (k.get() >= MAX_K - 0.01) resetView();
    else zoomAt(point.x, point.y, k.get() * 1.7);
  };

  const panBy = (dx: number, dy: number) => {
    stopViewAnimations();
    const next = clampTranslate(vx.get() + dx, vy.get() + dy, k.get());
    vx.set(next.x);
    vy.set(next.y);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setSelected(null);
      return;
    }
    const step = event.shiftKey ? 90 : 45;
    if (event.key === "+" || event.key === "=") zoomFromToolbar(1.25);
    else if (event.key === "-" || event.key === "_") zoomFromToolbar(0.8);
    else if (event.key === "0") resetView();
    else if (event.key === "ArrowLeft") panBy(step, 0);
    else if (event.key === "ArrowRight") panBy(-step, 0);
    else if (event.key === "ArrowUp") panBy(0, step);
    else if (event.key === "ArrowDown") panBy(0, -step);
    else return;
    event.preventDefault();
  };

  const nodes = useMemo(
    () =>
      animation.characters.map((character) => ({
        name: character.name,
        ...(positions[character.name] ?? layout[character.name]),
      })),
    [animation.characters, layout, positions],
  );

  const nodeByName = useMemo(() => new Map(nodes.map((node) => [node.name, node])), [nodes]);

  const coStarEdges = useMemo(() => {
    const linked = new Set(
      animation.relations.map((relation) => [relation.from, relation.to].sort().join("|")),
    );
    const edges: { x1: number; y1: number; x2: number; y2: number; from: string; to: string }[] = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const key = [nodes[i].name, nodes[j].name].sort().join("|");
        if (linked.has(key)) continue;
        edges.push({
          from: nodes[i].name,
          to: nodes[j].name,
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
        });
      }
    }
    return edges;
  }, [nodes, animation.relations]);

  const relationEdges = useMemo(
    () =>
      animation.relations
        .map((relation) => {
          const from = nodeByName.get(relation.from);
          const to = nodeByName.get(relation.to);
          if (!from || !to) return null;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          // 弧线向心内收：直线穿心会让整张图变成星芒，控制点外推又会顶出画布
          const ctrlX = midX + (CX - midX) * 0.17;
          const ctrlY = midY + (CY - midY) * 0.17;
          return {
            ...relation,
            family: familyOf(relation.label),
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            path: `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`,
            mx: from.x * 0.25 + ctrlX * 0.5 + to.x * 0.25,
            my: from.y * 0.25 + ctrlY * 0.5 + to.y * 0.25,
            length: Math.hypot(to.x - from.x, to.y - from.y) * 1.06,
          };
        })
        .filter((edge): edge is NonNullable<typeof edge> => edge !== null),
    [animation.relations, nodeByName],
  );

  const activeName = selected ?? hovered;

  const spotlight = useMemo(() => {
    if (!activeName) return null;
    const names = new Set([activeName]);
    animation.relations.forEach((relation) => {
      if (relation.from === activeName) names.add(relation.to);
      if (relation.to === activeName) names.add(relation.from);
    });
    return names;
  }, [activeName, animation.relations]);

  const legendRows = useMemo(() => {
    const counts = new Map<string, { key: string; label: string; color: string; count: number }>();
    animation.relations.forEach((relation) => {
      const family = familyOf(relation.label);
      const row = counts.get(family.key);
      if (row) row.count += 1;
      else counts.set(family.key, { key: family.key, label: family.label, color: family.color, count: 1 });
    });
    return [...counts.values()];
  }, [animation.relations]);

  const flow = reduceMotion ? undefined : "constellation-flow";
  const drift = reduceMotion ? undefined : "constellation-drift";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="museum-card overflow-hidden rounded-2xl border border-[#c99a45]/22 bg-[#0b0a07]/92 p-3 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-[#c99a45]/26 bg-[#070806]/70 px-1.5 py-1">
          <button type="button" className="graph-tool" aria-label="缩小图谱" onClick={() => zoomFromToolbar(0.8)}>
            <Minus size={15} />
          </button>
          <span className="min-w-[52px] text-center font-mono text-[11px] font-black text-[#f2c96a]">
            {zoomLabel}%
          </span>
          <button type="button" className="graph-tool" aria-label="放大图谱" onClick={() => zoomFromToolbar(1.25)}>
            <Plus size={15} />
          </button>
        </div>
        <button type="button" className="graph-tool gap-1.5 px-3" onClick={resetView}>
          <Maximize2 size={14} />
          <span className="text-[11px] font-black">适应画布</span>
        </button>
        <button
          type="button"
          className="graph-tool gap-1.5 px-3"
          onClick={() => {
            setPositions(layout);
            setSelected(null);
          }}
        >
          <RotateCcw size={14} />
          <span className="text-[11px] font-black">重新排布</span>
        </button>
        <button
          type="button"
          className="graph-tool gap-1.5 px-3"
          aria-pressed={showEdgeLabels}
          onClick={() => setShowEdgeLabels((prev) => !prev)}
        >
          <Tags size={14} />
          <span className="text-[11px] font-black">关系标签</span>
        </button>
        {isCoarse ? (
          <button
            type="button"
            className="graph-tool gap-1.5 px-3"
            aria-pressed={gestureOn}
            onClick={() => setGestureOn((prev) => !prev)}
          >
            <Hand size={14} />
            <span className="text-[11px] font-black">画布手势：{gestureOn ? "开" : "关"}</span>
          </button>
        ) : null}
        <p className="ml-auto text-[11px] font-bold text-[#d9c39a]/72">
          {isCoarse
            ? gestureOn
              ? "拖动角色改位置 · 拖空白平移 · 双指缩放"
              : "点角色看档案 · 开启手势后可编辑画布"
            : "拖动角色改位置 · 拖空白平移 · 滚轮缩放 · 点击看羁绊"}
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-[#c99a45]/22"
        role="region"
        aria-label={`${animation.name}角色关系图`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="constellation-canvas h-auto w-full"
          style={{ touchAction: gestureUnlocked ? "none" : "pan-y" }}
          data-panning={isPanning || grabbed ? "true" : "false"}
          onPointerDown={onCanvasPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => endGesture(event, true)}
          onPointerCancel={(event) => endGesture(event, false)}
          onDoubleClick={onDoubleClick}
        >
          <defs>
            <radialGradient id={`canvas-bg-${slug}`}>
              <stop offset="0%" stopColor="#191307" stopOpacity="0.96" />
              <stop offset="55%" stopColor="#0b0a06" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#040403" stopOpacity="1" />
            </radialGradient>
            <radialGradient id={`center-glow-${slug}`}>
              <stop offset="0%" stopColor={ink} stopOpacity="0.2" />
              <stop offset="45%" stopColor={ink} stopOpacity="0.07" />
              <stop offset="100%" stopColor={ink} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`node-halo-${slug}`}>
              <stop offset="0%" stopColor={ink} stopOpacity="0.34" />
              <stop offset="52%" stopColor={ink} stopOpacity="0.15" />
              <stop offset="100%" stopColor={ink} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`node-face-${slug}`}>
              <stop offset="0%" stopColor={ink} stopOpacity="0.46" />
              <stop offset="70%" stopColor={ink} stopOpacity="0.14" />
              <stop offset="100%" stopColor={ink} stopOpacity="0.05" />
            </radialGradient>
            <pattern id={`star-grid-${slug}`} width="46" height="46" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#e8bd6c" fillOpacity="0.16" />
              <circle cx="25" cy="26" r="0.8" fill="#e8bd6c" fillOpacity="0.1" />
            </pattern>
          </defs>

          <rect width={W} height={H} fill={`url(#canvas-bg-${slug})`} />

          <g ref={viewRef}>
            <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#star-grid-${slug})`} />

            <circle cx={CX} cy={CY} r="252" fill={`url(#center-glow-${slug})`} />

            <g stroke="#c9a25f" strokeLinecap="round" fill="none">
              {activeName
                ? coStarEdges
                    .filter((edge) => edge.from === activeName || edge.to === activeName)
                    .map((edge, index) => (
                      <line
                        key={`co-${index}`}
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        strokeOpacity="0.26"
                        strokeWidth="1.2"
                        strokeDasharray="3 12"
                      />
                    ))
                : null}
            </g>

            {relationEdges.map((edge, index) => {
              const lit = !activeName || edge.from === activeName || edge.to === activeName;
              const width = labelWidth(edge.label);
              const showLabel = showEdgeLabels || Boolean(activeName && lit);
              return (
                <g
                  key={`rel-${index}`}
                  opacity={lit ? 1 : 0.2}
                  style={{ transition: "opacity .25s ease" }}
                >
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={edge.family.color}
                    strokeOpacity={lit ? 0.18 : 0.07}
                    strokeWidth={lit ? 12 : 7}
                    strokeLinecap="round"
                  />
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={edge.family.color}
                    strokeOpacity={lit ? 0.95 : 0.55}
                    strokeWidth={lit ? 3.2 : 2.2}
                    strokeLinecap="round"
                  />
                  <path
                    d={edge.path}
                    fill="none"
                    stroke="#fff6e8"
                    strokeOpacity={lit ? 0.8 : 0}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`8 ${Math.max(edge.length - 8, 26)}`}
                    className={flow}
                  />
                  {showLabel ? (
                    <g transform={`translate(${edge.mx} ${edge.my})`}>
                      <rect
                        x={-width / 2}
                        y={-12}
                        width={width}
                        height="24"
                        rx="12"
                        fill="#0a0805"
                        stroke={edge.family.color}
                        strokeOpacity={lit ? 0.75 : 0.25}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        y="4.5"
                        fontSize="12.5"
                        fontWeight="800"
                        letterSpacing="1"
                        fill={lit ? edge.family.color : "#a98a52"}
                      >
                        {edge.label}
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            })}

            {nodes.map((node, index) => {
              const isActive = activeName === node.name;
              const isSelected = selected === node.name;
              const dimmed = Boolean(spotlight && !spotlight.has(node.name));
              const bondCount = animation.relations.filter(
                (relation) => relation.from === node.name || relation.to === node.name,
              ).length;
              return (
                <g
                  key={node.name}
                  transform={`translate(${node.x} ${node.y})`}
                  className="constellation-node"
                  role="button"
                  tabIndex={0}
                  aria-label={`角色 ${node.name}，${bondCount} 段关系`}
                  aria-pressed={isSelected}
                  onPointerDown={onNodePointerDown(node.name)}
                  onPointerEnter={() => setHovered(node.name)}
                  onPointerLeave={() => setHovered((prev) => (prev === node.name ? null : prev))}
                  onFocus={() => setHovered(node.name)}
                  onBlur={() => setHovered((prev) => (prev === node.name ? null : prev))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected((prev) => (prev === node.name ? null : node.name));
                    }
                  }}
                >
                  <motion.g
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 + index * 0.05, type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <motion.g
                      initial={false}
                      animate={{
                        scale: dimmed ? 0.9 : isActive ? 1.14 : 1,
                        opacity: dimmed ? 0.3 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 340, damping: 24 }}
                    >
                      <circle
                        r={NODE_R + 17}
                        fill={`url(#node-halo-${slug})`}
                        opacity={isActive ? 1 : 0.62}
                        style={{ transition: "opacity .25s ease" }}
                      />
                      <circle
                        r={NODE_R}
                        fill="#0a0806"
                        stroke={ink}
                        strokeOpacity={isActive ? 1 : 0.78}
                        strokeWidth={isActive ? 3 : 2}
                      />
                      <circle r={NODE_R - 1} fill={`url(#node-face-${slug})`} />
                      <circle
                        r={NODE_R - 1}
                        fill="none"
                        stroke="#fff6e8"
                        strokeOpacity={isActive ? 0.26 : 0.1}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        y={5}
                        fontSize={nodeFontSize(node.name)}
                        fontWeight="800"
                        fill="#fffaef"
                      >
                        {node.name}
                      </text>
                      {isSelected ? (
                        <circle
                          r={NODE_R + 8}
                          fill="none"
                          stroke="#ffd24d"
                          strokeOpacity="0.72"
                          strokeWidth="1.5"
                          strokeDasharray="3 7"
                          className={drift}
                        />
                      ) : null}
                    </motion.g>
                  </motion.g>
                  <circle r={NODE_R + 12} fill="transparent" />
                </g>
              );
            })}
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 sm:left-5 sm:top-5">
          <p className="archive-kicker text-[10px] font-black text-[#d8ac55]/62">
            Exhibit {String(animation.id).padStart(2, "0")}
          </p>
          <p className="retro-title mt-1 text-2xl leading-tight text-[#fff6e8] sm:text-[1.9rem]">
            {animation.name}
          </p>
          <p className="mt-1 font-mono text-[11px] font-black tracking-[0.16em] text-[#f2c96a]/78">
            {animation.year} · {animation.genre.join(" / ")}
          </p>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-mono text-[10px] font-black tracking-[0.2em] text-[#d9c39a]/62">
          节点 {animation.characters.length} · 边 {animation.relations.length} · 选中 {selected ?? "无"}
        </p>

        <AnimatePresence>
          {selected ? (
            <CharacterCard
              key={selected}
              animation={animation}
              name={selected}
              onClose={() => setSelected(null)}
              onPick={(next) => setSelected(next)}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-4 grid gap-3 border-t border-[#c99a45]/12 pt-4 sm:grid-cols-2">
        <div>
          <p className="archive-kicker text-[11px] font-black text-[#d8ac55]/70">已标注的关系</p>
          <ul className="mt-2 space-y-1.5">
            {animation.relations.map((relation) => (
              <li key={`${relation.from}-${relation.to}`}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm font-bold text-[#f0ddba]/85 transition hover:bg-[#ffd24d]/10 hover:text-[#fff6e8]"
                  onClick={() => setSelected((prev) => (prev === relation.from ? null : relation.from))}
                >
                  <span>{relation.from}</span>
                  <span className="rounded border border-[#ffd24d]/40 bg-[#ffd24d]/10 px-1.5 py-0.5 text-[11px] text-[#ffd24d]">
                    {relation.label}
                  </span>
                  <span>{relation.to}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm leading-6 text-[#d9c39a]/78">
          <p className="archive-kicker text-[11px] font-black text-[#d8ac55]/70">关系图例</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {legendRows.map((row) => (
              <li key={row.key} className="flex items-center gap-1.5 text-[12px] font-bold">
                <span className="h-[3px] w-6 rounded-full" style={{ background: row.color }} />
                <span className="text-[#f0ddba]/90">{row.label}</span>
                <span className="font-mono text-[10px] text-[#d9c39a]/60">{row.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] leading-5 text-[#d9c39a]/70">
            默认只画线不画标签；鼠标移到角色上、或打开「关系标签」，才显出每一段的原文。
          </p>
          <Link
            href={`/archive/${animation.slug}`}
            className="retro-button retro-button-ghost mt-3 inline-flex text-xs"
          >
            查看《{animation.name}》完整档案 →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function CharacterCard({
  animation,
  name,
  onClose,
  onPick,
}: {
  animation: AnimationRecord;
  name: string;
  onClose: () => void;
  onPick: (next: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const profile = useMemo(
    () => animation.characters.find((character) => character.name === name),
    [animation.characters, name],
  );

  const bonds = useMemo(
    () =>
      animation.relations
        .filter((relation) => relation.from === name || relation.to === name)
        .map((relation) => ({
          other: relation.from === name ? relation.to : relation.from,
          label: relation.label,
        })),
    [animation.relations, name],
  );

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    <div className="absolute inset-0 z-10">
      <button
        type="button"
        aria-label="关闭人物档案"
        className="absolute inset-0 cursor-zoom-out bg-[#040403]/62 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-label={`${name} 的人物档案`}
        tabIndex={-1}
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="absolute inset-x-3 bottom-3 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl border border-[#c99a45]/38 bg-[#0b0a07]/97 p-4 shadow-[0_26px_70px_rgba(0,0,0,.6)] outline-none sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:w-[19.5rem]"
        style={{ borderTopColor: animation.color }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="archive-kicker text-[10px] font-black text-[#d8ac55]/70">Character Profile</p>
            <h2 className="retro-title mt-1 text-3xl leading-tight text-[#fff6e8]">{name}</h2>
          </div>
          <button
            type="button"
            aria-label="关闭人物档案"
            onClick={onClose}
            className="graph-tool shrink-0 border-[#c99a45]/30"
          >
            <X size={14} />
          </button>
        </div>

        {profile?.role ? <p className="mt-2 text-sm font-black text-[#ffe4a3]">{profile.role}</p> : null}
        <p className="mt-1 font-mono text-[11px] font-black text-[#f2c96a]/85">
          《{animation.name}》 · {animation.year} · {animation.genre.join(" / ")}
        </p>

        <section className="mt-4">
          <p className="archive-kicker flex items-center gap-1.5 text-[10px] font-black text-[#d8ac55]/70">
            <Link2 size={12} /> 羁绊
          </p>
          {bonds.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {bonds.map((bond) => (
                <li key={`${bond.label}-${bond.other}`}>
                  <button
                    type="button"
                    onClick={() => onPick(bond.other)}
                    className="flex w-full items-center gap-2 rounded-lg border border-[#c99a45]/16 bg-[#070806]/60 px-2.5 py-1.5 text-left text-sm font-bold text-[#f0ddba]/90 transition hover:border-[#ffd24d]/45 hover:text-[#fff6e8]"
                  >
                    <span className="rounded border border-[#ffd24d]/40 bg-[#ffd24d]/10 px-1.5 py-0.5 text-[11px] text-[#ffd24d]">
                      {bond.label}
                    </span>
                    {bond.other}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[#d9c39a]/65">这位角色还没有被标注羁绊，欢迎来补一笔。</p>
          )}
        </section>

        <section className="mt-4">
          <p className="archive-kicker flex items-center gap-1.5 text-[10px] font-black text-[#d8ac55]/70">
            <BookOpen size={12} /> 作品简介
          </p>
          <p className="memory-text mt-2 text-sm leading-6 text-[#d9c39a]/82">{animation.description}</p>
        </section>

        <section className="mt-4 rounded-xl border border-dashed border-[#c99a45]/26 px-3 py-2.5">
          <p className="archive-kicker flex items-center gap-1.5 text-[10px] font-black text-[#d8ac55]/70">
            <Sparkles size={12} /> 人物小传
          </p>
          {profile?.bio ? (
            <p className="memory-text mt-1.5 text-sm leading-6 text-[#e6cf9f]">{profile.bio}</p>
          ) : (
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1.5 inline-block text-sm text-[#e6cf9f]/78 underline decoration-dotted underline-offset-4 transition hover:text-[#ffd24d]"
            >
              这段人物小传待考证 · 提 issue 补资料源
            </a>
          )}
          {profile?.sourceUrl ? (
            <a
              href={profile.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-block font-mono text-[10px] font-black text-[#f2c96a]/60 underline decoration-dotted underline-offset-4 transition hover:text-[#ffd24d]"
            >
              资料源
            </a>
          ) : null}
        </section>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/archive/${animation.slug}`} className="retro-button retro-button-secondary text-xs">
            完整档案
          </Link>
          <Link
            href={animation.baikeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="retro-button retro-button-ghost text-xs"
          >
            百度百科
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
