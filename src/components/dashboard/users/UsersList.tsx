import { TablePending } from "@/components/shared/TablePending";
import { getServerSideUsers } from "@/data-access-layer/admin/user-management";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";
import { Suspense } from "react";
import { UsersHeader } from "./UsersHeader";
import { UsersTable } from "./UsersTable";

interface UsersListProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
    q?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export async function UsersList({ searchParams }: UsersListProps) {
  const currentUser = await getServerSideUser();
  
  // Ensure only admins can access
  if (!currentUser?.is_admin) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Access Denied</h3>
          <p className="text-muted-foreground">
            You need admin privileges to view user management.
          </p>
        </div>
      </div>
    );
  }

  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const page = typeof searchParams?.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const sortBy = typeof searchParams?.sortBy === "string" ? searchParams.sortBy : "created";
  const sortOrder = (searchParams?.sortOrder === "asc" || searchParams?.sortOrder === "desc") 
    ? searchParams.sortOrder : "desc";

  const usersResult = await getServerSideUsers({
    q,
    page,
    limit: 20,
    sortBy,
    sortOrder,
  });

  if (!usersResult.success || !usersResult.result) {
    return (
      <div className="space-y-6">
        <UsersHeader 
          totalUsers={0}
          verifiedUsers={0}
          adminUsers={0}
          bannedUsers={0}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {"Failed to load users"}
          </p>
        </div>
      </div>
    );
  }

  const users = usersResult.result.items;
  
  // Calculate stats from current data (for display)
  const totalUsers = usersResult.result.totalItems;
  const verifiedUsers = users.filter(u => u.verified).length;
  const adminUsers = users.filter(u => u.is_admin).length;
  const bannedUsers = users.filter(u => u.is_banned).length;

  return (
    <div className="space-y-6">
      <UsersHeader 
        totalUsers={totalUsers}
        verifiedUsers={verifiedUsers}
        adminUsers={adminUsers}
        bannedUsers={bannedUsers}
      />
      
      <Suspense fallback={<TablePending />}>
        <UsersTable 
          users={users}
          currentUserId={currentUser.id}
        />
      </Suspense>

      {/* Pagination could be added here */}
      {usersResult.result.totalPages > 1 && (
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-muted-foreground">
            Page {usersResult.result.page} of {usersResult.result.totalPages} 
            ({usersResult.result.totalItems} total users)
          </p>
        </div>
      )}
    </div>
  );
}
