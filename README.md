# material-date-fns-tz-adapter
Makes it possible for mat-datepicker to work with time zones.

## Initialization
Make sure you updated the providers
```
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        timezone: '+0900',
      },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: enUS,
    },
    {
      provide: MAT_DATE_TIMEZONE,
      useValue: 'Asia/Tokyo',
    },
    {
      provide: DateAdapter,
      useClass: DateFnsTzAdapter,
      deps: [MAT_DATE_LOCALE, MAT_DATE_TIMEZONE],
    },
  ],
```
