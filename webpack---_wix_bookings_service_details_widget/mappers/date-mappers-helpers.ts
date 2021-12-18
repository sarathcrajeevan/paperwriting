export const getDayFromDateAsISO = (date: Date, day: number) => {
  const newDate = new Date(date.toISOString());
  newDate.setDate(date.getDate() + day);

  return new Date(newDate).toISOString();
};

export const getTomorrowDateAsUTC = (): string => {
  const now = new Date();
  now.setDate(now.getDate() + 1);

  return new Date(now).toUTCString();
};

export const getYesterdayDateAsUTC = (): string => {
  const now = new Date();
  now.setDate(now.getDate() - 1);

  return new Date(now).toUTCString();
};

export const getNextYearDateAsUTC = (): string => {
  const now = new Date();
  now.setUTCFullYear(now.getUTCFullYear() + 1);

  return new Date(now).toUTCString();
};

export const getPrevYearDateAsUTC = (): string => {
  const now = new Date();
  now.setUTCFullYear(now.getUTCFullYear() - 1);

  return new Date(now).toUTCString();
};
