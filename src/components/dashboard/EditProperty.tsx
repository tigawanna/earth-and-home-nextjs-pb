"use client";
import PropertyForm from "@/components/property/form/PropertyForm";
import { browserPB } from "@/lib/pocketbase/browser-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SinglePropertyNotFound } from "../property/single/single-property-query-states";

interface EditPropertyProps {
  id: string;
}

export function EditProperty({ id }: EditPropertyProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["properties", id],
    queryFn: async () => {
      try {
        const property = await browserPB.from("properties").getOne(id);
        return {
          property,
          success: true,
          message: "Successfully fetched",
        };
      } catch (error: unknown) {
        return {
          property: null,
          success: false,
          message: error instanceof Error ? error.message : String(error),
        };
      }
    },
  });

  const result = data

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <PropertyForm
        initialData={{
          ...property,
          images: property.images as string[] || [],
        }}
        propertyId={id}
        isEdit
      />
    </div>
  );
}
