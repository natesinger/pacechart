import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, commonClasses } from '../../lib/utils';
export const InputField = ({ type, value, onChange, disabled = false, placeholder, label, icon, className, step, min, max }) => {
    const handleChange = (_field, newValue) => {
        if (type === 'single') {
            onChange(newValue);
        }
        else {
            // For time/pace inputs, we need to handle the nested object structure
            // This is a simplified version - in practice, you might want to pass the full object
            onChange(newValue);
        }
    };
    const renderInput = () => {
        const baseClasses = cn(commonClasses.input.base, disabled ? commonClasses.input.disabled : commonClasses.input.primary, className);
        if (type === 'single') {
            return (_jsx("input", { type: "number", placeholder: placeholder, step: step, min: min, max: max, value: value, onChange: (e) => handleChange(null, e.target.value), disabled: disabled, className: baseClasses }));
        }
        if (type === 'time') {
            const timeValue = value;
            return (_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("input", { type: "number", placeholder: "hr", min: "0", value: timeValue.hours, onChange: (e) => handleChange('hours', e.target.value), disabled: disabled, className: cn(baseClasses, 'text-center') }), _jsx("div", { className: "text-3xl text-zinc-500 font-bold", children: ":" }), _jsx("input", { type: "number", placeholder: "min", min: "0", max: "59", value: timeValue.minutes, onChange: (e) => handleChange('minutes', e.target.value), disabled: disabled, className: cn(baseClasses, 'text-center') }), _jsx("div", { className: "text-3xl text-zinc-500 font-bold", children: ":" }), _jsx("input", { type: "number", placeholder: "sec", min: "0", max: "59", value: timeValue.seconds, onChange: (e) => handleChange('seconds', e.target.value), disabled: disabled, className: cn(baseClasses, 'text-center') })] }));
        }
        if (type === 'pace') {
            const paceValue = value;
            return (_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("input", { type: "number", placeholder: "min", min: "0", value: paceValue.minutes, onChange: (e) => handleChange('minutes', e.target.value), disabled: disabled, className: cn(baseClasses, 'text-center') }), _jsx("div", { className: "text-3xl text-zinc-500 font-bold", children: ":" }), _jsx("input", { type: "number", placeholder: "sec", min: "0", max: "59", value: paceValue.seconds, onChange: (e) => handleChange('seconds', e.target.value), disabled: disabled, className: cn(baseClasses, 'text-center') })] }));
        }
        return null;
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "font-semibold flex items-center gap-2 text-base sm:text-lg text-zinc-300", children: [icon, label] }), renderInput()] }));
};
export default InputField;
