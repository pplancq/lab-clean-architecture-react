/**
 * Interface for date formatting utilities.
 *
 * Provides methods for converting between Date objects and `YYYY-MM-DD` string
 * representations using the local timezone, to avoid UTC off-by-one-day issues
 * that arise when working with `<input type="date">` values.
 */
export interface DateFormatterInterface {
  /**
   * Formats a Date object as a `YYYY-MM-DD` string using the local timezone.
   *
   * Unlike `date.toISOString().split('T')[0]`, this method uses local date parts
   * so the result always matches the user's perceived "today".
   *
   * @param date - The Date to format
   * @returns A string in `YYYY-MM-DD` format
   */
  toLocalDateString(date: Date): string;

  /**
   * Parses a `YYYY-MM-DD` string into a Date object at midnight local time.
   *
   * Unlike `new Date('YYYY-MM-DD')`, which is treated as UTC midnight and can
   * shift the date by ±1 day depending on the user's timezone, this method
   * creates the Date in local time.
   *
   * @param dateString - A string in `YYYY-MM-DD` format
   * @returns A Date set to midnight in the local timezone
   */
  fromLocalDateString(dateString: string): Date;
}
