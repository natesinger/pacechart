export interface PaceInputs {
    minutes: string;
    seconds: string;
}
export interface TimeInputs {
    hours: string;
    minutes: string;
    seconds: string;
}
export interface CalculatorInputs {
    pace: PaceInputs;
    distance: string;
    time: TimeInputs;
}
export interface CalculatorValues {
    pace: PaceInputs;
    distance: string;
    time: TimeInputs;
}
export type CalculationType = 'pace' | 'distance' | 'time';
export declare const usePaceCalculator: () => {
    activeCalculation: CalculationType;
    inputs: CalculatorInputs;
    calculatedValues: CalculatorValues;
    setActiveCalculation: import("react").Dispatch<import("react").SetStateAction<CalculationType>>;
    handleInputChange: (category: keyof CalculatorInputs, field: string | null, value: string) => void;
    handleReset: () => void;
    isCalculatedField: (type: CalculationType) => boolean;
};
