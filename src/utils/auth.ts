export const normalizeUsername = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "_");
