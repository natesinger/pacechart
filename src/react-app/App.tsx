import { Routes, Route } from "react-router-dom";

import Home        from "@/pages/Home";
import Chart       from "@/pages/Chart";
import Calculator  from "@/pages/Calculator";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* ─────────── main content ─────────── */}
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/chart"     element={<Chart />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </div>
  );
}
