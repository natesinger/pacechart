import type { CalculationMode } from '../components/ui/CalculationModeSelector';
export declare const CALCULATION_MODES: CalculationMode[];
export declare const INPUT_FIELD_CONFIG: {
    pace: {
        label: string;
        type: "pace";
        placeholder: string;
        step: string;
        min: string;
    };
    distance: {
        label: string;
        type: "single";
        placeholder: string;
        step: string;
        min: string;
    };
    time: {
        label: string;
        type: "time";
        placeholder: string;
        step: string;
        min: string;
    };
};
export declare const STYLING_CONFIG: {
    container: {
        base: string;
        input: string;
        output: string;
    };
    labels: {
        input: string;
        output: string;
    };
    inputs: {
        input: string;
        output: string;
    };
    values: {
        input: string;
        output: string;
    };
};
export declare const APP_CONFIG: {
    name: string;
    version: string;
    description: string;
    author: string;
    github: string;
    linkedin: string;
};
