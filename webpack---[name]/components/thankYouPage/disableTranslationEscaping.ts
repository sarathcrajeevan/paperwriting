export function disableTranslationEscaping(data: any) {
  return {...data, interpolation: {escapeValue: false}};
}
