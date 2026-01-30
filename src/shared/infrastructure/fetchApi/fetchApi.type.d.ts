import { HEADERS, METHODS, MIME_TYPES } from './constant';

type JsonValue = JsonObject | JsonArray | string | number | boolean | null;
type JsonArray = Array<JsonValue>;
type JsonObject = {
  [key: string]: JsonValue;
};
export type Json = JsonObject | JsonArray;

export type Methods = (typeof METHODS)[keyof typeof METHODS];
export type Headers = (typeof HEADERS)[keyof typeof HEADERS];
export type MimeTypes = (typeof MIME_TYPES)[keyof typeof MIME_TYPES];
