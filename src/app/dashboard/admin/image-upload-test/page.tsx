import { ImageUploadTestForm } from "@/components/dashboard/admin/ImageUploadTestForm";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ImageUploadTestPage() {
  const cookieStore = await cookies();
  const user = await getServerSideUser(cookieStore);
  if (!user) {
    redirect("/auth/signin");
  }
  if (!user.is_admin) {
    redirect("/dashboard");
  }

  return (
    <section className="w-full max-w-3xl">
      <ImageUploadTestForm />
    </section>
  );
}
