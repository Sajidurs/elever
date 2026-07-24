'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart/CartContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-brand-bg/70 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-brand-text">
          <span className="text-[19px] font-medium tracking-[0.14em]">ELEVER</span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'border-b pb-1 text-[13px] transition-colors',
                  active
                    ? 'border-brand-accent text-brand-text'
                    : 'border-transparent text-brand-muted hover:text-brand-text',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cart" aria-label="Cart" className="relative flex items-center text-brand-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-medium text-brand-bg">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/shop"
            className="whitespace-nowrap rounded-full bg-brand-text px-4 py-2 text-[12.5px] font-medium text-brand-bg transition-opacity hover:opacity-85"
          >
            Shop now
          </Link>
        </div>
      </div>
    </header>
  );
}
