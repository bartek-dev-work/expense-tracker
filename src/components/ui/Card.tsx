import { forwardRef, type HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = '', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-card ${className}`}
      {...props}
    />
  );
});
