import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

/*────────────────────────── configurable sizing ──────────────────────────*/
export const CELL_WIDTH = 80;
export const CELL_HEIGHT = 40;
const cellStyle = {
  width: CELL_WIDTH,
  minWidth: CELL_WIDTH,
  maxWidth: CELL_WIDTH,
  height: CELL_HEIGHT,
  minHeight: CELL_HEIGHT,
} as const;

/*──────────────────────────── highlight colors ───────────────────────────*/
export const HIGHLIGHT_LIGHT = "bg-slate-700";
export const HIGHLIGHT       = "bg-slate-800";
export const HIGHLIGHT_DEEP  = "bg-slate-900";

/*──────────────────────────── other styling ──────────────────────────────*/
export const TOP_ROW_BORDER  = "border-b-4 border-b-zinc-500";
export const LEFT_COL_BORDER = "border-r-4 border-r-zinc-500";

/*────────────────────────── persistent storage helpers ───────────────────*/
const STORAGE_KEYS = {
  SETTINGS : "pace-chart-settings",
  HIGHLIGHT: "pace-chart-highlight",
} as const;

function load<T>(key: string, dflt: T): T {
  if (typeof window === "undefined") return dflt;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : dflt;
  } catch {
    return dflt;
  }
}
function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/*──────────────────────────────── types ──────────────────────────────────*/
type Settings = { unit: "km" | "mi"; paceStep: 10 | 15 | 30 | 60 };
type Highlight = { r: number; c: number };

