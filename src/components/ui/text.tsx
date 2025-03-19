import { cn } from '@/lib/utils';
import React, { FC, ReactNode } from 'react';

interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    className?: string;
    children: ReactNode;
}

const typographyStyles: Record<string, string> = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
    p: 'text-base',
    span: 'text-sm',
};

const Text: FC<TypographyProps> = ({ variant = 'p', className = '', children }) => {
    const Component = variant;
    const style = typographyStyles[Component] || typographyStyles.p;

    return <Component className={cn(style, className)}>{children}</Component>;
};

export default Text;
