import { UseQueryStatesKeysMap, Values } from "nuqs";

type QueryParams = Values<UseQueryStatesKeysMap>;

export function getNuqsQueryParamKeys(queryParams: QueryParams): string[] {
  const keys = Object.keys(queryParams);
  // Filter out any keys that are not strings or are empty
  return keys.filter((key) => typeof key === "string" && key.trim() !== "");
}
