/**
 * Merge API content with defaults so empty values don't overwrite defaults.
 * - undefined / null: keep default
 * - string: use API value only if non-empty (after trim)
 * - array: use API value only if it's an array with length > 0; otherwise keep default
 * - other: use API value if not undefined/null
 */
export function mergeWithDefaults(defaultObj, fromApi) {
  if (!defaultObj || typeof defaultObj !== "object") return fromApi ?? defaultObj;
  const from = fromApi && typeof fromApi === "object" ? fromApi : {};
  const out = { ...defaultObj };
  for (const key of Object.keys(defaultObj)) {
    const apiVal = from[key];
    if (apiVal === undefined || apiVal === null) continue;
    if (typeof apiVal === "string" && apiVal.trim() === "") continue;
    if (Array.isArray(defaultObj[key]) && (!Array.isArray(apiVal) || apiVal.length === 0)) continue;
    out[key] = apiVal;
  }
  return out;
}
