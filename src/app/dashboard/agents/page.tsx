import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function AgentsPage() {
    const user = await getServerSideUser();
    if (!user) {
      return redirect("/auth/signin");
    }
    if (!user.is_admin) {
      return redirect("/dashboard");
    }
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      Agents Page
    </section>
  );
}
