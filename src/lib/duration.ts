const numberFormatter = new Intl.NumberFormat('en-US');

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  const parts = [
    days > 0 ? `${formatNumber(days)} ${days === 1 ? 'day' : 'days'}` : null,
    hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : null,
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : null
  ].filter((part): part is string => part !== null);

  if (parts.length === 0) {
    return 'Less than a minute';
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
}
