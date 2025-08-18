import { DashboardLinkedPropertyCard, LinkedPropertyCard } from "@/components/property/list";
import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

// Example property data type with expanded relations
type PropertyWithRelations = PropertiesResponse & {
  expand?: {
    owner_id?: UsersResponse[] | undefined;
    agent_id?: UsersResponse[] | undefined;
  } | undefined;
};

interface PublicPropertyListingProps {
  properties: PropertyWithRelations[];
}

/**
 * Server Component Example: Public property listings page
 * Uses LinkedPropertyCard for automatic navigation to /properties/:id
 */
export function PublicPropertyListing({ properties }: PublicPropertyListingProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <LinkedPropertyCard
              key={property.id}
              property={property}
              className="hover:shadow-xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Server Component Example: Agent's property listings
 * Uses DashboardLinkedPropertyCard for navigation to dashboard routes
 */
export function AgentPropertyListing({ properties }: PublicPropertyListingProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Properties</h2>
          <div className="text-sm text-muted-foreground">
            {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <DashboardLinkedPropertyCard
              key={property.id}
              property={property}
              showFooterActions={true}
              footerActions={
                <div className="text-xs text-muted-foreground">
                  Status: {property.status}
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Server Component Example: Property search results
 * Shows how to customize the LinkedPropertyCard with different href patterns
 */
export function PropertySearchResults({ 
  properties, 
  searchQuery 
}: PublicPropertyListingProps & { searchQuery: string }) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-muted-foreground">
            {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found for "{searchQuery}"
          </p>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No properties found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <LinkedPropertyCard
                key={property.id}
                property={property}
                // Custom href with search context
                href={`/properties/${property.id}?from=search&q=${encodeURIComponent(searchQuery)}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Server Component Example: Related properties section
 * Shows minimal cards without footer actions
 */
export function RelatedProperties({ 
  properties, 
  currentPropertyId 
}: PublicPropertyListingProps & { currentPropertyId: string }) {
  const relatedProperties = properties.filter(p => p.id !== currentPropertyId);
  
  if (relatedProperties.length === 0) return null;

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold mb-6">You might also like</h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {relatedProperties.slice(0, 6).map((property) => (
            <div key={property.id} className="flex-shrink-0 w-72">
              <LinkedPropertyCard
                property={property}
                showFooterActions={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
