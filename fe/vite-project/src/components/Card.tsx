import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ children, className, padding = 'md' }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}