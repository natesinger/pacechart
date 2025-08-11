import { Clock, MapPin, Timer } from 'lucide-react'
import type { CalculationMode } from '../components/ui/CalculationModeSelector'

// Calculation modes configuration
export const CALCULATION_MODES: CalculationMode[] = [
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
]

// Input field configurations
export const INPUT_FIELD_CONFIG = {
  pace: {
    label: "Pace (per mile)",
    type: "pace" as const,
    placeholder: "Enter pace",
    step: "1",
    min: "0"
  },
  distance: {
    label: "Distance (miles)",
    type: "single" as const,
    placeholder: "e.g., 3.1",
    step: "0.1",
    min: "0"
  },
  time: {
    label: "Time",
    type: "time" as const,
    placeholder: "Enter time",
    step: "1",
    min: "0"
  }
}

// Styling constants - Clear distinction between input and output
export const STYLING_CONFIG = {
  container: {
    base: 'bg-zinc-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-zinc-700',
    // Input fields: Bright, interactive, clearly actionable
    input: 'bg-gradient-to-br from-blue-950/30 to-blue-900/20 rounded-2xl p-6 border-2 border-dashed border-blue-500/60 hover:border-blue-400/80 hover:bg-gradient-to-br hover:from-blue-950/40 hover:to-blue-900/30 transition-all duration-300',
    // Output fields: Muted, subtle, clearly non-interactive
    output: 'bg-zinc-800/50 rounded-2xl p-6 border border-zinc-600/30 transition-all duration-300'
  },
  labels: {
    // Input labels: Bright and attention-grabbing
    input: 'text-blue-200 font-bold',
    // Output labels: Muted and subtle
    output: 'text-zinc-400 font-medium'
  },
  inputs: {
    // Input field styling: Bright, interactive, clearly actionable
    input: 'bg-zinc-900 border-2 border-blue-500/70 text-blue-100 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 hover:border-blue-400 hover:bg-blue-950/50 shadow-lg transition-all duration-200',
    // Output field styling: Muted, disabled, clearly non-interactive
    output: 'bg-zinc-700/50 border border-zinc-500 text-zinc-300 cursor-not-allowed opacity-80 transition-all duration-200'
  }
}

// App metadata
export const APP_CONFIG = {
  name: "PaceChart",
  version: "1.0.0",
  description: "Professional pace and time calculations for runners",
  author: "Nate Singer",
  github: "https://github.com/natesinger/pacechart",
  linkedin: "https://www.linkedin.com/in/nathanielmsinger/"
}
