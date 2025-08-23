import { PropertyDashboard } from "@/components/property/dashboard/PropertyDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/properties")({
  component: PropertiesPage,
});

function PropertiesPage() {
  return <PropertyDashboard />;
}
