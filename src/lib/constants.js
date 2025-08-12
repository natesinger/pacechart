import { Clock, MapPin, Timer } from 'lucide-react';
// Calculation modes configuration
export const CALCULATION_MODES = [
    {
        id: "pace",
        Icon: Clock,
        title: "Calculate Pace",
        subtitle: "Pace from distance & time"
    },
    {
        id: "distance",
        Icon: MapPin,
        title: "Calculate Distance",
        subtitle: "Distance from pace & time"
    },
    {
        id: "time",
        Icon: Timer,
        title: "Calculate Time",
        subtitle: "Time from pace & distance"
    }
];
// Input field configurations
export const INPUT_FIELD_CONFIG = {
    pace: {
        label: "Pace (per mile)",
        type: "pace",
        placeholder: "Enter pace",
        step: "1",
        min: "0"
    },
    distance: {
        label: "Distance (miles)",
        type: "single",
        placeholder: "e.g., 3.1",
        step: "0.1",
        min: "0"
    },
    time: {
        label: "Time",
        type: "time",
        placeholder: "Enter time",
        step: "1",
        min: "0"
    }
};
// Redesigned styling constants with clear input/output distinction
export const STYLING_CONFIG = {
    container: {
        base: 'bg-zinc-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-zinc-700',
        // Input fields: Bright, interactive, clearly actionable with consistent sizing
        input: 'bg-gradient-to-br from-blue-950/40 to-blue-900/30 rounded-2xl p-6 border-2 border-dashed border-blue-500/70 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-950/50 hover:to-blue-900/40 transition-all duration-300 min-h-[140px] flex flex-col justify-between shadow-lg hover:shadow-xl',
        // Output fields: Muted, subtle, clearly non-interactive with consistent sizing
        output: 'bg-zinc-800/60 rounded-2xl p-6 border border-zinc-600/50 transition-all duration-300 min-h-[140px] flex flex-col justify-between shadow-md'
    },
    labels: {
        // Input labels: Bright, attention-grabbing, consistent typography
        input: 'text-blue-200 font-semibold text-lg flex items-center gap-2',
        // Output labels: Muted, subtle, consistent typography
        output: 'text-zinc-400 font-medium text-lg flex items-center gap-2'
    },
    inputs: {
        // Input field styling: Bright, interactive, clearly actionable
        input: 'bg-zinc-900 border-2 border-blue-500/80 text-blue-100 placeholder-blue-300/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 hover:border-blue-400 hover:bg-blue-950/50 shadow-lg transition-all duration-200 text-xl font-semibold',
        // Output field styling: Muted, disabled, clearly non-interactive
        output: 'bg-zinc-700/70 border border-zinc-500/50 text-zinc-200 cursor-not-allowed opacity-90 text-xl font-medium'
    },
    values: {
        // Input values: Bright, prominent
        input: 'text-blue-100 font-bold text-2xl',
        // Output values: Muted, but still readable
        output: 'text-zinc-200 font-semibold text-2xl'
    }
};
// App metadata
export const APP_CONFIG = {
    name: "PaceChart",
    version: "1.0.0",
    description: "Professional pace and time calculations for runners",
    author: "Nate Singer",
    github: "https://github.com/natesinger/pacechart",
    linkedin: "https://www.linkedin.com/in/nathanielmsinger/"
};
