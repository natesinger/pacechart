import React from 'react'
import { Calculator as CalculatorIcon, ArrowLeft, RefreshCw, Clock, MapPin, Timer } from 'lucide-react'
import { CALCULATION_MODES, STYLING_CONFIG } from '../lib/constants'
import { usePaceCalculator } from '../hooks/usePaceCalculator'
import { CalculationModeSelector } from '../components/ui/CalculationModeSelector'
import './Calculator.css'

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

  return (
    <div className="Calculator bg-zinc-900 text-zinc-100 font-sans w-full min-h-screen">
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
            <div className="grid grid-cols-3 gap-6" style={{ minHeight: '140px' }}>
              {/* Pace Section */}
              <div className="flex flex-col items-center" style={{
                padding: '24px',
                border: isCalculatedField('pace') ? 'none' : '2px dashed rgb(59 130 246 / 0.3)',
                borderRadius: '16px',
                background: isCalculatedField('pace') ? 'rgb(24 24 27 / 0.9)' : 'rgb(30 41 59 / 0.6)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <label 
                    style={{
                      color: isCalculatedField('pace') ? 'rgb(161 161 170)' : 'rgb(191 219 254)',
                      fontWeight: isCalculatedField('pace') ? '500' : '600',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {fieldIcons.pace}
                    Pace (per mile)
                  </label>
                </div>
                <div className="flex w-full">
                  <input
                    type="number"
                    placeholder="m"
                    min="0"
                    value={isCalculatedField('pace') && calculatedValues.pace.minutes ? calculatedValues.pace.minutes : inputs.pace.minutes}
                    onChange={(e) => handleInputChange('pace', 'minutes', e.target.value)}
                    disabled={isCalculatedField('pace')}
                    style={{
                      flex: '1',
                      minWidth: '0',
                      height: '40px',
                      padding: '6px 8px',
                      border: isCalculatedField('pace') ? '1px solid rgb(82 82 91 / 0.3)' : '2px solid rgb(59 130 246 / 0.8)',
                      borderRadius: '12px',
                      background: isCalculatedField('pace') ? 'rgb(63 63 70 / 0.4)' : 'rgb(24 24 27)',
                      color: isCalculatedField('pace') ? 'rgb(161 161 170)' : 'rgb(219 234 254)',
                      cursor: isCalculatedField('pace') ? 'not-allowed' : 'text',
                      opacity: isCalculatedField('pace') ? '0.6' : '1',
                      fontSize: '18px',
                      fontWeight: isCalculatedField('pace') ? '400' : '500',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                  <div className="text-2xl text-zinc-500 font-semibold mx-2 flex items-center flex-shrink-0">:</div>
                  <input
                    type="number"
                    placeholder="s"
                    min="0"
                    max="59"
                    value={isCalculatedField('pace') && calculatedValues.pace.seconds ? calculatedValues.pace.seconds : inputs.pace.seconds}
                    onChange={(e) => handleInputChange('pace', 'seconds', e.target.value)}
                    disabled={isCalculatedField('pace')}
                    style={{
                      flex: '1',
                      minWidth: '0',
                      height: '40px',
                      padding: '6px 8px',
                      border: isCalculatedField('pace') ? '1px solid rgb(82 82 91 / 0.3)' : '2px solid rgb(59 130 246 / 0.8)',
                      borderRadius: '12px',
                      background: isCalculatedField('pace') ? 'rgb(63 63 70 / 0.4)' : 'rgb(24 24 27)',
                      color: isCalculatedField('pace') ? 'rgb(161 161 170)' : 'rgb(219 234 254)',
                      cursor: isCalculatedField('pace') ? 'not-allowed' : 'text',
                      opacity: isCalculatedField('pace') ? '0.6' : '1',
                      fontSize: '18px',
                      fontWeight: isCalculatedField('pace') ? '400' : '500',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Distance Section */}
              <div className="flex flex-col items-center" style={{
                padding: '24px',
                border: isCalculatedField('distance') ? 'none' : '2px dashed rgb(59 130 246 / 0.3)',
                borderRadius: '16px',
                background: isCalculatedField('distance') ? 'rgb(24 24 27 / 0.9)' : 'rgb(30 41 59 / 0.6)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <label 
                    style={{
                      color: isCalculatedField('distance') ? 'rgb(161 161 170)' : 'rgb(191 219 254)',
                      fontWeight: isCalculatedField('distance') ? '500' : '600',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {fieldIcons.distance}
                    Distance (miles)
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  value={isCalculatedField('distance') && calculatedValues.distance ? calculatedValues.distance : inputs.distance}
                  onChange={(e) => handleInputChange('distance', null, e.target.value)}
                  disabled={isCalculatedField('distance')}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '6px 12px',
                    border: isCalculatedField('distance') ? '1px solid rgb(82 82 91 / 0.3)' : '2px solid rgb(59 130 246 / 0.8)',
                    borderRadius: '12px',
                    background: isCalculatedField('distance') ? 'rgb(63 63 70 / 0.4)' : 'rgb(24 24 27)',
                    color: isCalculatedField('distance') ? 'rgb(161 161 170)' : 'rgb(219 234 254)',
                    cursor: isCalculatedField('distance') ? 'not-allowed' : 'text',
                    opacity: isCalculatedField('distance') ? '0.6' : '1',
                    fontSize: '18px',
                    fontWeight: isCalculatedField('distance') ? '400' : '500',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Time Section */}
              <div className="flex flex-col items-center" style={{
                padding: '24px',
                border: isCalculatedField('time') ? 'none' : '2px dashed rgb(59 130 246 / 0.3)',
                borderRadius: '16px',
                background: isCalculatedField('time') ? 'rgb(24 24 27 / 0.9)' : 'rgb(30 41 59 / 0.6)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <label 
                    style={{
                      color: isCalculatedField('time') ? 'rgb(161 161 170)' : 'rgb(191 219 254)',
                      fontWeight: isCalculatedField('time') ? '500' : '600',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {fieldIcons.time}
                    Time
                  </label>
                </div>
                <div className="flex w-full">
                  <input
                    type="number"
                    placeholder="h"
                    min="0"
                    value={isCalculatedField('time') && calculatedValues.time.hours ? calculatedValues.time.hours : inputs.time.hours}
                    onChange={(e) => handleInputChange('time', 'hours', e.target.value)}
                    disabled={isCalculatedField('time')}
                    style={{
                      flex: '1',
                      minWidth: '0',
                      height: '40px',
                      padding: '6px 8px',
                      border: isCalculatedField('time') ? '1px solid rgb(82 82 91 / 0.5)' : '2px solid rgb(59 130 246 / 0.8)',
                      borderRadius: '12px',
                      background: isCalculatedField('time') ? 'rgb(63 63 70 / 0.7)' : 'rgb(24 24 27)',
                      color: isCalculatedField('time') ? 'rgb(212 212 216)' : 'rgb(219 234 254)',
                      cursor: isCalculatedField('time') ? 'not-allowed' : 'text',
                      opacity: isCalculatedField('time') ? '0.9' : '1',
                      fontSize: '18px',
                      fontWeight: isCalculatedField('time') ? '400' : '500',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                  <div className="text-2xl text-zinc-500 font-semibold mx-2 flex items-center flex-shrink-0">:</div>
                  <input
                    type="number"
                    placeholder="m"
                    min="0"
                    max="59"
                    value={isCalculatedField('time') && calculatedValues.time.minutes ? calculatedValues.time.minutes : inputs.time.minutes}
                    onChange={(e) => handleInputChange('time', 'minutes', e.target.value)}
                    disabled={isCalculatedField('time')}
                    style={{
                      flex: '1',
                      minWidth: '0',
                      height: '40px',
                      padding: '6px 8px',
                      border: isCalculatedField('time') ? '1px solid rgb(82 82 91 / 0.5)' : '2px solid rgb(59 130 246 / 0.8)',
                      borderRadius: '12px',
                      background: isCalculatedField('time') ? 'rgb(63 63 70 / 0.7)' : 'rgb(24 24 27)',
                      color: isCalculatedField('time') ? 'rgb(212 212 216)' : 'rgb(219 234 254)',
                      cursor: isCalculatedField('time') ? 'not-allowed' : 'text',
                      opacity: isCalculatedField('time') ? '0.9' : '1',
                      fontSize: '18px',
                      fontWeight: isCalculatedField('time') ? '400' : '500',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                  <div className="text-2xl text-zinc-500 font-semibold mx-2 flex items-center flex-shrink-0">:</div>
                  <input
                    type="number"
                    placeholder="s"
                    min="0"
                    max="59"
                    value={isCalculatedField('time') && calculatedValues.time.seconds ? calculatedValues.time.seconds : inputs.time.seconds}
                    onChange={(e) => handleInputChange('time', 'seconds', e.target.value)}
                    disabled={isCalculatedField('time')}
                    style={{
                      flex: '1',
                      minWidth: '0',
                      height: '40px',
                      padding: '6px 8px',
                      border: isCalculatedField('time') ? '1px solid rgb(82 82 91 / 0.5)' : '2px solid rgb(59 130 246 / 0.8)',
                      borderRadius: '12px',
                      background: isCalculatedField('time') ? 'rgb(63 63 70 / 0.7)' : 'rgb(24 24 27)',
                      color: isCalculatedField('time') ? 'rgb(212 212 216)' : 'rgb(219 234 254)',
                      cursor: isCalculatedField('time') ? 'not-allowed' : 'text',
                      opacity: isCalculatedField('time') ? '0.9' : '1',
                      fontSize: '18px',
                      fontWeight: isCalculatedField('time') ? '400' : '500',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Reset Button */}
          <div className="text-center mt-10">
            <button 
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg"
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
