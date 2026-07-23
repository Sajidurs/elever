import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <section className="mx-auto max-w-md px-5 py-32 text-center sm:px-8">
      <p className="mb-5 text-brand-muted">We couldn&apos;t find that product.</p>
      <Link
        href="/shop"
        className="inline-block rounded-full bg-brand-accent px-5.5 py-2.75 text-[13.5px] font-medium text-brand-bg"
      >
        Back to shop
      </Link>
    </section>
  );
}
