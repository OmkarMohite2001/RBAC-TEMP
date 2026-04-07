import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  format,
  parseISO,
  differenceInDays,
  addDays,
  subDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  endOfDay,
  isWeekend,
  toDate,
} from 'date-fns';
import { toZonedTime, fromZonedTime} from 'date-fns-tz';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  formatDate(date: Date | string, dateFormat: string = 'yyyy-MM-dd'): string {
    return format(new Date(date), dateFormat);
  }

  compareDateValidator(startField: string, endField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formValues = control.value;

      const startDate = formValues[startField];
      const endDate = formValues[endField];

      // If either date is not set, no validation (optional logic)
      if (!startDate || !endDate) {
        return null;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      // Check if end date is after start date
      if (!isAfter(end, start)) {
        return { endBeforeStart: true };
      }

      // Check if end date is not after today's date
      // if (isAfter(end, today)) {
      //   return { endAfterToday: true };
      // }

      return null; // No errors, validation passed
    };
  }

  parseISODate(isoString: string): Date {
    return parseISO(isoString);
  }

  getDifferenceInDays(date1: Date, date2: Date): number {
    return differenceInDays(date1, date2);
  }

  addDaysToDate(date: Date, days: number): Date {
    return addDays(date, days);
  }

  subtractDaysFromDate(date: Date, days: number): Date {
    return subDays(date, days);
  }

  getDifferenceInHours(date1: Date, date2: Date): number {
    return differenceInHours(date1, date2);
  }

  getDifferenceInMinutes(date1: Date, date2: Date): number {
    return differenceInMinutes(date1, date2);
  }

  getDifferenceInSeconds(date1: Date, date2: Date): number {
    return differenceInSeconds(date1, date2);
  }

  isDateBefore(date1: Date, date2: Date): boolean {
    return isBefore(date1, date2);
  }

  isDateAfter(date1: Date, date2: Date): boolean {
    return isAfter(date1, date2);
  }

  isSameDayCheck(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  getStartOfDay(date: Date): Date {
    return startOfDay(date);
  }

  getEndOfDay(date: Date): Date {
    return endOfDay(date);
  }

  isWeekendCheck(date: Date): boolean {
    return isWeekend(date);
  }

  convertToUTC(date: Date | string, timeZone: string): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return toZonedTime(parsedDate, timeZone);
  }

  getLocalDateTime(date: Date | string, timeZone: string): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return fromZonedTime(parsedDate, timeZone);
  }

  convertUTCToLocal(utcDateString: string | Date) {
     let date = new Date(utcDateString);
    const utcDate = format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const localDate = toZonedTime(utcDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
    // Format the date same as input string also working with return below
    //const localDateString = format(localDate, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS");
    return localDate;
  }
}
