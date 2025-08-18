"use client";
import { parseAsIndex, useQueryState } from "nuqs";
import ResponsivePagination from "react-responsive-pagination";

interface ListingsPaginationProps {
  total_pages: number;
}

export function ListPagination({ total_pages }: ListingsPaginationProps) {
  // parseAsIndex encodes page as 0-based in the querystring, but
  // react-responsive-pagination expects 1-based `current` and emits 1-based values.
  // We use withOptions({ shallow: true }) so changes update the URL shallowly.
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsIndex.withDefault(0).withOptions({ shallow: true })
  );

  const current = (pageIndex ?? 0) + 1;

  return (
    <div className="flex w-full items-center justify-center">
      <ResponsivePagination
        current={current}
        total={total_pages}
        onPageChange={(newPage) => {
          // map 1-based page to 0-based index for the query param
          setPageIndex(newPage - 1);
        }}
      />
    </div>
  );
}
