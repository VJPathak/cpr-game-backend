import { Injectable } from '@nestjs/common';
import { isSameDay, format } from 'date-fns';

@Injectable()
export class DateUtilsService {
  static isDateDifferent(lastDate: Date, today: Date): boolean {
    return lastDate.getDate() !== today.getDate();
  }

  static formatDate(date: Date, formatType?: string): string {
    return format(date, formatType || 'dd/MM/yyyy');
  }
  // Check if two dates are the same
  static isSameDate(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  // Check if the week has changed
  static isWeekDifferent(lastDate: Date | null, today: Date): boolean {
    if (!lastDate) return true;
    return this.getWeekNumber(lastDate) !== this.getWeekNumber(today);
  }

  // Check if the month has changed
  static isMonthDifferent(lastDate: Date | null, today: Date): boolean {
    if (!lastDate) return true;
    return lastDate.getMonth() !== today.getMonth();
  }

  // Get the week number of the year
  static getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
    );
    return Math.ceil((days + 1) / 7);
  }

  // Check if it's the same day of the week
  static isSameDayOfWeek(today: Date, startDate: Date): boolean {
    return today.getDay() === startDate.getDay();
  }

  // Check if it's the same day of the month
  static isSameDayOfMonth(today: Date, startDate: Date): boolean {
    return today.getDate() === startDate.getDate();
  }
}