/*──────────────────────── utility fns ─────────────────────────*/
const fmt = (m: number) => {
  const h  = Math.floor(m / 60);
  const mm = String(Math.floor(m % 60)).padStart(2, "0");
  const ss = String(Math.round((m % 1) * 60)).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
function generatePaces(stepSec: number, unit: "km" | "mi"): number[] {
  const vals: number[] = [];
  if (unit === "mi") {
    for (let sec = 180; sec <= 1800; sec += stepSec) vals.push(sec / 60);
  } else {
    for (let sec = 90; sec <= 1080; sec += stepSec) vals.push(sec / 60);
  }
  return vals;
}
const uniqueSorted = (v: number[]) =>
  Array.from(new Set(v.map(x => +x.toFixed(3)))).sort((a, b) => a - b);

/* race‑distance maps */
const RACE_LABELS: Record<number, string> = {
  0.062: "100m", 0.124: "200m", 0.249: "400m", 0.497: "800m", 0.621: "1K",
  0.932: "1.5K", 1.5: "1.5 Mile", 3.107: "5K", 6.214: "10K",
  13.109: "½ M", 26.219: "Marathon",
};
const RACE_LABELS_KM: Record<number, string> = {
  0.1: "100m", 0.2: "200m", 0.4: "400m", 0.8: "800m", 1.0: "1K",
  1.5: "1.5K", 2.414: "1.5 Mile", 5.0: "5K", 10.0: "10K",
  21.097: "½ M", 42.195: "Marathon",
};
function generateDistances(unit: "km" | "mi"): number[] {
  if (unit === "mi") {
    const track = [0.062, 0.124, 0.249, 0.497];
    const std   = [0.621, 0.932, 1, 1.5, 3.107, 6.214, 13.109, 26.219];
    const miles = Array.from({ length: 100 }, (_, i) => i + 1);
    return uniqueSorted([...track, ...std, ...miles]);
  }
  const track = [0.1, 0.2, 0.4, 0.8];
  const std   = [1, 1.5, 2.414, 5, 10, 21.097, 42.195];
  const km = [
    2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    22, 23, 24, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160.934,
  ];
  return uniqueSorted([...track, ...std, ...km]);
}

/*──────────────────────── defaults (5 km @ 10 min/mi) ─────────────────────*/
const DEFAULT_SETTINGS: Settings = { unit: "mi", paceStep: 10 };
const DEFAULT_HL: Highlight = (() => {
  const dists = generateDistances(DEFAULT_SETTINGS.unit);
  const paces = generatePaces(DEFAULT_SETTINGS.paceStep, DEFAULT_SETTINGS.unit);
  const col = dists.findIndex(d => Math.abs(d - 3.107) < 0.01); // 5 km in mi
  const row = paces.findIndex(p => Math.abs(p - 10) < 1e-6);    // 10 min/mi
  return { r: row >= 0 ? row : 0, c: col >= 0 ? col : 0 };
})();

/*────────────────────────────── component ───────────────────────────────*/
export default function PaceChart() {
  /*──────── state ────────*/
  const [settings, setSettings] = useState<Settings>(() =>
    load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [hl, setHL] = useState<Highlight>(() =>
    load(STORAGE_KEYS.HIGHLIGHT, DEFAULT_HL)
  );
  const [open, setOpen] = useState(false);

  /*──────── derived data ────────*/
  const dists = useMemo(() => generateDistances(settings.unit), [settings.unit]);
  const paces = useMemo(
    () => generatePaces(settings.paceStep, settings.unit),
    [settings.paceStep, settings.unit]
  );

  /*──────── persist on change ────────*/
  useEffect(() => save(STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => save(STORAGE_KEYS.HIGHLIGHT, hl), [hl]);

  /*──────── scrolling refs ────────*/
  const bodyRef   = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sync = () => {
    if (headerRef.current && bodyRef.current)
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
  };

  /*──────── mouse drag‑scroll logic (unchanged) ────────*/
  const dragging = useRef(false);
  const moved    = useRef(false);
  const start    = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const dragId   = useRef<number | null>(null);
  const down = (e: React.PointerEvent) => {
    if (e.button || e.pointerType !== "mouse") return;
    if ((e.target as HTMLElement).closest("button")) return;
    dragging.current = true;
    moved.current = false;
    dragId.current = e.pointerId;
    start.current = {
      x: e.clientX, y: e.clientY,
      sx: bodyRef.current!.scrollLeft, sy: bodyRef.current!.scrollTop,
    };
  };
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !dragging.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (!moved.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      moved.current = true;
      bodyRef.current?.classList.add("cursor-grabbing");
      bodyRef.current?.setPointerCapture(dragId.current!);
      e.preventDefault();
    }
    if (moved.current) {
      bodyRef.current!.scrollLeft = start.current.sx - dx;
      bodyRef.current!.scrollTop  = start.current.sy - dy;
      sync();
    }
  };
  const up = () => {
    if (dragId.current && bodyRef.current?.hasPointerCapture(dragId.current))
      bodyRef.current.releasePointerCapture(dragId.current);
    dragging.current = false;
    moved.current = false;
    dragId.current = null;
    bodyRef.current?.classList.remove("cursor-grabbing");
  };

  /*──────── one‑time auto‑centre ────────*/
  const didInitialScroll = useRef(false);
  useLayoutEffect(() => {
    if (didInitialScroll.current || !dists.length || !paces.length) return;
    const br = bodyRef.current;
    if (!br) return;

    const col = hl.c ?? 0;
    const row = hl.r ?? 0;

    const cellCenterX = (col + 1.5) * CELL_WIDTH; // +1 for sticky col
    const cellCenterY = (row + 0.5) * CELL_HEIGHT;

    const desiredLeft = Math.max(
      0,
      Math.min(cellCenterX - br.clientWidth  / 2, br.scrollWidth  - br.clientWidth)
    );
    const desiredTop  = Math.max(
      0,
      Math.min(cellCenterY - br.clientHeight / 2, br.scrollHeight - br.clientHeight)
    );

    requestAnimationFrame(() => {
      br.scrollLeft = desiredLeft;
      br.scrollTop  = desiredTop;
      headerRef.current && (headerRef.current.scrollLeft = desiredLeft);
      didInitialScroll.current = true;
    });
  }, [dists.length, paces.length]); // no hl dependency

  /*──────── highlight helpers ────────*/
  const toggleCol  = (c: number) => setHL(p => ({ r: p.r,       c: p.c === c ? null : c }));
  const toggleRow  = (r: number) => setHL(p => ({ r: p.r === r ? null : r, c: p.c       }));
  const toggleCell = (r: number, c: number) =>
    setHL(p => (p.r === r && p.c === c ? { r: null, c: null } : { r, c }));
  const clearHL = () => setHL({ r: 0, c: 0 });

  /*──────── mobile double‑tap helper ────────*/
  const lastTap = useRef(0);
  const touchHandler =
    <A extends unknown[]>(fn: (...a: A) => void, ...args: A) =>
    (e: React.TouchEvent) => {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        e.preventDefault();
        fn(...args);
      }
      lastTap.current = now;
    };

  /*──────── label helpers ────────*/
  const paceLabel = (p: number) => `${fmt(p)} /${settings.unit}`;
  const distLabel = (d: number) => {
    const map = settings.unit === "mi" ? RACE_LABELS : RACE_LABELS_KM;
    for (const [k, v] of Object.entries(map))
      if (Math.abs(parseFloat(k) - d) < 0.01) return v;
    const txt = d < 1 ? d.toFixed(3) : d % 1 ? d.toFixed(1) : d.toString();
    return `${txt} ${settings.unit}`;
  };
  const isRaceDist = (d: number) => {
    const map = settings.unit === "mi" ? RACE_LABELS : RACE_LABELS_KM;
    return Object.keys(map).some(k => Math.abs(parseFloat(k) - d) < 0.01);
  };
  const cx = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ");

  /*──────────────────────── render – unchanged below this line ────────────*/
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden text-zinc-100 bg-zinc-900">
      {/* header */}
      <div
        ref={headerRef}
        className="sticky top-0 bg-zinc-800 border-b border-zinc-700 z-30 overflow-hidden"
      >
        <table className="table-fixed border-separate border-spacing-0 select-none w-max min-w-full">
          <thead>
            <tr>
              <th
                style={cellStyle}
                className={cx(
                  "box-border border border-zinc-700 sticky left-0 z-30 bg-zinc-700",
                  TOP_ROW_BORDER,
                  LEFT_COL_BORDER
                )}
              >
                <button
                  onClick={() => setOpen(true)}
                  className="p-1 hover:text-blue-400"
                >
                  <Cog6ToothIcon className="h-5 w-5 mx-auto" />
                </button>
              </th>
              {dists.map((d, i) => (
                <th
                  key={i}
                  style={cellStyle}
                  onDoubleClick={e => {
                    e.stopPropagation();
                    toggleCol(i);
                  }}
                  onTouchEnd={touchHandler(toggleCol, i)}
                  className={cx(
                    hl.c === i ? HIGHLIGHT_LIGHT : "bg-zinc-800",
                    "box-border border border-zinc-700 cursor-pointer select-none text-sm",
                    TOP_ROW_BORDER,
                    isRaceDist(d) && "font-semibold text-blue-400"
                  )}
                >
                  {distLabel(d)}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        className="relative flex-1 min-h-0 min-w-0 overflow-auto cursor-grab overscroll-none touch-pan-x touch-pan-y will-change-scroll select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={sync}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      >
        <table className="table-fixed border-separate border-spacing-0 w-max min-w-full select-none">
          <tbody>
            {paces.map((p, r) => (
              <tr key={r}>
                <th
                  style={cellStyle}
                  onDoubleClick={e => {
                    e.stopPropagation();
                    toggleRow(r);
                  }}
                  onTouchEnd={touchHandler(toggleRow, r)}
                  className={cx(
                    "box-border border border-zinc-700 sticky left-0 z-10 cursor-pointer text-xs",
                    hl.r === r ? HIGHLIGHT_LIGHT : "bg-zinc-800",
                    LEFT_COL_BORDER
                  )}
                >
                  {paceLabel(p)}
                </th>
                {dists.map((d, c) => {
                  const both     = hl.r === r && hl.c === c;
                  const rowOrCol = hl.r === r || hl.c === c;
                  return (
                    <td
                      key={c}
                      style={cellStyle}
                      onDoubleClick={e => {
                        e.stopPropagation();
                        toggleCell(r, c);
                      }}
                      onTouchEnd={touchHandler(toggleCell, r, c)}
                      className={cx(
                        "box-border border border-zinc-700 text-center text-xs font-light text-zinc-300 cursor-pointer",
                        both ? HIGHLIGHT_DEEP : rowOrCol && HIGHLIGHT,
                        "hover:bg-slate-700"
                      )}
                    >
                      {fmt(p * d)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* settings modal (unchanged) */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-md font-semibold mb-4">Settings</h2>
            <label className="block mb-4">
              <span className="mr-2">Units:</span>
              <select
                value={settings.unit}
                onChange={e =>
                  setSettings({ ...settings, unit: e.target.value as "km" | "mi" })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
              >
                <option value="mi">Miles</option>
                <option value="km">Kilometers</option>
              </select>
            </label>
            <label className="block mb-6">
              <span className="mr-2">Pace interval:</span>
              <select
                value={settings.paceStep}
                onChange={e =>
                  setSettings({
                    ...settings,
                    paceStep: Number(e.target.value) as 10 | 15 | 30 | 60,
                  })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
              >
                <option value={10}>10 s</option>
                <option value={15}>15 s</option>
                <option value={30}>30 s</option>
                <option value={60}>60 s</option>
              </select>
            </label>
            <div className="flex justify-end gap-4">
              <button
                onClick={clearHL}
                className="text-xs px-3 py-1 border border-zinc-600 rounded hover:bg-zinc-700"
              >
                Clear highlight
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
