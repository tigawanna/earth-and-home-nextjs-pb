import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function SingleAgentPage() {
  const { user, agent } = await getServerSideUserwithAgent();
  if (!user) {
    return redirect("/auth/signin");
  }
  if (!agent) {
    return redirect("/dashboard/agent");
  }
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      Single Agent Page
    </section>
  );
}
