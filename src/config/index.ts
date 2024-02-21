/* eslint-disable import/no-mutable-exports */
const isDevelopment = process.env.NODE_ENV === "development";

export const LOCALE_COOKIE_NAME = "locale";
export const IS_CE_EDITION = "SELF_HOSTED";

export let apiPrefix = "";

if (process.env.NEXT_PUBLIC_API_PREFIX) {
  apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX;
} else if (isDevelopment) {
  apiPrefix = "http://localhost:9010/api/v1lahpa1/";
} else {
  apiPrefix = "http://localhost:9010/api/v1/";
}

export const API_PREFIX: string = apiPrefix;
export const PUBLIC_API_PREFIX: string = apiPrefix;
