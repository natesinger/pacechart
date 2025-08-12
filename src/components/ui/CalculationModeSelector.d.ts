import React from 'react';
export interface CalculationMode {
    id: string;
    Icon: React.ComponentType<{
        className?: string;
    }>;
    title: string;
    subtitle: string;
}
export interface CalculationModeSelectorProps {
    modes: CalculationMode[];
    activeMode: string;
    onModeChange: (modeId: string) => void;
    className?: string;
}
export declare const CalculationModeSelector: React.FC<CalculationModeSelectorProps>;
export default CalculationModeSelector;
