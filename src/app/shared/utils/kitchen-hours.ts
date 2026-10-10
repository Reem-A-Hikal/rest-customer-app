const KITCHEN_OPEN_HOUR = 18;

function getCairoHour(date: Date): number {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(date);
  return Number(formatted);
}

export function isKitchenOpen(date: Date = new Date()): boolean {
  return getCairoHour(date) >= KITCHEN_OPEN_HOUR;
}
