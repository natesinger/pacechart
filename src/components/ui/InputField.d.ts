import React from 'react';
export interface InputFieldProps {
    type: 'single' | 'time' | 'pace';
    value: string | {
        [key: string]: string;
    };
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    step?: string;
    min?: string;
    max?: string;
}
export declare const InputField: React.FC<InputFieldProps>;
export default InputField;
