export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
