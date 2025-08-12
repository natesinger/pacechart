import React from 'react';
export interface StatusBadgeProps {
    type: 'input' | 'result' | 'calculated';
    variant?: 'default' | 'accent' | 'neutral';
    className?: string;
}
export declare const StatusBadge: React.FC<StatusBadgeProps>;
export default StatusBadge;
