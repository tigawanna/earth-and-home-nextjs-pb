import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useQueryPage() {
  const sp = useSearchParams();

  const pageValue = sp.get("page");
  const page = pageValue ? parseInt(pageValue, 10) : 1;

  return page;
}
export function useQuerySearch() {
  const sp = useSearchParams();

  const rawValue = sp.get("q");
  const value = rawValue || "";

  return value;
}

export function useSttringQueryParams() {
  const sp = useSearchParams();

  const rawValue = sp.get("q");
  const value = rawValue || "";

  return value;
}

// New simple hook: useTypedQueryParams
// Accepts a schema object like: { q: 'string', page: 'number' }
// Returns an object with parsed values (number for 'number', string for 'string'), or undefined when missing/invalid.
export function useTypedQueryParams<Schema extends Record<string, 'string' | 'number'>>(schema: Schema) {
  const sp = useSearchParams();

  const parsed = useMemo(() => {
    const out: Partial<Record<keyof Schema, string | number | undefined>> = {};

    for (const key of Object.keys(schema) as Array<keyof Schema>) {
      const t = schema[key as string];
      const raw = sp.get(key as string);

      if (t === 'number') {
        if (raw == null || raw === '') {
          out[key] = undefined;
        } else {
          const n = parseInt(raw, 10);
          out[key] = Number.isNaN(n) ? undefined : n;
        }
      } else {
        // string
        out[key] = raw != null ? raw : undefined;
      }
    }

    return out as { [K in keyof Schema]?: Schema[K] extends 'number' ? number : string };
    // Re-run when search params string changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString(), JSON.stringify(schema)]);

  return parsed;
}
