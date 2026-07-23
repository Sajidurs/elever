'use client';

type Props = {
  name: string;
  discountText: string;
  pdfUrl: string | null;
  playstoreUrl: string | null;
  onClose: () => void;
};

export function RewardsPopup({ name, discountText, pdfUrl, playstoreUrl, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-surface p-8 text-center sm:p-10">
        <p className="mb-4 text-xs tracking-[0.2em] text-brand-accent uppercase">Activated</p>
        <h2 className="mb-3.5 text-2xl font-light sm:text-[28px]">Congratulations, {name}.</h2>
        <p className="mb-7 leading-relaxed text-[#c9c9cc]">
          Your planner is activated. You&apos;ve unlocked {discountText} off your next purchase.
        </p>
        <div className="flex flex-col gap-3">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand-accent py-3.5 text-sm font-medium text-brand-bg"
            >
              Download your free PDF
            </a>
          )}
          {playstoreUrl && (
            <a
              href={playstoreUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/18 py-3.5 text-sm font-medium"
            >
              Get the Premium To-Do App — free forever
            </a>
          )}
          <button onClick={onClose} className="mt-1.5 cursor-pointer text-[13px] text-brand-muted">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
