import React from 'react'
import { Target, Edit3, Clock, MapPin, Timer } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface StatusBadgeProps {
  type: 'input' | 'result' | 'calculated'
  variant?: 'default' | 'accent' | 'neutral'
  className?: string
}

const badgeConfig = {
  input: {
    icon: Edit3,
    text: 'ENTER VALUES',
    colors: {
      default: 'text-blue-200 bg-blue-900/60 border-blue-600/60',
      accent: 'text-blue-200 bg-blue-900/60 border-blue-600/60',
      neutral: 'text-zinc-200 bg-zinc-900/60 border-zinc-600/60'
    }
  },
  result: {
    icon: Target,
    text: 'RESULT',
    colors: {
      default: 'text-blue-200 bg-blue-900/60 border-blue-600/60',
      accent: 'text-blue-200 bg-blue-900/60 border-blue-600/60',
      neutral: 'text-zinc-200 bg-zinc-900/60 border-zinc-600/60'
    }
  },
  calculated: {
    icon: Target,
    text: 'CALCULATED',
    colors: {
      default: 'text-zinc-400 bg-zinc-700/40 border-zinc-600/50',
      accent: 'text-zinc-400 bg-zinc-700/40 border-zinc-600/50',
      neutral: 'text-zinc-400 bg-zinc-700/40 border-zinc-600/50'
    }
  }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  type, 
  variant = 'default',
  className 
}) => {
  const config = badgeConfig[type]
  const Icon = config.icon
  
  return (
    <div className={cn(
      'flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg border shadow-lg',
      config.colors[variant],
      className
    )}>
      <Icon className="w-4 h-4" />
      {config.text}
    </div>
  )
}

export default StatusBadge
