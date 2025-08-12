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
      default: 'text-blue-200 bg-blue-900/70 border-blue-500/70',
      accent: 'text-blue-200 bg-blue-900/70 border-blue-500/70',
      neutral: 'text-zinc-200 bg-zinc-900/70 border-zinc-500/70'
    }
  },
  result: {
    icon: Target,
    text: 'RESULT',
    colors: {
      default: 'text-blue-200 bg-blue-900/70 border-blue-500/70',
      accent: 'text-blue-200 bg-blue-900/70 border-blue-500/70',
      neutral: 'text-zinc-200 bg-zinc-900/70 border-zinc-500/70'
    }
  },
  calculated: {
    icon: Target,
    text: 'CALCULATED',
    colors: {
      default: 'text-zinc-300 bg-zinc-700/60 border-zinc-500/60',
      accent: 'text-zinc-300 bg-zinc-700/60 border-zinc-500/60',
      neutral: 'text-zinc-300 bg-zinc-700/60 border-zinc-500/60'
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
      'flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border shadow-lg transition-all duration-200',
      config.colors[variant],
      className
    )}>
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  )
}

export default StatusBadge
