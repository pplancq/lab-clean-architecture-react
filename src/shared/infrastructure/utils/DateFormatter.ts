/* eslint-disable class-methods-use-this */
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';

/**
 * Implementation of DateFormatterInterface using local timezone date methods.
 */
export class DateFormatter implements DateFormatterInterface {
  toLocalDateString(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }

  fromLocalDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
