import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s — Elever Notes',
    default: 'Elever Notes — Do the work that matters, every day',
  },
  description:
    'A premium daily planner and connected system built to turn intention into focused execution, one deliberate day at a time.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-brand-bg font-sans text-brand-text antialiased">{children}</body>
    </html>
  );
}
