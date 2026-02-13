'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'solid' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl overflow-hidden';

    const variants = {
      default:
        'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
      glass:
        'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl',
      solid:
        'bg-white shadow-lg',
      gradient:
        'bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-md border border-white/20',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hoverable
      ? 'transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer'
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
