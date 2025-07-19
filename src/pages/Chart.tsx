import { useEffect, useRef, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

/*────────────────────────── configurable sizing ──────────────────────────*/
export const CELL_WIDTH  = 100; // pixels
export const CELL_HEIGHT = 56;  // pixels
const cellStyle = {
  width: CELL_WIDTH,
  minWidth: CELL_WIDTH,
  maxWidth: CELL_WIDTH,
  height: CELL_HEIGHT,
  minHeight: CELL_HEIGHT,
} as const;

/*──────────────────────────── data & helpers ─────────────────────────────*/
const KM = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
  1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6,
  6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21.1, 25, 30, 35, 40, 42.2, 50, 60, 70, 80, 90, 100,
];
const PACE = [
   3 ,  3.5,  4 ,  4.5,  5 ,  5.5,  6 ,  6.5,  7 ,  7.5,
   8 ,  8.5,  9 ,  9.5, 10 , 10.5, 11 , 11.5, 12 , 12.5,
  13 , 13.5, 14 , 14.5, 15 , 15.5, 16 , 16.5, 17 , 17.5,
  18 , 18.5, 19 , 19.5, 20 , 20.5, 21 , 21.5, 22 , 22.5,
  23 , 23.5, 24 , 24.5, 25 , 25.5, 26 , 26.5, 27 , 27.5,
  28 , 28.5, 29 , 29.5, 30 , 30.5, 31 , 31.5, 32,
];

/*────────────────────────────── highlight borders ───────────────────────*/
export const TOP_ROW_BORDER  = "border-b-4 border-b-zinc-500"; // header only
export const LEFT_COL_BORDER = "border-r-4 border-r-zinc-500"; // sticky column

type Settings  = { unit: "km" | "mi" };
/**
 * r/c are `null` when no row / column is selected
 */
type Highlight = { r: number | null; c: number | null };

const km2mi = (k: number) => +(k * 0.621371).toFixed(2);
const fmt = (m: number) => {
  const h  = Math.floor(m / 60);
  const mm = Math.floor(m % 60).toString().padStart(2, "0");
  const ss = Math.round((m % 1) * 60).toString().padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/*────────────────────────────── component ───────────────────────────────*/
export default function PaceChart() {
  /*──── persistent state ────*/
  const [settings, setSettings] = useState<Settings>({ unit: "km" });
  const [hl,       setHL]       = useState<Highlight>({ r: null, c: null });
  const [open,     setOpen]     = useState(false);

  const dist = settings.unit === "km" ? KM : KM.map(km2mi);

  /*──── refs ────*/
  const bodyRef   = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  /* keep header aligned with horizontal scroll */
  const sync = () => {
    if (headerRef.current && bodyRef.current)
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
  };

  /*──── drag‑to‑scroll helpers ────*/
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const start    = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // only LMB
    // Don't start dragging if clicking on a clickable element
    const target = e.target as HTMLElement;
    if (target.closest('th[data-clickable], td[data-clickable], button')) {
      return;
    }
    
    dragging.current = true;
    hasMoved.current = false;
    start.current = {
      x:  e.clientX,
      y:  e.clientY,
      sx: bodyRef.current!.scrollLeft,
      sy: bodyRef.current!.scrollTop,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    
    const deltaX = e.clientX - start.current.x;
    const deltaY = e.clientY - start.current.y;
    const threshold = 5; // minimum movement to be considered a drag
    
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (!hasMoved.current) {
        hasMoved.current = true;
        bodyRef.current?.classList.add("cursor-grabbing");
        e.preventDefault();
      }
      bodyRef.current!.scrollLeft = start.current.sx - deltaX;
      bodyRef.current!.scrollTop  = start.current.sy - deltaY;
      sync();
    }
  };

  const up = (e: React.PointerEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragging.current = false;
    hasMoved.current = false;
    bodyRef.current?.classList.remove("cursor-grabbing");
  };

  /*──── highlight toggle helpers ────*/
  const toggleColumn = (c: number) => {
    console.log('Toggling column:', c, 'current:', hl.c);
    if (hl.c === c) {
      setHL({ r: hl.r, c: null }); // clear column but keep row
    } else {
      setHL({ r: hl.r, c });       // set column and keep row
    }
  };

  const toggleRow = (r: number) => {
    console.log('Toggling row:', r, 'current:', hl.r);
    if (hl.r === r) {
      setHL({ r: null, c: hl.c }); // clear row but keep column
    } else {
      setHL({ r, c: hl.c });       // set row and keep column
    }
  };

  const toggleCell = (r: number, c: number) => {
    console.log('Toggling cell:', r, c, 'current:', hl.r, hl.c);
    if (hl.r === r && hl.c === c) {
      setHL({ r: null, c: null }); // clear both
    } else {
      setHL({ r, c });             // set both
    }
  };

  /*──── reusable cell class ────*/
  const cellBase = "box-border border border-zinc-700";
  const sticky   = "sticky left-0 z-10 bg-zinc-800 text-md font-semibold";

  function clsx(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
  }

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
              {/* gear header (bottom + right borders) */}
              <th
                style={cellStyle}
                className={clsx(cellBase, sticky, TOP_ROW_BORDER, LEFT_COL_BORDER, "z-30")}
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
                  onDoubleClick={(e) => {
                    console.log('Header double clicked:', i);
                    e.stopPropagation();
                    e.preventDefault();
                    toggleColumn(i);
                  }}
                  onClick={(e) => {
                    console.log('Header single clicked:', i);
                  }}
                  className={clsx(
                    cellBase,
                    "text-md font-semibold bg-zinc-800 cursor-pointer select-none",
                    TOP_ROW_BORDER,
                    hl.c === i && "bg-emerald-900",
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
        className="relative flex-1 min-h-0 min-w-0 overflow-auto cursor-grab overscroll-contain touch-pan-y"
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
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
                {/* sticky left distance col (right border) */}
                <th
                  style={cellStyle}
                  data-clickable="true"
                  onDoubleClick={(e) => {
                    console.log('Row double clicked:', r);
                    e.stopPropagation();
                    e.preventDefault();
                    toggleRow(r);
                  }}
                  onClick={(e) => {
                    console.log('Row single clicked:', r);
                  }}
                  className={clsx(
                    cellBase,
                    sticky,
                    LEFT_COL_BORDER,
                    "cursor-pointer select-none",
                    hl.r === r && "bg-emerald-900",
                  )}
                >
                  {d} {settings.unit}
                </th>

                {PACE.map((t, c) => (
                  <td
                    key={c}
                    data-clickable="true"
                    style={cellStyle}
                    onDoubleClick={(e) => {
                      console.log('Cell double clicked:', r, c);
                      e.stopPropagation();
                      e.preventDefault();
                      toggleCell(r, c);
                    }}
                    onClick={(e) => {
                      console.log('Cell single clicked:', r, c);
                    }}
                    className={clsx(
                      cellBase,
                      "text-center text-md font-light text-zinc-300 cursor-pointer select-none",
                      (hl.r === r || hl.c === c) && "bg-emerald-900 hover:bg-emerald-900",
                      "hover:bg-zinc-700",
                    )}
                  >
                    {fmt(d * t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*─── settings modal ───*/}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            <label className="block mb-3">
              <span className="mr-2">Units:</span>
              <select
                value={settings.unit}
                onChange={e => setSettings({ ...settings, unit: e.target.value as "km" | "mi" })}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
              >
                <option value="km">Kilometres</option>
                <option value="mi">Miles</option>
              </select>
            </label>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setHL({ r: null, c: null })}
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