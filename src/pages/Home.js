import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import './Home.css';
import { CalculatorIcon, PresentationChartLineIcon } from "@heroicons/react/16/solid";
export const ButtonLink = ({ icon, title, to }) => {
    const base = `flex items-center gap-3 h-16 w-full max-w-md rounded-lg px-6
                border-2 bg-zinc-800 border-zinc-700
                text-slate-300 hover:text-white hover:bg-zinc-800/70
                transition-colors hover:border-zinc-600
                mt-0`;
    return (_jsxs(Link, { to: to, className: base, style: { width: "calc(100% - 20px)" }, children: [_jsx("div", { className: "h-7 w-7", children: icon }), _jsx("span", { className: "text-xl font-medium", children: title })] }));
};
export default function Home() {
    return (_jsxs("div", { className: "flex items-center justify-center bg-zinc-900", style: { overflow: "hidden", height: "100vh", width: "100vw", position: "fixed" }, children: [_jsxs("div", { className: "flex gap-3 flex-col w-full justify-center items-center mt-[-50px] sm:mt-[-100px]", children: [_jsxs("h1", { className: "text-7xl font-bold text-white mb-8 text-zinc-100", children: ["Pace", _jsx("span", { className: "text-zinc-400 text-xl unselectable", children: " " }), "Ch", _jsx("span", { className: "text-zinc-400 text-5xl unselectable", children: "." }), "art"] }), _jsx(ButtonLink, { icon: _jsx(PresentationChartLineIcon, { className: "fill-neutral-500" }), title: "Distance/Time Chart", to: "/chart" }), _jsx(ButtonLink, { icon: _jsx(CalculatorIcon, { className: "fill-neutral-500" }), title: "Pace Calculator", to: "/calculator" })] }), _jsxs("footer", { className: "\n          fixed bottom-0 inset-x-0 h-24\n          flex items-center justify-center gap-6\n          border-t border-zinc-800 bg-zinc-900\n          text-xs sm:text-sm text-zinc-500\n          px-4 z-50\n        ", children: [_jsxs("div", { className: "flex flex-col items-center text-center sm:flex-row sm:items-baseline", children: [_jsx("span", { className: "sm:mr-1", children: "Built by" }), _jsx("a", { href: "https://www.linkedin.com/in/nathanielmsinger/", target: "_blank", rel: "noopener noreferrer", className: "hover:underline whitespace-nowrap", children: "Nate Singer" })] }), _jsx("span", { className: "sm", children: "\u2022" }), _jsxs("div", { className: "flex flex-col items-center text-center sm:flex-row sm:items-baseline", children: [_jsx("span", { className: "sm:mr-1", children: "Open Source" }), _jsx("a", { href: "https://github.com/natesinger/pacechart", target: "_blank", rel: "noopener noreferrer", className: "hover:underline whitespace-nowrap", children: "on GitHub" })] }), _jsx("span", { className: "sm", children: "\u2022" }), _jsxs("div", { className: "flex flex-col items-center text-center sm:flex-row sm:items-baseline", children: [_jsx("span", { className: "sm:mr-1", children: "Hosted with" }), _jsx("span", { children: "Cloudflare" })] })] })] }));
}
