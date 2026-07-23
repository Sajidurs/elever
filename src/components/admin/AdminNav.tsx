'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/app/admin/(protected)/actions';

const NAV_ITEMS = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/activations', label: 'Activations' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-52 flex-shrink-0 flex-col border-r border-white/8 p-5">
      <p className="mb-6 px-2.5 text-[15px] font-semibold tracking-[0.06em]">ELEVER ADMIN</p>
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'mb-0.5 rounded-lg px-2.5 py-2.5 text-sm',
              active ? 'bg-brand-accent/15 text-brand-accent' : 'text-[#c9c9cc] hover:bg-white/5',
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <form action={logout} className="mt-6">
        <button className="w-full cursor-pointer rounded-lg border border-white/18 py-2.5 text-sm">
          Log out
        </button>
      </form>
    </nav>
  );
}
