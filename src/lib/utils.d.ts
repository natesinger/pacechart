import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare const timeUtils: {
    paceToSeconds: (minutes: string, seconds: string) => number;
    secondsToPace: (seconds: number) => {
        minutes: string;
        seconds: string;
    };
    timeToSeconds: (hours: string, minutes: string, seconds: string) => number;
    secondsToTime: (totalSeconds: number) => {
        hours: string;
        minutes: string;
        seconds: string;
    };
    formatTime: (minutes: number) => string;
};
export declare const validationUtils: {
    sanitizeNumericInput: (value: string) => string;
    isValidPositiveNumber: (value: string) => boolean;
};
export declare const storageUtils: {
    load: <T>(key: string, defaultValue: T) => T;
    save: (key: string, value: unknown) => void;
};
export declare const designTokens: {
    colors: {
        primary: {
            50: string;
            100: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
        };
        neutral: {
            50: string;
            100: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
        };
        accent: {
            50: string;
            100: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
};
export declare const commonClasses: {
    button: {
        base: string;
        primary: string;
        secondary: string;
        accent: string;
    };
    input: {
        base: string;
        primary: string;
        disabled: string;
    };
    card: {
        base: string;
        interactive: string;
    };
};
