import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* PaceChart.tsx – improved performance build & Tailwind‑Plus modal */
import { Fragment, useEffect, useMemo, useRef, useState, } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/16/solid";
import "./Chart.css";
/*────────────────────────── configurable sizing ──────────────────────────*/
export const CELL_WIDTH = 80;
export const CELL_HEIGHT = 40;
const cellStyle = {
    width: CELL_WIDTH,
    minWidth: CELL_WIDTH,
    maxWidth: CELL_WIDTH,
    height: CELL_HEIGHT,
    minHeight: CELL_HEIGHT,
};
/*──────────────────────────── highlight colors ───────────────────────────*/
export const HIGHLIGHT_LIGHT = "bg-slate-600"; // For selected headers
export const HIGHLIGHT = "bg-slate-700/50"; // For selected row/column (not intersection)
export const HIGHLIGHT_DEEP = "bg-slate-800"; // For the selected cell (intersection)
// Hover colors
// NOTE: HOVER_ROW_COL MUST be solid for sticky headers.
export const HOVER_ROW_COL = "bg-zinc-800"; // Lighter hover for headers
export const HOVER_CELL = "bg-zinc-300/20"; // For the exact hovered cell (if not selected)
/*──────────────────────────── other styling ──────────────────────────────*/
export const HEADER_BG = "bg-zinc-800"; // Default for row/col headers
export const DEFAULT_BG = "bg-zinc-850"; // Default for data cells
export const TOP_ROW_BORDER = "border-b-4 border-b-zinc-500";
export const LEFT_COL_BORDER = "border-r-4 border-r-zinc-500";
/*────────────────────────── persistent storage helpers ───────────────────*/
const STORAGE_KEYS = {
    SETTINGS: "pace-chart-settings",
    HIGHLIGHT: "pace-chart-highlight",
};
function load(key, dflt) {
    if (typeof window === "undefined")
        return dflt;
    try {
        const v = window.localStorage.getItem(key);
        return v ? JSON.parse(v) : dflt;
    }
    catch {
        return dflt;
    }
}
function save(key, value) {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        /* ignore quota / private‑mode failures */
    }
}
/*────────────────────── utility fns ─────────────────────*/
const fmt = (m) => {
    const h = Math.floor(m / 60);
    const mm = String(Math.floor(m % 60)).padStart(2, "0");
    const ss = String(Math.round((m % 1) * 60)).padStart(2, "0");
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
function generatePaces(stepSec, unit) {
    const vals = [];
    if (unit === "mi") {
        for (let sec = 180; sec <= 1800; sec += stepSec)
            vals.push(sec / 60);
    }
    else {
        for (let sec = 90; sec <= 1080; sec += stepSec)
            vals.push(sec / 60);
    }
    return vals;
}
const uniqueSorted = (v) => Array.from(new Set(v.map((x) => +x.toFixed(3)))).sort((a, b) => a - b);
/* race‑distance maps – unchanged */
const RACE_LABELS = {
    0.062: "100m",
    0.124: "200m",
    0.249: "400m",
    0.497: "800m",
    0.621: "1K",
    0.932: "1.5K",
    1.5: "1.5 Mile",
    3.107: "5K",
    6.214: "10K",
    13.109: "½ M",
    26.219: "Marathon",
};
const RACE_LABELS_KM = {
    0.1: "100m",
    0.2: "200m",
    0.4: "400m",
    0.8: "800m",
    1.0: "1K",
    1.5: "1.5K",
    2.414: "1.5 Mile",
    5.0: "5K",
    10.0: "10K",
    21.097: "½ M",
    42.195: "Marathon",
};
function generateDistances(unit) {
    if (unit === "mi") {
        const track = [0.062, 0.124, 0.249, 0.497];
        const std = [0.621, 0.932, 1, 1.5, 3.107, 6.214, 13.109, 26.219];
        const miles = Array.from({ length: 100 }, (_, i) => i + 1);
        return uniqueSorted([...track, ...std, ...miles]);
    }
    const track = [0.1, 0.2, 0.4, 0.8];
    const std = [1, 1.5, 2.414, 5, 10, 21.097, 42.195];
    const km = [
        2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24,
        25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160.934,
    ];
    return uniqueSorted([...track, ...std, ...km]);
}
/*──────── defaults (5 km @ 10 min/mi) ────────*/
const DEFAULT_SETTINGS = { unit: "mi", paceStep: 10 };
const DEFAULT_HL = (() => {
    const dists = generateDistances(DEFAULT_SETTINGS.unit);
    const paces = generatePaces(DEFAULT_SETTINGS.paceStep, DEFAULT_SETTINGS.unit);
    const col = dists.findIndex((d) => Math.abs(d - 3.107) < 0.01);
    const row = paces.findIndex((p) => Math.abs(p - 10) < 1e-6);
    return { r: row >= 0 ? row : null, c: col >= 0 ? col : null };
})();
/*──────────────────────────── component ────────────────────────────*/
export default function PaceChart() {
    /* state */
    const [settings, setSettings] = useState(() => load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
    const [hl, setHL] = useState(() => load(STORAGE_KEYS.HIGHLIGHT, DEFAULT_HL));
    const [open, setOpen] = useState(false);
    const [hoveredCell, setHoveredCell] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    /* derived data */
    const dists = useMemo(() => generateDistances(settings.unit), [settings.unit]);
    const paces = useMemo(() => generatePaces(settings.paceStep, settings.unit), [settings.paceStep, settings.unit]);
    /* persistence */
    useEffect(() => save(STORAGE_KEYS.SETTINGS, settings), [settings]);
    useEffect(() => save(STORAGE_KEYS.HIGHLIGHT, hl), [hl]);
    /* refs */
    const bodyRef = useRef(null);
    const headerRef = useRef(null);
    /*──────── scrolling sync (header ⇆ body) ────────*/
    const syncHeader = () => {
        if (headerRef.current && bodyRef.current)
            headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    };
    /*──────── desktop drag – throttled with rAF ────────*/
    const dragId = useRef(null);
    const start = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
    const hasMoved = useRef(false);
    // live delta from the last pointermove event
    const deltaRef = useRef({ dx: 0, dy: 0 });
    const frameRef = useRef(null);
    const scheduleScroll = () => {
        if (frameRef.current !== null)
            return; // already scheduled
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            const br = bodyRef.current;
            if (!br)
                return;
            br.scrollLeft = start.current.sx - deltaRef.current.dx;
            br.scrollTop = start.current.sy - deltaRef.current.dy;
            syncHeader();
        });
    };
    const down = (e) => {
        if (e.pointerType !== "mouse" || e.button)
            return;
        if (e.target.closest("button"))
            return;
        dragId.current = e.pointerId;
        hasMoved.current = false;
        start.current = {
            x: e.clientX,
            y: e.clientY,
            sx: bodyRef.current.scrollLeft,
            sy: bodyRef.current.scrollTop,
        };
    };
    const move = (e) => {
        if (e.pointerId !== dragId.current)
            return;
        deltaRef.current.dx = e.clientX - start.current.x;
        deltaRef.current.dy = e.clientY - start.current.y;
        if (!hasMoved.current) {
            hasMoved.current = true;
            setIsDragging(true);
            bodyRef.current?.setPointerCapture(dragId.current);
            bodyRef.current?.classList.add("cursor-grabbing");
        }
        scheduleScroll();
    };
    const up = () => {
        if (dragId.current !== null)
            bodyRef.current?.releasePointerCapture(dragId.current);
        dragId.current = null;
        if (hasMoved.current) {
            hasMoved.current = false;
            setIsDragging(false);
        }
        bodyRef.current?.classList.remove("cursor-grabbing");
    };
    /*──────── auto‑centre once – run AFTER first paint ────────*/
    const didInitialScroll = useRef(false);
    useEffect(() => {
        if (didInitialScroll.current || !dists.length || !paces.length)
            return;
        const br = bodyRef.current;
        if (!br)
            return;
        const col = hl.c ?? 0;
        const row = hl.r ?? 0;
        const cellCenterX = (col + 1.5) * CELL_WIDTH;
        const cellCenterY = (row + 0.5) * CELL_HEIGHT;
        const desiredLeft = Math.max(0, Math.min(cellCenterX - br.clientWidth / 2, br.scrollWidth - br.clientWidth));
        const desiredTop = Math.max(0, Math.min(cellCenterY - br.clientHeight / 2, br.scrollHeight - br.clientHeight));
        br.scrollLeft = desiredLeft;
        br.scrollTop = desiredTop;
        headerRef.current && (headerRef.current.scrollLeft = desiredLeft);
        didInitialScroll.current = true;
    }, [dists.length, paces.length, hl.c, hl.r]);
    /*──────── highlight helpers ────────*/
    const toggleCol = (c) => setHL((p) => ({ r: p.r, c: p.c === c ? null : c }));
    const toggleRow = (r) => setHL((p) => ({ r: p.r === r ? null : r, c: p.c }));
    const toggleCell = (r, c) => setHL((p) => (p.r === r && p.c === c ? { r: null, c: null } : { r, c }));
    const clearHL = () => setHL({ r: null, c: null });
    const resetAll = () => {
        setSettings(DEFAULT_SETTINGS);
        setHL(DEFAULT_HL);
        // ✨ FIX: Signal the useEffect to re-run the centering logic
        didInitialScroll.current = false;
        // ✨ UX Improvement: Close modal after resetting
        setOpen(false);
    };
    /*──────── robust mobile double‑tap ────────*/
    const DOUBLE_TAP_MS = 400;
    const lastTouch = useRef(null);
    const touchHandler = (fn, ...args) => (e) => {
        if (e.touches.length)
            return; // ignore move/second finger
        const { clientX: x, clientY: y } = e.changedTouches[0];
        const now = Date.now();
        if (lastTouch.current &&
            now - lastTouch.current.t < DOUBLE_TAP_MS &&
            Math.hypot(x - lastTouch.current.x, y - lastTouch.current.y) < 20) {
            e.preventDefault();
            e.stopPropagation();
            fn(...args);
            lastTouch.current = null; // reset
        }
        else {
            lastTouch.current = { t: now, x, y };
        }
    };
    /*──────── label helpers ────────*/
    const paceLabel = (p) => `${fmt(p)} /${settings.unit}`;
    const distLabel = (d) => {
        const map = settings.unit === "mi" ? RACE_LABELS : RACE_LABELS_KM;
        for (const [k, v] of Object.entries(map))
            if (Math.abs(parseFloat(k) - d) < 0.01)
                return v;
        const txt = d < 1 ? d.toFixed(3) : d % 1 ? d.toFixed(1) : d.toString();
        return `${txt} ${settings.unit}`;
    };
    const isRaceDist = (d) => {
        const map = settings.unit === "mi" ? RACE_LABELS : RACE_LABELS_KM;
        return Object.keys(map).some((k) => Math.abs(parseFloat(k) - d) < 0.01);
    };
    const cx = (...c) => c.filter(Boolean).join(" ");
    /*───────────────────────── render ─────────────────────────*/
    return (_jsxs("div", { className: "Chart h-[100dvh] flex flex-col overflow-hidden text-zinc-100 bg-zinc-900", children: [_jsx("div", { ref: headerRef, className: `sticky top-0 ${DEFAULT_BG} border-b border-zinc-700 z-30 overflow-hidden`, children: _jsx("table", { className: "table-fixed border-separate border-spacing-0 select-none w-max min-w-full", children: _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: cellStyle, className: cx(`box-border border border-zinc-700 sticky left-0 z-30 ${HEADER_BG}`, TOP_ROW_BORDER, LEFT_COL_BORDER), children: _jsxs("div", { className: "flex flex-row items-center justify-center gap-2", children: [_jsx("a", { href: "/", className: "p-1 hover:text-blue-300", children: _jsx(HomeIcon, { className: "h-5 w-5 mx-auto" }) }), _jsx("button", { onClick: () => setOpen(true), className: "p-1 hover:text-blue-300 hover:cursor-pointer", children: _jsx(Cog6ToothIcon, { className: "h-5 w-5 mx-auto" }) })] }) }), dists.map((d, i) => {
                                    const isSelectedCol = hl.c === i;
                                    const isHoveredCol = hoveredCell && hoveredCell[1] === i;
                                    return (_jsx("th", { style: cellStyle, onDoubleClick: (e) => {
                                            e.stopPropagation();
                                            toggleCol(i);
                                        }, onTouchEnd: touchHandler(toggleCol, i), className: cx("box-border border border-zinc-700 cursor-pointer select-none text-sm", TOP_ROW_BORDER, isRaceDist(d) && "font-semibold text-blue-300", 
                                        // Apply selected highlight if applicable
                                        isSelectedCol ? HIGHLIGHT_LIGHT :
                                            // Otherwise, apply hover highlight if applicable
                                            isHoveredCol ? HOVER_ROW_COL :
                                                // Default background
                                                HEADER_BG), children: distLabel(d) }, i));
                                })] }) }) }) }), _jsx("div", { ref: bodyRef, className: "relative flex-1 min-h-0 min-w-0 overflow-auto cursor-grab overscroll-none touch-pan-x touch-pan-y will-change-scroll select-none", style: { scrollbarWidth: "none", msOverflowStyle: "none" }, onScroll: syncHeader, onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerLeave: up, children: _jsx("table", { className: "table-fixed border-separate border-spacing-0 w-max min-w-full select-none", children: _jsx("tbody", { onMouseLeave: () => !isDragging && setHoveredCell(null), children: paces.map((p, r) => (_jsxs("tr", { children: [_jsx("th", { style: cellStyle, onDoubleClick: (e) => {
                                        e.stopPropagation();
                                        toggleRow(r);
                                    }, onTouchEnd: touchHandler(toggleRow, r), className: cx("box-border border border-zinc-700 sticky left-0 z-10 cursor-pointer text-xs", LEFT_COL_BORDER, 
                                    // Apply selected highlight if applicable
                                    hl.r === r ? HIGHLIGHT_LIGHT :
                                        // Otherwise, apply hover highlight if applicable
                                        (hoveredCell && hoveredCell[0] === r) ? HOVER_ROW_COL :
                                            // Default background
                                            HEADER_BG), children: paceLabel(p) }), dists.map((d, c) => {
                                    const isSelectedCell = hl.r === r && hl.c === c;
                                    const isSelectedRowOrCol = hl.r === r || hl.c === c;
                                    const isHoveredCell = hoveredCell && hoveredCell[0] === r && hoveredCell[1] === c;
                                    const isHoveredRow = hoveredCell && hoveredCell[0] === r;
                                    const isHoveredCol = hoveredCell && hoveredCell[1] === c;
                                    // Determine the background based on a clear priority
                                    let cellBgClass = DEFAULT_BG; // Default background
                                    if (isSelectedCell) {
                                        cellBgClass = HIGHLIGHT_DEEP; // 1. Selected cell takes highest priority
                                    }
                                    else if (isSelectedRowOrCol) {
                                        cellBgClass = HIGHLIGHT; // 2. Selected row/col takes next priority
                                    }
                                    else if (isHoveredCell) {
                                        cellBgClass = HOVER_CELL; // 3. Hovered cell (if not selected)
                                    }
                                    else if (isHoveredRow || isHoveredCol) {
                                        // This is intentionally disabled to make hover less noisy
                                        // cellBgClass = HOVER_ROW_COL; 
                                    }
                                    return (_jsx("td", { style: cellStyle, onDoubleClick: (e) => {
                                            e.stopPropagation();
                                            toggleCell(r, c);
                                        }, onTouchEnd: touchHandler(toggleCell, r, c), onMouseEnter: () => !isDragging && setHoveredCell([r, c]), className: cx("box-border border border-zinc-700 text-center text-xs font-light text-zinc-300 cursor-pointer", cellBgClass), children: fmt(p * d) }, c));
                                })] }, r))) }) }) }), _jsx(Transition, { appear: true, show: open, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => setOpen(false), children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm" }) }), _jsx("div", { className: "fixed inset-0 overflow-y-auto", children: _jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { className: "w-full max-w-sm transform overflow-hidden rounded-2xl bg-zinc-900/95 p-6 text-left align-middle shadow-2xl ring-1 ring-white/10 transition-all", children: [_jsx(Dialog.Title, { as: "h3", className: "text-lg font-medium leading-6 text-zinc-50", children: "Chart Settings" }), _jsx("div", { className: "mt-2", children: _jsx("p", { className: "text-sm text-zinc-400", children: "Customize the visualization below." }) }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { htmlFor: "unit-select", className: "text-sm text-zinc-300", children: "Units" }), _jsxs("select", { id: "unit-select", value: settings.unit, onChange: (e) => setSettings({
                                                                    ...settings,
                                                                    unit: e.target.value,
                                                                }), className: "w-36 rounded-md border-white/10 bg-white/5 py-1.5 px-3 text-sm/6 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-blue-500", children: [_jsx("option", { value: "mi", children: "Miles" }), _jsx("option", { value: "km", children: "Kilometers" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { htmlFor: "pace-select", className: "text-sm text-zinc-300", children: "Pace Interval" }), _jsxs("select", { id: "pace-select", value: settings.paceStep, onChange: (e) => setSettings({
                                                                    ...settings,
                                                                    paceStep: Number(e.target.value),
                                                                }), className: "w-36 rounded-md border-white/10 bg-white/5 py-1.5 px-3 text-sm/6 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-blue-500", children: [_jsx("option", { value: 10, children: "10 seconds" }), _jsx("option", { value: 15, children: "15 seconds" }), _jsx("option", { value: 30, children: "30 seconds" }), _jsx("option", { value: 60, children: "1 minute" })] })] })] }), _jsxs("div", { className: "mt-8 pt-5 border-t border-zinc-700/50 flex justify-between items-center", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: clearHL, className: "inline-flex justify-center rounded-md bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-100 shadow-sm hover:bg-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 cursor-pointer", children: "Clear Highlight" }), _jsx("button", { onClick: resetAll, className: "inline-flex justify-center rounded-md bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-100 shadow-sm hover:bg-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 cursor-pointer", children: "Reset All" })] }), _jsx("button", { onClick: () => setOpen(false), className: "inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 cursor-pointer", children: "Done" })] })] }) }) }) })] }) })] }));
}
