export type TranslationMap<T> = {
  [key in Exclude<keyof T, number>]: string;
};
