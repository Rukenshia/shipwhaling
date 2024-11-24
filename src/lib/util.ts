export function prettyAmount(amount: number | undefined): string {
  return new Intl.NumberFormat('en-US').format(amount);
}
