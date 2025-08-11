import React from 'react'
import { Calculator as CalculatorIcon, ArrowLeft, RefreshCw, Clock, MapPin, Timer } from 'lucide-react'
import { cn } from '../lib/utils'
import { CALCULATION_MODES, INPUT_FIELD_CONFIG, STYLING_CONFIG } from '../lib/constants'
import { usePaceCalculator } from '../hooks/usePaceCalculator'
import { CalculationModeSelector } from '../components/ui/CalculationModeSelector'
import { StatusBadge } from '../components/ui/StatusBadge'

export default function Calculator() {
  const {
    activeCalculation,
    inputs,
    calculatedValues,
    setActiveCalculation,
    handleInputChange,
    handleReset,
    isCalculatedField
  } = usePaceCalculator()

  // Input field icons
  const fieldIcons = {
    pace: <Clock className="w-5 h-5" />,
    distance: <MapPin className="w-5 h-5" />,
    time: <Timer className="w-5 h-5" />
  }

  // Render input field based on type
  const renderInputField = (fieldType: 'pace' | 'distance' | 'time') => {
    const config = INPUT_FIELD_CONFIG[fieldType]
    const isCalculated = isCalculatedField(fieldType)
    const currentValue = isCalculated ? calculatedValues[fieldType] : inputs[fieldType]
    
    const containerClasses = cn(
      'space-y-4 transition-all duration-300',
      isCalculated ? STYLING_CONFIG.container.output : STYLING_CONFIG.container.input
    )

    const labelClasses = cn(
      'flex items-center gap-2 text-lg',
      isCalculated ? STYLING_CONFIG.labels.output : STYLING_CONFIG.labels.input
    )

    const inputClasses = cn(
      'w-full p-4 border rounded-xl text-xl font-bold transition-all focus:outline-none',
      isCalculated ? STYLING_CONFIG.inputs.output : STYLING_CONFIG.inputs.input
    )

    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between">
          <label className={labelClasses}>
            {fieldIcons[fieldType]}
            {config.label}
          </label>
          <StatusBadge 
            type={isCalculated ? 'calculated' : 'input'} 
            variant={fieldType === 'distance' ? 'accent' : 'default'}
          />
        </div>

        {fieldType === 'pace' && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="min"
              min="0"
              value={isCalculated ? calculatedValues.pace.minutes : inputs.pace.minutes}
              onChange={(e) => handleInputChange('pace', 'minutes', e.target.value)}
              disabled={isCalculated}
              className={cn(inputClasses, 'text-center')}
            />
            <div className="text-3xl text-zinc-500 font-bold">:</div>
            <input
              type="number"
              placeholder="sec"
              min="0"
              max="59"
              value={isCalculated ? (calculatedValues.pace.seconds || '').padStart(2, '0') : inputs.pace.seconds}
              onChange={(e) => handleInputChange('pace', 'seconds', e.target.value)}
              disabled={isCalculated}
              className={cn(inputClasses, 'text-center')}
            />
          </div>
        )}

        {fieldType === 'distance' && (
          <input
            type="number"
            placeholder={config.placeholder}
            step={config.step}
            min={config.min}
            value={isCalculated ? calculatedValues.distance : inputs.distance}
            onChange={(e) => handleInputChange('distance', null, e.target.value)}
            disabled={isCalculated}
            className={inputClasses}
          />
        )}

        {fieldType === 'time' && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="hr"
              min="0"
              value={isCalculated ? calculatedValues.time.hours : inputs.time.hours}
              onChange={(e) => handleInputChange('time', 'hours', e.target.value)}
              disabled={isCalculated}
              className={cn(inputClasses, 'text-center')}
            />
            <div className="text-3xl text-zinc-500 font-bold">:</div>
            <input
              type="number"
              placeholder="min"
              min="0"
              max="59"
              value={isCalculated ? (calculatedValues.time.minutes || '').padStart(2, '0') : inputs.time.minutes}
              onChange={(e) => handleInputChange('time', 'minutes', e.target.value)}
              disabled={isCalculated}
              className={cn(inputClasses, 'text-center')}
            />
            <div className="text-3xl text-zinc-500 font-bold">:</div>
            <input
              type="number"
              placeholder="sec"
              min="0"
              max="59"
              value={isCalculated ? (calculatedValues.time.seconds || '').padStart(2, '0') : inputs.time.seconds}
              onChange={(e) => handleInputChange('time', 'seconds', e.target.value)}
              disabled={isCalculated}
              className={cn(inputClasses, 'text-center')}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 font-sans w-full min-h-screen">
      <div className="relative max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back
          </a>
        </div>
        
        {/* Header */}
        <header className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 mt-12 sm:mt-10">
            <CalculatorIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pace Calculator</h1>
          </div>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Select a calculation, fill the other fields.
          </p>
        </header>

        <main>
          {/* Calculation Mode Selector */}
          <CalculationModeSelector
            modes={CALCULATION_MODES}
            activeMode={activeCalculation}
            onModeChange={(modeId) => setActiveCalculation(modeId as any)}
          />

          {/* Input Section */}
          <div className={STYLING_CONFIG.container.base}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-6">
              {renderInputField('pace')}
              {renderInputField('distance')}
              {renderInputField('time')}
            </div>
          </div>
          
          {/* Reset Button */}
          <div className="text-center mt-10">
            <button 
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold py-2 px-5 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
