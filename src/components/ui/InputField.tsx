import React from 'react'
import { cn, commonClasses } from '../../lib/utils'

export interface InputFieldProps {
  type: 'single' | 'time' | 'pace'
  value: string | { [key: string]: string }
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  label: string
  icon?: React.ReactNode
  className?: string
  step?: string
  min?: string
  max?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  value,
  onChange,
  disabled = false,
  placeholder,
  label,
  icon,
  className,
  step,
  min,
  max
}) => {
  const handleChange = (field: string | null, newValue: string) => {
    if (type === 'single') {
      onChange(newValue)
    } else {
      // For time/pace inputs, we need to handle the nested object structure
      // This is a simplified version - in practice, you might want to pass the full object
      onChange(newValue)
    }
  }

  const renderInput = () => {
    const baseClasses = cn(
      commonClasses.input.base,
      disabled ? commonClasses.input.disabled : commonClasses.input.primary,
      className
    )

    if (type === 'single') {
      return (
        <input
          type="number"
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          value={value as string}
          onChange={(e) => handleChange(null, e.target.value)}
          disabled={disabled}
          className={baseClasses}
        />
      )
    }

    if (type === 'time') {
      const timeValue = value as { hours: string; minutes: string; seconds: string }
      return (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="hr"
            min="0"
            value={timeValue.hours}
            onChange={(e) => handleChange('hours', e.target.value)}
            disabled={disabled}
            className={cn(baseClasses, 'text-center')}
          />
          <div className="text-3xl text-zinc-500 font-bold">:</div>
          <input
            type="number"
            placeholder="min"
            min="0"
            max="59"
            value={timeValue.minutes}
            onChange={(e) => handleChange('minutes', e.target.value)}
            disabled={disabled}
            className={cn(baseClasses, 'text-center')}
          />
          <div className="text-3xl text-zinc-500 font-bold">:</div>
          <input
            type="number"
            placeholder="sec"
            min="0"
            max="59"
            value={timeValue.seconds}
            onChange={(e) => handleChange('seconds', e.target.value)}
            disabled={disabled}
            className={cn(baseClasses, 'text-center')}
          />
        </div>
      )
    }

    if (type === 'pace') {
      const paceValue = value as { minutes: string; seconds: string }
      return (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="min"
            min="0"
            value={paceValue.minutes}
            onChange={(e) => handleChange('minutes', e.target.value)}
            disabled={disabled}
            className={cn(baseClasses, 'text-center')}
          />
          <div className="text-3xl text-zinc-500 font-bold">:</div>
          <input
            type="number"
            placeholder="sec"
            min="0"
            max="59"
            value={paceValue.seconds}
            onChange={(e) => handleChange('seconds', e.target.value)}
            disabled={disabled}
            className={cn(baseClasses, 'text-center')}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-3">
      <label className="font-semibold flex items-center gap-2 text-base sm:text-lg text-zinc-300">
        {icon}
        {label}
      </label>
      {renderInput()}
    </div>
  )
}

export default InputField
