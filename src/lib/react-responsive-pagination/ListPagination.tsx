"use client";
import { Loader } from "lucide-react";
import { parseAsIndex, useQueryState } from "nuqs";
import { useTransition } from "react";
import ResponsivePagination from "react-responsive-pagination";

interface ListingsPaginationProps {
  totalPages: number;
}

export function ListPagination({ totalPages }: ListingsPaginationProps) {
  // parseAsIndex encodes page as 0-based in the querystring, but
  // react-responsive-pagination expects 1-based `current` and emits 1-based values.
  // We use withOptions({ shallow: true }) so changes update the URL shallowly.
  const [ispending, startTransition] = useTransition();
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsIndex.withDefault(0).withOptions({ startTransition,shallow: false })
  );

  const current = (pageIndex ?? 0) + 1;


  return (
    <div className="flex w-full items-center justify-center">
      <ResponsivePagination
        current={current}
        total={totalPages}
        onPageChange={(newPage) => {
          // map 1-based page to 0-based index for the query param
          setPageIndex(newPage - 1);
        }}
      />
      {ispending && (
        <Loader className="ml-2 animate-spin h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}
