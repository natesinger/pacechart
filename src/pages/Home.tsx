import { Link } from "react-router-dom";
import React from "react";
import './Home.css';

import { CalculatorIcon, PresentationChartLineIcon } from "@heroicons/react/16/solid";

interface ButtonLinkProps {
  icon: React.ReactNode;
  title: string;
  to: string;
}

export const ButtonLink = ({ icon, title, to }: ButtonLinkProps) => {
  const base = `flex items-center gap-3 h-16 w-full max-w-md rounded-lg px-6
                border-2 bg-zinc-800 border-zinc-700
                text-slate-300 hover:text-white hover:bg-zinc-800/70
                transition-colors hover:border-zinc-600
                mt-0`;

  return (
    <Link to={to} className={base} style={{ width: "calc(100% - 20px)" }}>
      <div className="h-7 w-7">{icon}</div>
      <span className="text-xl font-medium">{title}</span>
    </Link>
  );
};

export default function Home() {
  return (
    <div 
      className="Home flex items-center justify-center bg-zinc-900" 
      style={{ 
        overflow: "hidden", 
        height: "100vh", 
        width: "100vw", 
        position: "fixed"
      }}
    >
      <div className="flex gap-3 flex-col w-full justify-center items-center mt-[-50px] sm:mt-[-100px]">
        <h1 className="text-7xl font-bold text-white mb-8 text-zinc-100">
          Pace
          <span className="text-zinc-400 text-xl unselectable"> </span>
          Ch
          <span className="text-zinc-400 text-5xl unselectable">.</span>
          art
        </h1>
        <ButtonLink
          icon={
            <PresentationChartLineIcon className="fill-neutral-500"/>
          }
          title="Distance/Time Chart"
          to="/chart"
        />
        <ButtonLink
          icon={
            <CalculatorIcon className="fill-neutral-500"/>
          }
          title="Pace Calculator"
          to="/calculator"
        />
      </div>
      <footer
        className="
          fixed bottom-0 inset-x-0 h-24
          flex items-center justify-center gap-6
          border-t border-zinc-800 bg-zinc-900
          text-xs sm:text-sm text-zinc-500
          px-4 z-50
        "
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-baseline">
          <span className="sm:mr-1">Built by</span>
          <a
            href="https://www.linkedin.com/in/nathanielmsinger/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline whitespace-nowrap"
          >
            Nate Singer
          </a>
        </div>

        <span className="sm">•</span>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-baseline">
          <span className="sm:mr-1">Open Source</span>
          <a
            href="https://github.com/natesinger/pacechart"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline whitespace-nowrap"
          >
            on GitHub
          </a>
        </div>
        
        <span className="sm">•</span>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-baseline">
          <span className="sm:mr-1">Hosted with</span>
          <span>Cloudflare</span>
        </div>
      </footer>
    </div>
  );
}