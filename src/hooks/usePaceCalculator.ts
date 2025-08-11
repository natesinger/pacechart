import { useState, useEffect, useCallback } from 'react'
import { timeUtils, validationUtils } from '../lib/utils'

export interface PaceInputs {
  minutes: string
  seconds: string
}

export interface TimeInputs {
  hours: string
  minutes: string
  seconds: string
}

export interface CalculatorInputs {
  pace: PaceInputs
  distance: string
  time: TimeInputs
}

export interface CalculatorValues {
  pace: PaceInputs
  distance: string
  time: TimeInputs
}

export type CalculationType = 'pace' | 'distance' | 'time'

export const usePaceCalculator = () => {
  const [activeCalculation, setActiveCalculation] = useState<CalculationType>('pace')
  const [inputs, setInputs] = useState<CalculatorInputs>({
    pace: { minutes: '', seconds: '' },
    distance: '',
    time: { hours: '', minutes: '', seconds: '' }
  })
  const [calculatedValues, setCalculatedValues] = useState<CalculatorValues>({
    pace: { minutes: '', seconds: '' },
    distance: '',
    time: { hours: '', minutes: '', seconds: '' }
  })

  // Handle input changes with validation
  const handleInputChange = useCallback((
    category: keyof CalculatorInputs, 
    field: string | null, 
    value: string
  ) => {
    const sanitizedValue = validationUtils.sanitizeNumericInput(value)
    
    setInputs(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' && field
        ? { ...prev[category], [field]: sanitizedValue }
        : sanitizedValue
    }))
  }, [])

  // Reset all inputs and calculated values
  const handleReset = useCallback(() => {
    const emptyState = {
      pace: { minutes: '', seconds: '' },
      distance: '',
      time: { hours: '', minutes: '', seconds: '' }
    }
    
    setInputs(emptyState)
    setCalculatedValues(emptyState)
  }, [])

  // Check if a field is being calculated
  const isCalculatedField = useCallback((type: CalculationType) => {
    return activeCalculation === type
  }, [activeCalculation])

  // Main calculation logic
  useEffect(() => {
    const calculate = () => {
      try {
        if (activeCalculation === 'pace') {
          const distance = parseFloat(inputs.distance)
          const totalTimeSeconds = timeUtils.timeToSeconds(
            inputs.time.hours, 
            inputs.time.minutes, 
            inputs.time.seconds
          )
          
          if (distance > 0 && totalTimeSeconds > 0) {
            const paceSeconds = totalTimeSeconds / distance
            setCalculatedValues(prev => ({ 
              ...prev, 
              pace: timeUtils.secondsToPace(paceSeconds) 
            }))
          } else {
            setCalculatedValues(prev => ({ 
              ...prev, 
              pace: { minutes: '', seconds: '' } 
            }))
          }
        } else if (activeCalculation === 'distance') {
          const paceSeconds = timeUtils.paceToSeconds(
            inputs.pace.minutes, 
            inputs.pace.seconds
          )
          const totalTimeSeconds = timeUtils.timeToSeconds(
            inputs.time.hours, 
            inputs.time.minutes, 
            inputs.time.seconds
          )
          
          if (paceSeconds > 0 && totalTimeSeconds > 0) {
            const distance = totalTimeSeconds / paceSeconds
            setCalculatedValues(prev => ({ 
              ...prev, 
              distance: distance.toFixed(2) 
            }))
          } else {
            setCalculatedValues(prev => ({ ...prev, distance: '' }))
          }
        } else if (activeCalculation === 'time') {
          const paceSeconds = timeUtils.paceToSeconds(
            inputs.pace.minutes, 
            inputs.pace.seconds
          )
          const distance = parseFloat(inputs.distance)
          
          if (paceSeconds > 0 && distance > 0) {
            const totalTimeSeconds = paceSeconds * distance
            setCalculatedValues(prev => ({ 
              ...prev, 
              time: timeUtils.secondsToTime(totalTimeSeconds) 
            }))
          } else {
            setCalculatedValues(prev => ({ 
              ...prev, 
              time: { hours: '', minutes: '', seconds: '' } 
            }))
          }
        }
      } catch (error) {
        console.error('Calculation Error:', error)
        // Reset calculated values on error
        setCalculatedValues({
          pace: { minutes: '', seconds: '' },
          distance: '',
          time: { hours: '', minutes: '', seconds: '' }
        })
      }
    }

    calculate()
  }, [inputs, activeCalculation])

  return {
    // State
    activeCalculation,
    inputs,
    calculatedValues,
    
    // Actions
    setActiveCalculation,
    handleInputChange,
    handleReset,
    isCalculatedField
  }
}
