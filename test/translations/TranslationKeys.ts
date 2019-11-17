import { TranslationMap } from "../../src/TranslationMap";
import { stringifyKeys } from "../../src/stringifyKeys";

enum TranslationTokens {
  a,
  b,
  c
}

export type TestTranslationMap = TranslationMap<typeof TranslationTokens>;

export const TranslationKeys = stringifyKeys<typeof TranslationTokens>(
  TranslationTokens
);
