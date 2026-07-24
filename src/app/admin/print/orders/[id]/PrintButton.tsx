'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden mb-6 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
    >
      Print
    </button>
  );
}
