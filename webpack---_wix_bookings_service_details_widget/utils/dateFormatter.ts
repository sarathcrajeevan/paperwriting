export const fixFormattedDateToISOString = (formattedDate) =>
  formattedDate ? new Date(formattedDate).toISOString() : '';
