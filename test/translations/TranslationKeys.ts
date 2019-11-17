import { stringifyKeys } from '../../src/stringifyKeys';
import { TranslationMap } from '../../src/TranslationMap';

enum TranslationTokens {
  a,
  b,
  c,
}

export type TestTranslationMap = TranslationMap<typeof TranslationTokens>;

export const TranslationKeys = stringifyKeys<typeof TranslationTokens>(TranslationTokens);
