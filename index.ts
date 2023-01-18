import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import formatInTimeZone from 'date-fns-tz/formatInTimeZone';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import getDate from 'date-fns/getDate';
import getDay from 'date-fns/getDay';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';

export const MAT_DATE_TIMEZONE = new InjectionToken<string>(
  'timeZone that will go into date-fnz-tz',
);

@Injectable()
export class DateFnsTzAdapter extends DateFnsAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: {},
    @Optional()
    @Inject(MAT_DATE_TIMEZONE)
    public matDateTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  ) {
    super(matDateLocale);
  }

  override getYear(date: Date): number {
    return getYear(utcToZonedTime(date, this.matDateTimezone));
  }

  override getMonth(date: Date): number {
    return getMonth(utcToZonedTime(date, this.matDateTimezone));
  }

  override getDate(date: Date): number {
    return getDate(utcToZonedTime(date, this.matDateTimezone));
  }

  override getDayOfWeek(date: Date): number {
    return getDay(utcToZonedTime(date, this.matDateTimezone));
  }

  override format(date: Date, displayFormat: string): string {
    if (!this.isValid(date)) {
      throw Error('DateFnsAdapter: Cannot format invalid date.');
    }

    return formatInTimeZone(date, this.matDateTimezone, displayFormat, {
      locale: this.locale,
    });
  }

  override createDate(year: number, month: number, date: number): Date {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      // Check for invalid month and date (except upper bound on date which we have to check after
      // creating the Date).
      if (month < 0 || month > 11) {
        throw Error(
          `Invalid month index "${month}". Month index has to be between 0 and 11.`,
        );
      }
      if (date < 1) {
        throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
      }
    }

    // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
    // To work around this we use `setFullYear` and `setHours` instead.
    const result = new Date();
    result.setFullYear(year, month, date);
    result.setHours(0, 0, 0, 0);

    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    if (
      result.getMonth() != month &&
      (typeof ngDevMode === 'undefined' || ngDevMode)
    ) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return zonedTimeToUtc(result, this.matDateTimezone);
  }
}
