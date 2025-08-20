import { useSearchParams } from "next/navigation";

export function useQueryPage() {
  const sp = useSearchParams();

  const pageValue = sp.get("page");
  const page = pageValue ? parseInt(pageValue, 10) : 1;

  return page;
}
