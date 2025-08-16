import PropertyForm from "@/components/property/form/PropertyForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} />
    </div>
  );
}
