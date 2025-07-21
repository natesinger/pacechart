import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Chart from "@/pages/Chart";
import Calculator from "@/pages/Calculator";
export default function App() {
    return (_jsx("div", { className: "min-h-screen bg-zinc-900", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/chart", element: _jsx(Chart, {}) }), _jsx(Route, { path: "/calculator", element: _jsx(Calculator, {}) })] }) }));
}
