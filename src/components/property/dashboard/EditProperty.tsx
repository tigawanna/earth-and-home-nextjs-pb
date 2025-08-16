import { getProperty } from "@/DAL/drizzle/property-queries";
import { SinglePropertyNotFound } from "../query-states";
import PropertyForm from "@/components/property/form/PropertyForm";

interface EditPropertyProps {
  id: string;
}

export async function EditProperty({ id }: EditPropertyProps) {
  const result = await getProperty(id);

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <PropertyForm
        initialData={{
          ...property,
          // availableFrom: property.availableFrom || undefined,
          // annualTaxes: property.annualTaxes || undefined,
          // hoaFee: property.hoaFee || undefined,
          // securityDeposit: property.securityDeposit || undefined,
          // rentalPrice: property.rentalPrice || undefined,
          // salePrice: property.salePrice || undefined,
          // price: property.price || undefined,
          // cooling: property.cooling || undefined,
          // heating: property.heating || undefined,
          // parkingType: property.parkingType || undefined,
          // parkingSpaces: property.parkingSpaces || undefined,
          // zoning: property.zoning || undefined,
          // dimensions: property.dimensions || undefined,
          // lotSizeSqft: property.lotSizeSqft || undefined,
          // yearBuilt: property.yearBuilt || undefined,
          // baths: property.baths || undefined,
          // beds: property.beds || undefined,
          // floors: property.floors || undefined,
          // buildingSizeSqft: property.buildingSizeSqft || undefined,
          // latitude: property.latitude || undefined,
          // longitude: property.longitude || undefined,
          // postalCode: property.postalCode || undefined,
          // state: property.state || undefined,
          // city: property.city || undefined,
          // streetAddress: property.streetAddress || undefined,
          // description: property.description || undefined,
          // country: property.country || undefined,
          // currency: property.currency || undefined,
          lotSizeAcres: (property.lotSizeAcres  as any as number) || undefined,
          utilities: (property.utilities as Record<string, boolean>) || undefined,
          features: (property.features as string[]) || undefined,
          images: ((property.images as string[]) || []) as any,
          amenities: ((property.amenities as string[]) || undefined) as any,
        }}
        propertyId={id}
        isEdit
      />
    </div>
  );
}
