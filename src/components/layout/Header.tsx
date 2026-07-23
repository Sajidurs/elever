'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();

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
        <Link
          href="/shop"
          className="whitespace-nowrap rounded-full bg-brand-text px-4 py-2 text-[12.5px] font-medium text-brand-bg transition-opacity hover:opacity-85"
        >
          Shop now
        </Link>
      </div>
    </header>
  );
}
