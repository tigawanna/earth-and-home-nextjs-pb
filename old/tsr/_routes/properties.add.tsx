import PropertyForm from "@/components/property/form/PropertyForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/properties/add")({
  component: NewPropertyPage,
});

function NewPropertyPage() {
  return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} />
    </div>
  );
}
