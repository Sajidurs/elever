import { LinkButton } from '@/components/ui/Button';

const FLOATING_BADGES = [
  { icon: '◉', className: 'top-[14%] left-[4%] sm:left-[8%]', delay: '0s' },
  { icon: '↗', className: 'top-[10%] right-[6%] sm:right-[10%]', delay: '1.1s' },
  { icon: '✦', className: 'bottom-[18%] left-[9%] hidden sm:block', delay: '2.2s' },
  { icon: '◈', className: 'top-[58%] right-[3%] hidden md:block', delay: '0.6s' },
];

const HERO_POINTS = [
  { icon: '◉', text: 'One priority, decided before the noise' },
  { icon: '↗', text: 'A connected system that keeps you accountable' },
  { icon: '✦', text: 'Built on real research, not hype' },
];

type Props = {
  featuredTitle: string;
  featuredHref: string;
};

export function Hero({ featuredTitle, featuredHref }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand-accent/16 blur-[120px]"
      />
      {/* faint diagonal light rays */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]">
        <div className="absolute top-0 left-[18%] h-full w-px rotate-[14deg] bg-gradient-to-b from-transparent via-brand-accent to-transparent" />
        <div className="absolute top-0 left-[82%] h-full w-px rotate-[-10deg] bg-gradient-to-b from-transparent via-brand-accent to-transparent" />
      </div>

      {/* floating icon badges */}
      {FLOATING_BADGES.map((b) => (
        <div
          key={b.className}
          aria-hidden
          className={`animate-float absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-brand-surface/80 text-lg text-brand-accent shadow-[0_0_30px_rgba(193,160,120,0.15)] backdrop-blur-sm ${b.className}`}
          style={{ animationDelay: b.delay }}
        >
          {b.icon}
        </div>
      ))}

      <div className="relative mx-auto max-w-3xl px-5 pt-28 pb-20 text-center sm:px-8 sm:pt-36 sm:pb-24">
        <p className="mb-6 text-xs tracking-[0.22em] text-brand-accent uppercase">Elever Notes</p>
        <h1 className="text-[clamp(2.5rem,7vw,4.6rem)] leading-[1.05] font-extralight tracking-tight text-balance">
          <span className="block">Organize your life,</span>
          <span className="block bg-gradient-to-r from-brand-accent via-[#d8c3a2] to-brand-accent-light bg-clip-text text-transparent">
            one day at a time.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-brand-muted">
          A premium daily planner and a connected system, built to turn intention into focused execution — for
          people serious about how they spend their time.
        </p>

        <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left sm:mx-auto">
          {HERO_POINTS.map((p) => (
            <li key={p.text} className="flex items-center gap-3 text-[15px] text-[#dcdcdb]">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-brand-accent">
                {p.icon}
              </span>
              {p.text}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <LinkButton href={featuredHref} variant="accent">
            Get started
          </LinkButton>
          <LinkButton href="/features" variant="secondary">
            See how it works
          </LinkButton>
        </div>
        <p className="mt-5 text-xs text-brand-subtle">Buy {featuredTitle} — free shipping, undated, starts any day.</p>
      </div>
    </section>
  );
}
