import { useEffect, useRef, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

/*────────────────────────── configurable sizing ──────────────────────────*/
export const CELL_WIDTH = 80; // pixels
export const CELL_HEIGHT = 40; // pixels
const cellStyle = {
  width: CELL_WIDTH,
  minWidth: CELL_WIDTH,
  maxWidth: CELL_WIDTH,
  height: CELL_HEIGHT,
  minHeight: CELL_HEIGHT,
} as const;

/*──────────────────────────── highlight colors ───────────────────────────*/
export const HIGHLIGHT_LIGHT = "bg-slate-700";
export const HIGHLIGHT = "bg-slate-800";
export const HIGHLIGHT_DEEP = "bg-slate-900";

/*──────────────────────────── data & helpers ─────────────────────────────*/
const KM = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
  1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6,
  6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21.1, 25, 30, 35, 40, 42.2, 50, 60, 70, 80, 90, 100,
];
const PACE = [
  3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5,
  8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5,
  13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5,
  18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5,
  23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5,
  28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32,
];

/*────────────────────────────── other styling ───────────────────────────*/
export const TOP_ROW_BORDER = "border-b-4 border-b-zinc-500";
export const LEFT_COL_BORDER = "border-r-4 border-r-zinc-500";

/*────────────────────────── localStorage helpers ──────────────────────────*/
const STORAGE_KEYS = {
  SETTINGS: "pace-chart-settings",
  HIGHLIGHT: "pace-chart-highlight",
};

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

/*──────────────────────────────── types ─────────────────────────────────*/
type Settings = { unit: "km" | "mi" };
type Highlight = { r: number | null; c: number | null };

