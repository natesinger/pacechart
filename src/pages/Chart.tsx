import { useEffect, useRef, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

/*──────────── data & helpers ────────────*/
const KM = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
  1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6,
  6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21.1, 25, 30, 35, 40, 42.2, 50, 60, 70, 80, 90, 100
];
const PACE = [
   3,  3.5,  4,  4.5,  5,  5.5,  6,  6.5,  7,  7.5,
   8,  8.5,  9,  9.5, 10, 10.5, 11, 11.5, 12, 12.5,
  13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5,
  18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5,
  23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5,
  28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32
];

type Settings  = { unit: "km" | "mi" };
type Highlight = { r: number; c: number };

const km2mi = (k: number) => +(k * 0.621371).toFixed(2);
const fmt = (m: number) => {
  const h  = Math.floor(m / 60);
  const mm = Math.floor(m % 60).toString().padStart(2, "0");
  const ss = Math.round((m % 1) * 60).toString().padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
const load = <T,>(k: string, d: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || "") as T; }
  catch { return d; }
};
const save = <T,>(k: string, v: T) => localStorage.setItem(k, JSON.stringify(v));

export default function Chart() {
  /*──── persistent state ────*/
  const [settings, setSettings] = useState<Settings>(() => load("pace.set", { unit: "km" }));
  const [hl,       setHL]       = useState<Highlight>(() => load("pace.hl",  { r: -1, c: -1 }));
  const [open,     setOpen]     = useState(false);
  useEffect(() => save("pace.set", settings), [settings]);
  useEffect(() => save("pace.hl",  hl),       [hl]);

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
  const start    = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0) return;          // only LMB
    e.preventDefault();                  // stop text selection
    dragging.current = true;
    bodyRef.current?.classList.add("cursor-grabbing");
    start.current = {
      x:  e.clientX,
      y:  e.clientY,
      sx: bodyRef.current!.scrollLeft,
      sy: bodyRef.current!.scrollTop
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    bodyRef.current!.scrollLeft = start.current.sx - (e.clientX - start.current.x);
    bodyRef.current!.scrollTop  = start.current.sy - (e.clientY - start.current.y);
    sync();
  };

  const up = () => {
    dragging.current = false;
    bodyRef.current?.classList.remove("cursor-grabbing");
  };

  /*──── render ────*/
  return (
    <div className="h-screen flex flex-col overflow-hidden text-zinc-100">
      {/*─── sticky header ───*/}
      <div ref={headerRef}
           className="sticky top-0 bg-zinc-800 border-b border-zinc-700 z-30 overflow-hidden">
        <table className="border-separate border-spacing-0 select-none">
          <thead>
            <tr>
              <th className="w-20 h-14 bg-zinc-800 border border-zinc-700 sticky left-0 z-30">
                <button onClick={() => setOpen(true)}
                        className="p-1 hover:text-emerald-400">
                  <Cog6ToothIcon className="h-5 w-5 mx-auto" />
                </button>
              </th>
              {PACE.map((p, i) => (
                <th key={i}
                    className={clsx(
                      "px-4 h-14 text-sm font-medium bg-zinc-800 border border-zinc-700",
                      hl.c === i && "bg-emerald-800"
                    )}>
                  {p}&nbsp;min/{settings.unit}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/*─── scrollable body ───*/}
      <div
        ref={bodyRef}
        className="relative flex-1 min-h-0 min-w-0 overflow-auto scrollbar-hide
                   cursor-grab overscroll-contain touch-pan-y"
        onScroll={sync}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      >
        <table className="border-separate border-spacing-0 w-max min-w-full select-none">
          <tbody>
            {dist.map((d, r) => (
              <tr key={r}>
                {/* sticky left distance col */}
                <th className={clsx(
                      "sticky left-0 z-10 w-20 h-14 px-2 bg-zinc-800 border border-zinc-700 font-medium",
                      hl.r === r && "bg-emerald-800"
                    )}>
                  {d}&nbsp;{settings.unit}
                </th>

                {PACE.map((t, c) => (
                  <td
                    key={c}
                    onDoubleClick={() => setHL(
                      hl.r === r && hl.c === c ? { r: -1, c: -1 } : { r, c }
                    )}
                    className={clsx(
                      "w-28 h-14 text-center border border-zinc-700",
                      (hl.r === r || hl.c === c) && "bg-emerald-900 hover:bg-emerald-900",
                      "hover:bg-zinc-700"
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
                onClick={() => setHL({ r: -1, c: -1 })}
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
