import { CatalogSessionDto } from '../../types/shared-types';
import { BusinessInfo } from '@wix/bookings-uou-types';
import { getDayFromDateAsISO } from '../../mappers/date-mappers-helpers';
import {
  DurationMapper,
  DurationMapperOptions,
} from '@wix/bookings-uou-mappers';

export interface SchedulingSectionViewModel {
  schedulingDaysViewModel?: SchedulingDayViewModel[];
  status: SchedulingSectionStatus;
  firstSessionDate?: string;
  lastSessionDate?: string;
  isBookable: boolean;
}

export interface SchedulingDayViewModel {
  date: string;
  dailySessions: DailySession[];
}

export interface DailySession {
  startTime: string;
  durationText: string;
  durationAriaLabel: string;
  staffName: string;
  locationName?: string;
}

// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
export enum SchedulingSectionStatus {
  LOADING = 'LOADING',
  EMPTY = 'EMPTY',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export const schedulingSectionViewModelFactory = ({
  catalogSessionsDto,
  businessInfo,
  firstSessionStart,
  lastSessionEnd,
  viewTimezone,
  isCourse = false,
  isBookable,
  t,
}: {
  catalogSessionsDto?: CatalogSessionDto[];
  businessInfo: BusinessInfo;
  firstSessionStart?: string;
  lastSessionEnd?: string;
  viewTimezone?: string;
  isCourse?: boolean;
  isBookable: boolean;
  t;
}): SchedulingSectionViewModel => {
  if (!catalogSessionsDto) {
    return { status: SchedulingSectionStatus.EMPTY, isBookable };
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(
    businessInfo.dateRegionalSettingsLocale,
    {
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: viewTimezone,
    },
  );
  const dateFormatter = new Intl.DateTimeFormat(
    businessInfo.dateRegionalSettingsLocale,
    {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      timeZone: viewTimezone,
    },
  );
  const durationMapperOptions: DurationMapperOptions = {
    hourUnit: 'duration.units.hours',
    hourAriaUnit: 'duration.units.aria-hours',
    minuteUnit: 'duration.units.minutes',
    minuteAriaUnit: 'duration.units.aria-minutes',
  };
  const durationMapper = new DurationMapper(
    businessInfo.dateRegionalSettingsLocale!,
    durationMapperOptions,
    t,
  );

  let firstSessionDate, lastSessionDate;
  if (isCourse && firstSessionStart && lastSessionEnd) {
    const sessionRangeFormat = new Intl.DateTimeFormat(
      businessInfo.dateRegionalSettingsLocale,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: viewTimezone,
      },
    );
    firstSessionDate = sessionRangeFormat.format(new Date(firstSessionStart));
    lastSessionDate = sessionRangeFormat.format(new Date(lastSessionEnd));
  }

  const formattedSessions = catalogSessionsDto.map((sessionDto) => {
    const sessionStartDate = new Date(sessionDto.startDate);
    const dateParts = dateTimeFormatter.formatToParts(sessionStartDate);
    const date = dateFormatter.format(sessionStartDate);
    const year = dateParts.find(({ type }) => type === 'year')?.value;
    const hour = dateParts.find(({ type }) => type === 'hour')?.value;
    const minute = dateParts.find(({ type }) => type === 'minute')?.value;
    const dayPeriod = dateParts.find(
      ({ type }) => type.toLocaleLowerCase() === 'dayperiod',
    )?.value;
    const startTime = `${hour}:${minute} ${dayPeriod ?? ''}`.trim();

    return {
      date,
      year,
      staffName: sessionDto.staffName,
      startTime,
      durationText: durationMapper.durationTextFromMinutes(
        sessionDto.durationInMinutes,
      ),
      durationAriaLabel: durationMapper.durationAriaLabelFromMinutes(
        sessionDto.durationInMinutes,
      ),
      locationName: sessionDto.locationName,
    };
  });

  return {
    schedulingDaysViewModel: formatDays(formattedSessions),
    status: SchedulingSectionStatus.SUCCESS,
    firstSessionDate,
    lastSessionDate,
    isBookable,
  };
};

const formatDays = (formattedSessions): SchedulingDayViewModel[] => {
  const mappedDays = {};
  formattedSessions.forEach((session) => {
    const dayKey = `${session.date}-${session.year}`;
    mappedDays[dayKey] = mappedDays[dayKey] || initDay(session);
    mappedDays[dayKey].dailySessions.push({
      startTime: session.startTime,
      staffName: session.staffName,
      durationText: session.durationText,
      durationAriaLabel: session.durationAriaLabel,
      locationName: session.locationName,
    });
  });

  return Object.values(mappedDays);
};

const initDay = (session): SchedulingDayViewModel => {
  return {
    date: session.date,
    dailySessions: [],
  };
};

export const dummySchedulingViewModel = ({
  t,
  scheduleDays,
  businessInfo,
}: {
  t;
  scheduleDays: number;
  businessInfo: BusinessInfo;
}): SchedulingSectionViewModel => {
  const now = new Date(new Date().setUTCHours(10, 0, 0, 0));
  const staffName = t('dummy-data.staff-name');
  const locationName = t('dummy-data.location-name');
  const durationInMinutes = 45;
  let catalogSessionsDto: CatalogSessionDto[] = [];
  const placeholderSession: CatalogSessionDto = {
    startDate: now.toISOString(),
    endDate: now.toISOString(),
    staffName,
    durationInMinutes,
    locationName,
  };
  for (let i = 0; i < scheduleDays; i++) {
    catalogSessionsDto.push(placeholderSession);
  }

  catalogSessionsDto = catalogSessionsDto.map((value, index) => {
    return {
      ...value,
      startDate: getDayFromDateAsISO(now, index),
    };
  });
  return schedulingSectionViewModelFactory({
    catalogSessionsDto,
    businessInfo,
    t,
    isBookable: true,
  });
};
