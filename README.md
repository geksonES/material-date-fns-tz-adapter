# material-date-fns-tz-adapter
Makes it possible for mat-datepicker to work with time zones.

- Angular 15
- Typescript 4.8.4
- Node 18.12.1

## Initialization
Make sure you updated the providers.
```typescript
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import enUS from 'date-fns/locale/en-US';
import {
  MAT_DATE_TIMEZONE,
  DateFnsTzAdapter,
} from './index.ts';
```
---
```typescript
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
