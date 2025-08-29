"use client";
import PropertyForm from "@/components/property/form/PropertyForm";
import { PropertyWithFavorites } from "@/data-access-layer/properties/property-types";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

interface EditPropertyProps {
  id: string;
  user: UsersResponse;
  agent: AgentsResponse;
  property: PropertyWithFavorites;
}

export function EditProperty({ id, user, agent, property }: EditPropertyProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <PropertyForm
        user={user}
        agent={agent}
        initialData={{
          ...property,
          images: (property.images as string[]) || [],
        }}
        propertyId={id}
        isEdit
      />
    </div>
  );
}
