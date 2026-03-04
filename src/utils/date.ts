import { DateTime } from 'luxon';

const RELATIVE_DATE_THRESHOLD_DAYS = 7;

export function formatRelativeDate(date: Date): string {
  const dt = DateTime.fromJSDate(date);
  const now = DateTime.now();
  const diffDays = now.diff(dt, 'days').days;

  if (diffDays < RELATIVE_DATE_THRESHOLD_DAYS) {
    return dt.toRelative() ?? dt.toFormat('MMM d, yyyy');
  }

  return dt.toFormat('MMM d, yyyy');
}

export function formatFullDate(date: Date): string {
  return DateTime.fromJSDate(date).toFormat("MMM d, yyyy 'at' h:mm a");
}

export function areDatesEqual(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}
