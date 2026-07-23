import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { href: '/shop', label: 'All products' },
      { href: '/features', label: 'Features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/shop#reviews', label: 'Reviews' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/activate', label: 'Activate your planner' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0a0a0b]">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
        <div className="mb-10 flex items-center gap-2.5">
          <span className="text-xl font-medium tracking-[0.14em] text-brand-text">ELEVER</span>
        </div>
        <p className="mb-12 max-w-[30ch] text-lg leading-snug font-light text-brand-text sm:text-2xl">
          Elever Notes builds calm tools for focused, deliberate work.
        </p>
        <div className="grid grid-cols-2 gap-9 border-b border-white/8 pb-10 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-medium tracking-wide text-brand-text uppercase">{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13.5px] text-brand-muted hover:text-brand-text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="py-8 text-[11px] leading-relaxed text-brand-subtle">
          Elever G1 is undated and can begin on any day. Digital activation, rewards, the Elever To-Do App and the
          free productivity PDF are provided to registered planner owners; availability and terms may change.
          Loyalty rewards apply toward a future Elever planner.
        </p>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-brand-subtle sm:flex-row">
          <span>&copy; 2026 Elever Notes. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
