import { AdminDashboardPage } from "@/components/dashboard/admin-dashboard-page/AdminDashboardPage";
import { DashboardWelcome } from "@/components/dashboard/cards/DashboardWelcome";
import { UserDashboardPage } from "@/components/dashboard/user-dashboard-page/UserDashboardPage";
import { siteinfo } from "@/config/siteinfo";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: `Manage your ${siteinfo.title} account, view saved properties, track favorites, and access personalized real estate tools. Your central hub for property management and searches.`,
  keywords: ["dashboard", "account management", "saved properties", "favorites", "property management", siteinfo.title],
  robots: {
    index: false, // Don't index private dashboard pages
    follow: false,
  },
};

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
