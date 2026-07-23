import Link from 'next/link';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'accent';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-text text-brand-bg hover:opacity-85',
  secondary: 'border border-white/18 text-brand-text hover:border-white/40',
  accent: 'bg-brand-accent text-brand-bg hover:opacity-90',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full px-7 py-3.5 text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], className)} {...props} />;
}

export function LinkButton({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], className)}>
      {children}
    </Link>
  );
}
