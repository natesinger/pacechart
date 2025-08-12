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
    
    // Remove leading zeros but keep single "0"
    const trimmedValue = sanitizedValue === '0' ? '0' : sanitizedValue.replace(/^0+/, '') || '0'
    
    setInputs(prev => {
      const newInputs = { ...prev }
      
      if (category === 'time' && field) {
        newInputs.time = { ...prev.time, [field]: trimmedValue }
        // Reset lower empty fields to '0'
        if (field === 'hours' && !prev.time.minutes) newInputs.time.minutes = '0'
        if (field === 'hours' && !prev.time.seconds) newInputs.time.seconds = '0'
        if (field === 'minutes' && !prev.time.seconds) newInputs.time.seconds = '0'
      } else if (category === 'pace' && field) {
        newInputs.pace = { ...prev.pace, [field]: trimmedValue }
        if (field === 'minutes' && !prev.pace.seconds) newInputs.pace.seconds = '0'
      } else if (category === 'distance') {
        newInputs.distance = trimmedValue
      }
      
      // Always save to localStorage
      console.log('💾 Saving to localStorage:', newInputs)
      localStorage.setItem('paceCalculatorInputs', JSON.stringify(newInputs))
      return newInputs
    })
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
    localStorage.removeItem('paceCalculatorInputs')
  }, [])

  // Check if a field is being calculated (only the active calculation field)
  const isCalculatedField = useCallback((type: CalculationType) => {
    return activeCalculation === type
  }, [activeCalculation])

  // Calculate the currently active field based on current inputs
  const calculateActiveField = useCallback(() => {
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
          const newPace = timeUtils.secondsToPace(paceSeconds)
          
          // Only update if the calculated value is different from current
          if (JSON.stringify(newPace) !== JSON.stringify(inputs.pace)) {
            console.log('🧮 Calculated pace:', newPace)
            setCalculatedValues(prev => ({ ...prev, pace: newPace }))
            
            // Save calculated value to localStorage (don't set inputs directly)
            const newInputs = { ...inputs, pace: newPace }
            localStorage.setItem('paceCalculatorInputs', JSON.stringify(newInputs))
            console.log('💾 Saved calculated pace to localStorage:', newInputs)
          }
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
          const newDistance = distance.toFixed(2)
          
          // Only update if the calculated value is different from current
          if (newDistance !== inputs.distance) {
            console.log('🧮 Calculated distance:', newDistance)
            setCalculatedValues(prev => ({ ...prev, distance: newDistance }))
            
            // Save calculated value to localStorage (don't set inputs directly)
            const newInputs = { ...inputs, distance: newDistance }
            localStorage.setItem('paceCalculatorInputs', JSON.stringify(newInputs))
            console.log('💾 Saved calculated distance to localStorage:', newInputs)
          }
        }
      } else if (activeCalculation === 'time') {
        const paceSeconds = timeUtils.paceToSeconds(
          inputs.pace.minutes, 
          inputs.pace.seconds
        )
        const distance = parseFloat(inputs.distance)
        
        if (paceSeconds > 0 && distance > 0) {
          const totalTimeSeconds = paceSeconds * distance
          const newTime = timeUtils.secondsToTime(totalTimeSeconds)
          
          // Only update if the calculated value is different from current
          if (JSON.stringify(newTime) !== JSON.stringify(inputs.time)) {
            console.log('🧮 Calculated time:', newTime)
            setCalculatedValues(prev => ({ ...prev, time: newTime }))
            
            // Save calculated value to localStorage (don't set inputs directly)
            const newInputs = { ...inputs, time: newTime }
            localStorage.setItem('paceCalculatorInputs', JSON.stringify(newInputs))
            console.log('💾 Saved calculated time to localStorage:', newInputs)
          }
        }
      }
    } catch (error) {
      console.error('Calculation Error:', error)
    }
  }, [activeCalculation, inputs])

  // Load from localStorage on mount
  useEffect(() => {
    console.log('🔄 Loading from localStorage on mount')
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('paceCalculatorInputs')
      console.log('📦 Raw localStorage data:', saved)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('🔍 Parsed localStorage data:', parsed)
          if (parsed && typeof parsed === 'object' && 
              parsed.pace && parsed.distance !== undefined && parsed.time) {
            console.log('✅ Setting inputs from localStorage on mount:', parsed)
            setInputs(parsed as CalculatorInputs)
          } else {
            console.log('❌ Parsed data missing required fields:', { 
              hasPace: !!parsed?.pace, 
              hasDistance: parsed?.distance !== undefined, 
              hasTime: !!parsed?.time 
            })
          }
        } catch (error) {
          console.log('❌ Failed to parse localStorage data:', error)
        }
      } else {
        console.log('📭 No localStorage data found on mount')
      }
    }
  }, [])

  // Calculate when inputs change OR when calculation mode changes
  useEffect(() => {
    calculateActiveField()
  }, [inputs, activeCalculation]) // Added activeCalculation to trigger recalculation on mode switch

  // Load from localStorage when calculation mode changes
  useEffect(() => {
    console.log('🔄 Mode switched to:', activeCalculation, '- loading from localStorage')
    const saved = localStorage.getItem('paceCalculatorInputs')
    console.log('📦 Raw localStorage data on mode switch:', saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('🔍 Parsed localStorage data on mode switch:', parsed)
        if (parsed && typeof parsed === 'object') {
          console.log('✅ Setting inputs from localStorage on mode switch:', parsed)
          setInputs(parsed as CalculatorInputs)
        } else {
          console.log('❌ Parsed data invalid on mode switch:', parsed)
        }
      } catch (error) {
        console.log('❌ Failed to parse localStorage data on mode switch:', error)
      }
    } else {
      console.log('📭 No localStorage data found on mode switch')
    }
  }, [activeCalculation])

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
