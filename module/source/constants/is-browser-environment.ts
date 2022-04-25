/**
 * Defines if the current environment is a browser environment. This is
 * determined by checking if the `window` and `document` objects are defined.
 */
const isBrowserEnvironment =
  typeof window !== "undefined" && typeof document !== "undefined";
