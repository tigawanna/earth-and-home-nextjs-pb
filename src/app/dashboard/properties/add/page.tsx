import PropertyForm from "@/components/property/form/PropertyForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
 return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} />
    </div>
  );
}
