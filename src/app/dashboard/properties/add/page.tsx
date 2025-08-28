import PropertyForm from "@/components/property/form/PropertyForm";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";

export default async function NewPropertyPage() {
  const user = await getServerSideUser();
  if (!user) {
    return redirect("/auth/signin");
  }
 return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} user={user} />
    </div>
  );
}
