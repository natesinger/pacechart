import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Time conversion utilities
export const timeUtils = {
  // Convert pace (minutes:seconds) to total seconds
  paceToSeconds: (minutes: string, seconds: string): number => {
    return (parseFloat(minutes) || 0) * 60 + (parseFloat(seconds) || 0)
  },

  // Convert total seconds to pace object
  secondsToPace: (seconds: number): { minutes: string; seconds: string } => {
    if (isNaN(seconds) || !isFinite(seconds)) return { minutes: "", seconds: "" }
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return {
      minutes: mins.toString(),
      seconds: secs.toString()
    }
  },

  // Convert time (hours:minutes:seconds) to total seconds
  timeToSeconds: (hours: string, minutes: string, seconds: string): number => {
    return (parseFloat(hours) || 0) * 3600 + (parseFloat(minutes) || 0) * 60 + (parseFloat(seconds) || 0)
  },

  // Convert total seconds to time object
  secondsToTime: (totalSeconds: number): { hours: string; minutes: string; seconds: string } => {
    if (isNaN(totalSeconds) || !isFinite(totalSeconds)) return { hours: "", minutes: "", seconds: "" }
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.round(totalSeconds % 60)
    return {
      hours: hours.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString()
    }
  },

  // Format time for display (e.g., 1:23:45)
  formatTime: (minutes: number): string => {
    const h = Math.floor(minutes / 60)
    const mm = String(Math.floor(minutes % 60)).padStart(2, "0")
    const ss = String(Math.round((minutes % 1) * 60)).padStart(2, "0")
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
  }
}

// Input validation utilities
export const validationUtils = {
  // Sanitize numeric input (remove negative values)
  sanitizeNumericInput: (value: string): string => {
    return value && parseFloat(value) < 0 ? Math.abs(parseFloat(value)).toString() : value
  },

  // Check if a value is a valid positive number
  isValidPositiveNumber: (value: string): boolean => {
    const num = parseFloat(value)
    return !isNaN(num) && num > 0 && isFinite(num)
  }
}

// Local storage utilities
export const storageUtils = {
  load: <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue
    try {
      const value = window.localStorage.getItem(key)
      return value ? JSON.parse(value) as T : defaultValue
    } catch {
      return defaultValue
    }
  },

  save: (key: string, value: unknown): void => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota / private-mode failures
    }
  }
}

// Design system constants
export const designTokens = {
  colors: {
    primary: {
      50: 'bg-blue-50',
      100: 'bg-blue-100',
      500: 'bg-blue-500',
      600: 'bg-blue-600',
      700: 'bg-blue-700',
      800: 'bg-blue-800',
      900: 'bg-blue-900',
      950: 'bg-blue-950'
    },
    neutral: {
      50: 'bg-zinc-50',
      100: 'bg-zinc-100',
      500: 'bg-zinc-500',
      600: 'bg-zinc-600',
      700: 'bg-zinc-700',
      800: 'bg-zinc-800',
      900: 'bg-zinc-900',
      950: 'bg-zinc-950'
    },
    accent: {
      50: 'bg-red-50',
      100: 'bg-red-100',
      500: 'bg-red-500',
      600: 'bg-red-600',
      700: 'bg-red-700',
      800: 'bg-red-800',
      900: 'bg-red-900',
      950: 'bg-red-950'
    }
  },
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  },
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
}

// Common CSS class combinations
export const commonClasses = {
  button: {
    base: 'inline-flex items-center gap-2 font-semibold py-2 px-5 rounded-lg transition-all duration-200 cursor-pointer',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300',
    accent: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
  },
  input: {
    base: 'w-full p-4 border rounded-xl text-xl font-bold transition-all focus:outline-none',
    primary: 'bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-zinc-500',
    disabled: 'bg-zinc-600/30 border-zinc-500 text-zinc-300 cursor-not-allowed opacity-75'
  },
  card: {
    base: 'bg-zinc-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-zinc-700',
    interactive: 'hover:bg-zinc-800/90 transition-all duration-300'
  }
}
