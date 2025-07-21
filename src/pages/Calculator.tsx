import { useState, useEffect } from "react";
import { Calculator, Clock, MapPin, Timer, ArrowLeft, RefreshCw } from "lucide-react";

// A configuration array for the calculation modes to keep the code DRY.
const CALCULATION_MODES = [
  { id: "pace", Icon: Clock, title: "Calculate Pace", subtitle: "Pace from distance & time" },
  { id: "distance", Icon: MapPin, title: "Calculate Distance", subtitle: "Distance from pace & time" },
  { id: "time", Icon: Timer, title: "Calculate Time", subtitle: "Time from pace & distance" }
];

export default function App() {
  const [activeCalculation, setActiveCalculation] = useState("pace");
  const [inputs, setInputs] = useState({
    pace: { minutes: "", seconds: "" },
    distance: "",
    time: { hours: "", minutes: "", seconds: "" }
  });
  const [calculatedValues, setCalculatedValues] = useState({
    pace: { minutes: "", seconds: "" },
    distance: "",
    time: { hours: "", minutes: "", seconds: "" }
  });

  // --- Calculation Logic ---

  const paceToSeconds = (minutes: string, seconds: string) => {
    return (parseFloat(minutes) || 0) * 60 + (parseFloat(seconds) || 0);
  };

  const secondsToPace = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return { minutes: "", seconds: "" };
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return {
      minutes: mins.toString(),
      seconds: secs.toString()
    };
  };

  const timeToSeconds = (hours: string, minutes: string, seconds: string) => {
    return (parseFloat(hours) || 0) * 3600 + (parseFloat(minutes) || 0) * 60 + (parseFloat(seconds) || 0);
  };

  const secondsToTime = (totalSeconds: number) => {
    if (isNaN(totalSeconds) || !isFinite(totalSeconds)) return { hours: "", minutes: "", seconds: "" };
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);
    return {
      hours: hours.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString()
    };
  };

  // Main calculation effect hook.
  useEffect(() => {
    const calculate = () => {
      try {
        if (activeCalculation === "pace") {
          const distance = parseFloat(inputs.distance);
          const totalTimeSeconds = timeToSeconds(inputs.time.hours, inputs.time.minutes, inputs.time.seconds);
          if (distance > 0 && totalTimeSeconds > 0) {
            setCalculatedValues(prev => ({ ...prev, pace: secondsToPace(totalTimeSeconds / distance) }));
          } else {
            setCalculatedValues(prev => ({ ...prev, pace: { minutes: "", seconds: "" } }));
          }
        } else if (activeCalculation === "distance") {
          const paceSeconds = paceToSeconds(inputs.pace.minutes, inputs.pace.seconds);
          const totalTimeSeconds = timeToSeconds(inputs.time.hours, inputs.time.minutes, inputs.time.seconds);
          if (paceSeconds > 0 && totalTimeSeconds > 0) {
            setCalculatedValues(prev => ({ ...prev, distance: (totalTimeSeconds / paceSeconds).toFixed(2) }));
          } else {
            setCalculatedValues(prev => ({ ...prev, distance: "" }));
          }
        } else if (activeCalculation === "time") {
          const paceSeconds = paceToSeconds(inputs.pace.minutes, inputs.pace.seconds);
          const distance = parseFloat(inputs.distance);
          if (paceSeconds > 0 && distance > 0) {
            setCalculatedValues(prev => ({ ...prev, time: secondsToTime(paceSeconds * distance) }));
          } else {
            setCalculatedValues(prev => ({ ...prev, time: { hours: "", minutes: "", seconds: "" } }));
          }
        }
      } catch (error) {
        console.error("Calculation Error:", error);
        setCalculatedValues({ pace: { minutes: "", seconds: "" }, distance: "", time: { hours: "", minutes: "", seconds: "" } });
      }
    };
    calculate();
  }, [inputs, activeCalculation]);

  // Handles input changes and sanitizes values.
  const handleInputChange = (category: keyof typeof inputs, field: string | null, value: string) => {
    const sanitizedValue = value && parseFloat(value) < 0 ? Math.abs(parseFloat(value)).toString() : value;
    setInputs(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' && field
        ? { ...prev[category], [field]: sanitizedValue }
        : sanitizedValue
    }));
  };
  
  // Function to reset all inputs and calculated values.
  const handleReset = () => {
    setInputs({
      pace: { minutes: "", seconds: "" },
      distance: "",
      time: { hours: "", minutes: "", seconds: "" }
    });
    setCalculatedValues({
      pace: { minutes: "", seconds: "" },
      distance: "",
      time: { hours: "", minutes: "", seconds: "" }
    });
  };

  const isCalculatedField = (type: string) => activeCalculation === type;

  return (
    // FIX: Removed flexbox from the root element to allow natural page flow and scrolling.
    // min-h-screen ensures the background covers the viewport even on short content pages.
    <div className="bg-zinc-900 text-zinc-100 font-sans w-full min-h-screen">
      
      {/* FIX: Removed the intermediate `flex-grow` wrapper. This is now the main content container. */}
      <div className="relative max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <div className="absolute top-4 left-4">
          <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back
          </a>
        </div>
        
        <header className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 mt-12 sm:mt-10">
            <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pace Calculator</h1>
          </div>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Select a calculation, fill the other fields.
          </p>
        </header>

        <main>
            {/* Calculation Mode Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
            {CALCULATION_MODES.map(({ id, Icon, title, subtitle }) => (
                <button
                key={id}
                onClick={() => setActiveCalculation(id)}
                className={`p-5 rounded-2xl border-2 text-left md:text-center transition-all duration-300 ease-in-out flex items-center md:flex-col md:items-center gap-4 md:gap-0 ${
                    isCalculatedField(id)
                    ? "border-blue-500 bg-blue-900/40 shadow-lg shadow-blue-500/10 md:scale-105"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700/50"
                }`}
                >
                <Icon className={`w-8 h-8 flex-shrink-0 transition-colors md:mx-auto md:mb-3 ${isCalculatedField(id) ? "text-blue-400" : "text-zinc-400"}`} />
                <div>
                  <h3 className={`text-base sm:text-lg font-semibold transition-colors ${isCalculatedField(id) ? "text-blue-300" : "text-zinc-200"}`}>
                      {title}
                  </h3>
                  <p className={`text-sm mt-1 transition-colors ${isCalculatedField(id) ? "text-blue-400" : "text-zinc-500"}`}>
                      {subtitle}
                  </p>
                </div>
                </button>
            ))}
            </div>

            {/* Input Section */}
            <div className="bg-zinc-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-zinc-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-6">
                  
                  {/* Pace Input */}
                  <div className={`space-y-3 transition-opacity duration-300 ${!isCalculatedField('pace') ? 'opacity-75 hover:opacity-100' : ''}`}>
                  <label className={`font-semibold flex items-center gap-2 text-base sm:text-lg ${isCalculatedField('pace') ? "text-blue-300" : "text-zinc-300"}`}>
                      <Clock className="w-5 h-5" /> Pace (per mile)
                  </label>
                  <div className="flex gap-2 items-center">
                      <input type="number" placeholder="min" min="0" value={isCalculatedField('pace') ? calculatedValues.pace.minutes : inputs.pace.minutes} onChange={(e) => handleInputChange("pace", "minutes", e.target.value)} disabled={isCalculatedField('pace')} className={`w-full text-center p-3 border rounded-xl text-lg sm:text-xl transition-all ${isCalculatedField('pace') ? "bg-blue-900/40 border-blue-500 text-blue-200 font-bold cursor-default" : "bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`} />
                      <div className="text-2xl text-zinc-500 font-sans">:</div>
                      <input type="number" placeholder="sec" min="0" max="59" value={isCalculatedField('pace') ? (calculatedValues.pace.seconds || '').padStart(2, '0') : inputs.pace.seconds} onChange={(e) => handleInputChange("pace", "seconds", e.target.value)} disabled={isCalculatedField('pace')} className={`w-full text-center p-3 border rounded-xl text-lg sm:text-xl transition-all ${isCalculatedField('pace') ? "bg-blue-900/40 border-blue-500 text-blue-200 font-bold cursor-default" : "bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`} />
                  </div>
                  </div>

                  {/* Distance Input */}
                  <div className={`space-y-3 transition-opacity duration-300 ${!isCalculatedField('distance') ? 'opacity-75 hover:opacity-100' : ''}`}>
                  <label className={`font-semibold flex items-center gap-2 text-base sm:text-lg ${isCalculatedField('distance') ? "text-blue-300" : "text-zinc-300"}`}>
                      <MapPin className="w-5 h-5" /> Distance (miles)
                  </label>
                  <input type="number" placeholder="e.g., 3.1" step="0.1" min="0" value={isCalculatedField('distance') ? calculatedValues.distance : inputs.distance} onChange={(e) => handleInputChange("distance", null, e.target.value)} disabled={isCalculatedField('distance')} className={`w-full p-3 border rounded-xl text-lg sm:text-xl transition-all ${isCalculatedField('distance') ? "bg-blue-900/40 border-blue-500 text-blue-200 font-bold cursor-default" : "bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`} />
                  </div>

                  {/* Time Input */}
                  <div className={`space-y-3 transition-opacity duration-300 ${!isCalculatedField('time') ? 'opacity-75 hover:opacity-100' : ''}`}>
                  <label className={`font-semibold flex items-center gap-2 text-base sm:text-lg ${isCalculatedField('time') ? "text-blue-300" : "text-zinc-300"}`}>
                      <Timer className="w-5 h-5" /> Time
                  </label>
                  <div className="flex gap-2 items-center">
                      <input type="number" placeholder="hr" min="0" value={isCalculatedField('time') ? calculatedValues.time.hours : inputs.time.hours} onChange={(e) => handleInputChange("time", "hours", e.target.value)} disabled={isCalculatedField('time')} className={`w-full text-center p-3 border rounded-xl text-lg sm:text-xl transition-all ${isCalculatedField('time') ? "bg-blue-900/40 border-blue-500 text-blue-200 font-bold cursor-default" : "bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`} />
                      <div className="text-2xl text-zinc-500 font-sans">:</div>
                      <input type="number" placeholder="min" min="0" max="59" value={isCalculatedField('time') ? (calculatedValues.time.minutes || '').padStart(2, '0') : inputs.time.minutes} onChange={(e) => handleInputChange("time", "minutes", e.target.value)} disabled={isCalculatedField('time')} className={`w-full text-center p-3 border rounded-xl text-lg sm:text-xl transition-all ${isCalculatedField('time') ? "bg-blue-900/40 border-blue-500 text-blue-200 font-bold cursor-default" : "bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`} />
                      <div className="text-2xl text-zinc-500 font-sans">:</div>
                      <input type="number" placeholder="sec" min="0" max="59" value={isCalculatedField('time') ? (calculatedValues.time.seconds || '').padStart(2, '0') : inputs.time.seconds} onChange={(e) => handleInputChange("time", "seconds", e.target.value)} disabled={isCalculatedField('time')} className={`w-full text-center p-3 border rounded-xl text-lg sm:text-xl transition-all ${isCalculatedField('time') ? "bg-blue-900/40 border-blue-500 text-blue-200 font-bold cursor-default" : "bg-zinc-900 border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`} />
                  </div>
                  </div>
              </div>
            </div>
            
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
  );
}
