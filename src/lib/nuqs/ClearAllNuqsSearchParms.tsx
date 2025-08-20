"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useCallback } from "react";

interface ClearAllNuqsSearchParmsProps {
  // list of query param keys to clear (set to empty string)
  keys?: string[];
  // the page key to reset (set to 1)
  resetPageKey?: string;
  // show label next to icon
  showLabel?: boolean;
  // button variant
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
  onCleared?: () => void;
}

export function ClearAllNuqsSearchParms({
  keys = ["q"],
  resetPageKey = "page",
  showLabel = true,
  variant = "outline",
  className = "",
  onCleared,
}: ClearAllNuqsSearchParmsProps) {
  // build mapping for nuqs so hook types are satisfied
  const mapping: Record<string, any> = {};
  for (const k of keys) {
    if (k === resetPageKey) continue;
    mapping[k] = parseAsString.withDefault("");
  }
  if (resetPageKey) mapping[resetPageKey] = parseAsInteger.withDefault(1);

  const [,setQueryStates] = useQueryStates(mapping);

  const handleClear = useCallback(() => {
    const update: Record<string, any> = {};

    // clear provided keys
    for (const k of keys) {
      update[k] = "";
    }

    // reset page
    if (resetPageKey) update[resetPageKey] = 1;

    setQueryStates(update as any);
    onCleared?.();
  }, [keys, resetPageKey, setQueryStates, onCleared]);

  return (
    <Button
      variant={variant as any}
      size="sm"
      onClick={handleClear}
      className={className}
      aria-label="Clear filters"
    >
      <X className="w-4 h-4 mr-2" />
      {showLabel ? "Clear" : null}
    </Button>
  );
}
