import PropertyForm from "@/components/property/form/PropertyForm";

export default async function NewPropertyPage() {
 return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} />
    </div>
  );
}
