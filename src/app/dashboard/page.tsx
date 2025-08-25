import { AdminDashboardPage } from "@/components/dashboard/admin-dashboard-page/AdminDashboardPage";
import { DashboardWelcome } from "@/components/dashboard/cards/DashboardWelcome";
import { UserDashboardPage } from "@/components/dashboard/user-dashboard-page/UserDashboardPage";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getServerSideUser();
 
  return (
    <section className="w-full h-full p-6 space-y-6 @container">
      <DashboardWelcome user={user} />
      {user?.is_admin ? (
        <AdminDashboardPage />
      ) : (
        <UserDashboardPage />
      )}
    </section>
  );
}
