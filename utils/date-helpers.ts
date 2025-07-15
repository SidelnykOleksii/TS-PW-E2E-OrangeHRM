import { addDays, format, differenceInCalendarDays } from "date-fns";

/**
 * Generates the expected date in YYYY-MM-DD format.
 * @param daysToAdd Number of days to add/subtract from the current date.
 * @returns Date string in YYYY-MM-DD format.
 */

export function getFormattedDate(daysToAdd: number): string {
  const today = new Date();
  const futureDate = addDays(today, daysToAdd);
  return format(futureDate, "yyyy-MM-dd");
}

/**
 * Calculates the number of days between two dates (inclusive).
 * @param fromDateString Start date in YYYY-MM-DD format.
 * @param toDateString End date in YYYY-MM-DD format.
 * @returns Number of days.
 */

export function getNumberOfDays(
  fromDateString: string,
  toDateString: string
): number {
  const fromDate = new Date(fromDateString);
  const toDate = new Date(toDateString);

  // differenceInCalendarDays calculates the difference in calendar days.
  // If you want 2025-07-10 to 2025-07-10 to be 1 day, add +1.
  return differenceInCalendarDays(toDate, fromDate) + 1;
}