const km2mi = (k: number) => +(k * 0.621371).toFixed(2);
const fmt = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = Math.floor(m % 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.round((m % 1) * 60)
    .toString()
    .padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/*────────────────────────────── component ───────────────────────────────*/
export default function PaceChart() {
  // Initialise state from localStorage
  const [settings, setSettings] = useState<Settings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, { unit: "km" }),
  );
  const [hl, setHL] = useState<Highlight>(() =>
    loadFromStorage(STORAGE_KEYS.HIGHLIGHT, { r: null, c: null }),
  );
  const [open, setOpen] = useState(false);
  const dist = settings.unit === "km" ? KM : KM.map(km2mi);

  // Persist state → localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HIGHLIGHT, hl);
  }, [hl]);

  /* refs & scroll sync */
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sync = () => {
    if (headerRef.current && bodyRef.current)
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
  };

  /* drag‑to‑scroll logic – pointer‑capture only **after** threshold */
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const start = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const dragPointer = useRef<number | null>(null);

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // left‑click only
    // Ignore clicks on UI controls but still allow cell clicks / dblclicks
    if (e.target instanceof HTMLElement && e.target.closest("button")) return;

    dragging.current = true;
    hasMoved.current = false;
    dragPointer.current = e.pointerId;

    start.current = {
      x: e.clientX,
      y: e.clientY,
      sx: bodyRef.current!.scrollLeft,
      sy: bodyRef.current!.scrollTop,
    };
  };

  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return;

    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    const threshold = 5;

    // Once user actually moves far enough, we engage the grab‑scroll mode
    if (!hasMoved.current && (Math.abs(dx) > threshold || Math.abs(dy) > threshold)) {
      hasMoved.current = true;
      bodyRef.current?.classList.add("cursor-grabbing");
      // Capture now so further pointer events keep coming even if we leave the div
      bodyRef.current?.setPointerCapture(dragPointer.current!);
      e.preventDefault();
    }

    if (hasMoved.current) {
      bodyRef.current!.scrollLeft = start.current.sx - dx;
      bodyRef.current!.scrollTop = start.current.sy - dy;
      sync();
    }
  };

  const up = (e: React.PointerEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (
      dragPointer.current !== null &&
      bodyRef.current?.hasPointerCapture(dragPointer.current)
    ) {
      bodyRef.current.releasePointerCapture(dragPointer.current);
    }

    dragging.current = false;
    hasMoved.current = false;
    dragPointer.current = null;
    bodyRef.current?.classList.remove("cursor-grabbing");
  };

  /* highlight helpers */
  const toggleColumn = (c: number) => setHL(prev => ({ r: prev.r, c: prev.c === c ? null : c }));
  const toggleRow = (r: number) => setHL(prev => ({ r: prev.r === r ? null : r, c: prev.c }));
  const toggleCell = (r: number, c: number) => {
    setHL(prev => (prev.r === r && prev.c === c ? { r: null, c: null } : { r, c }));
  };
  const clearHighlights = () => setHL({ r: null, c: null });

  /* tiny util to avoid importing clsx */
  const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

  /*────────────────────────────── render ───────────────────────────────*/
  return (
    <div className="h-screen flex flex-col overflow-hidden text-zinc-100 bg-zinc-900">
      {/*─── sticky header ───*/}
      <div
        ref={headerRef}
        className="sticky top-0 bg-zinc-800 border-b border-zinc-700 z-30 overflow-hidden"
      >
        <table className="table-fixed border-separate border-spacing-0 select-none">
          <thead>
            <tr>
              {/* gear header */}
              <th
                style={cellStyle}
                className={cx(
                  "box-border border border-zinc-700",
                  "sticky left-0 z-30 bg-zinc-700",
                  TOP_ROW_BORDER,
                  LEFT_COL_BORDER,
                )}
              >
                <button onClick={() => setOpen(true)} className="p-1 hover:text-emerald-400">
                  <Cog6ToothIcon className="h-5 w-5 mx-auto" />
                </button>
              </th>

              {PACE.map((p, i) => (
                <th
                  key={i}
                  data-clickable="true"
                  style={cellStyle}
                  onDoubleClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleColumn(i);
                  }}
                  className={cx(
                    hl.c === i ? HIGHLIGHT_LIGHT : "bg-zinc-800",
                    "box-border border border-zinc-700",
                    "text-sm font-semibold cursor-pointer select-none",
                    TOP_ROW_BORDER,
                  )}
                >
                  {p} m/{settings.unit}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/*─── scrollable body ───*/}
      <div
        ref={bodyRef}
        className="relative flex-1 min-h-0 min-w-0 overflow-auto cursor-grab overscroll-contain touch-pan-x touch-pan-y select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={sync}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      >
        <table className="table-fixed border-separate border-spacing-0 w-max min-w-full select-none">
          <tbody>
            {dist.map((d, r) => (
              <tr key={r}>
                {/* sticky left distance col */}
                <th
                  style={cellStyle}
                  data-clickable="true"
                  onDoubleClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleRow(r);
                  }}
                  className={cx(
                    "box-border border border-zinc-700 text-sm",
                    "sticky left-0 z-10 cursor-pointer",
                    hl.r === r ? HIGHLIGHT_LIGHT : "bg-zinc-800",
                    LEFT_COL_BORDER,
                  )}
                >
                  {d} {settings.unit}
                </th>

                {PACE.map((t, c) => {
                  const highlightBoth = hl.r === r && hl.c === c;
                  const highlightRowOrCol = hl.r === r || hl.c === c;
                  return (
                    <td
                      key={c}
                      data-clickable="true"
                      style={cellStyle}
                      onDoubleClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleCell(r, c);
                      }}
                      className={cx(
                        "box-border border border-zinc-700",
                        "text-center text-sm font-light text-zinc-300 cursor-pointer",
                        highlightBoth ? HIGHLIGHT_DEEP : highlightRowOrCol && HIGHLIGHT,
                        "hover:bg-zinc-700",
                      )}
                    >
                      {fmt(d * t)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*─── settings modal ───*/}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-md font-semibold mb-4">Settings</h2>

            <label className="block mb-3">
              <span className="mr-2">Units:</span>
              <select
                value={settings.unit}
                onChange={e =>
                  setSettings({ ...settings, unit: e.target.value as "km" | "mi" })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
              >
                <option value="km">Kilometres</option>
                <option value="mi">Miles</option>
              </select>
            </label>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={clearHighlights}
                className="text-xs px-3 py-1 border border-zinc-600 rounded hover:bg-zinc-700"
              >
                Clear highlight
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
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
