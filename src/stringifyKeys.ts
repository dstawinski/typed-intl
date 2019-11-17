export const stringifyKeys = <T extends object>(keys: T): Record<Exclude<keyof T, number>, string> => {
  const map = Object.create(keys);
  for (const key in keys) {
    if (typeof key === 'string') {
      map[key] = key;
    }
  }
  return map;
};
