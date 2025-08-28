import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function NewAgentPage() {
  const user = await getServerSideUser();
  if (!user) {
    return redirect("/auth/signin");
  }
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      New Agent Page
    </section>
  );
}
