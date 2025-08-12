import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
export const CalculationModeSelector = ({ modes, activeMode, onModeChange, className }) => {
    return (_jsx("div", { className: cn('grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12', className), children: modes.map(({ id, Icon, title, subtitle }) => {
            const isActive = activeMode === id;
            return (_jsxs("button", { onClick: () => onModeChange(id), className: cn('p-5 rounded-2xl border-2 text-left md:text-center transition-all duration-300 ease-in-out', 'flex items-center md:flex-col md:items-center gap-4 md:gap-0', isActive
                    ? 'border-blue-500 bg-blue-900/40 shadow-lg shadow-blue-500/10 md:scale-105'
                    : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700/50'), children: [_jsx(Icon, { className: cn('w-8 h-8 flex-shrink-0 transition-colors md:mx-auto md:mb-3', isActive ? 'text-blue-400' : 'text-zinc-400') }), _jsxs("div", { children: [_jsx("h3", { className: cn('text-base sm:text-lg font-semibold transition-colors', isActive ? 'text-blue-300' : 'text-zinc-200'), children: title }), _jsx("p", { className: cn('text-sm mt-1 transition-colors', isActive ? 'text-blue-400' : 'text-zinc-500'), children: subtitle })] })] }, id));
        }) }));
};
export default CalculationModeSelector;
