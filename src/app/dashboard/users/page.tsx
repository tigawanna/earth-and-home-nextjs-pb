import { UsersList } from "@/components/dashboard/users/UsersList";
import { TablePending } from "@/components/shared/TablePending";
import { Suspense } from "react";

interface UsersPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
    q?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <section className="w-full h-full p-6">
      <Suspense fallback={<TablePending />}>
        <UsersList searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
