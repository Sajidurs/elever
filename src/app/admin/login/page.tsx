import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-5">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-surface p-8">
        <p className="mb-6 text-[15px] font-semibold tracking-[0.08em]">ELEVER ADMIN</p>
        <LoginForm />
      </div>
    </div>
  );
}
