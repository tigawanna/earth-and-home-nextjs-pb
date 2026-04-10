import { PropertyWithFavorites } from "@/data-access-layer/properties/property-types";
import { canManageProperty } from "@/lib/property/can-manage-property";
import { Bath, Bed, Square } from "lucide-react";
import { FavoriteProperty } from "../../form/FavoriteProperty";
import { BasePropertyCard } from "./BasePropertyCard";
import { PropertyAdminActions } from "./PropertyAdminActions";
import { PropertyQuickStatusSelect } from "./PropertyQuickStatusSelect";
import { UsersResponse } from "@/types/domain-types";

interface LinkedPropertyCardProps {
  property: PropertyWithFavorites;
  href?: string;
  className?: string;
  showFooterActions?: boolean;
  footerActions?: React.ReactNode;
  currentUser?: UsersResponse | null;
  currentAgentId?: string | null;
  basePath?: "/" | "/dashboard/";
}

/**
 * Server-side property card component that uses BasePropertyCard with built-in Link
 * Use this in server components for property listings
 */
export function LinkedPropertyCard({
  property,
  href,
  className,
  showFooterActions = true, // Enable footer by default for stats and interactions
  footerActions,
  currentUser,
  currentAgentId,
  basePath,
}: LinkedPropertyCardProps) {
  const defaultHref = href || `${basePath || "/"}properties/${property.id}`;

  const showPropertyControls =
    currentUser &&
    canManageProperty(
      currentUser,
      currentAgentId ? { id: currentAgentId } : null,
      property,
    );

  const defaultFooterActions = footerActions || (
    <div className="flex w-full flex-col gap-2">
      {showPropertyControls ? <PropertyQuickStatusSelect property={property} /> : null}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.beds && property.beds > 0 ? (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.beds}</span>
            </div>
          ) : null}
          {property.baths && property.baths > 0 ? (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.baths}</span>
            </div>
          ) : null}
          {property.building_size_sqft ? (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.building_size_sqft.toLocaleString()} sqft</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {showPropertyControls ? <PropertyAdminActions property={property} /> : null}
          <FavoriteProperty userId={currentUser?.id} property={property} />
        </div>
      </div>
    </div>
  );

  return (
    <BasePropertyCard
      property={property}
      className={`transition-transform cursor-pointer ${className}`}
      showFooterActions={showFooterActions}
      footerActions={defaultFooterActions}
      href={defaultHref}
      wrapWithLink={true}
    />
  );
}

/**
 * Server-side dashboard property card with dashboard-specific link
 */
export function DashboardLinkedPropertyCard({
  property,
  className,
  showFooterActions = true,
  footerActions,
  currentUser,
  currentAgentId,
}: Omit<LinkedPropertyCardProps, "href" | "basePath">) {
  return (
    <LinkedPropertyCard
      property={property}
      href={`/dashboard/properties/${property.id}`}
      className={className}
      showFooterActions={showFooterActions}
      footerActions={footerActions}
      currentUser={currentUser}
      currentAgentId={currentAgentId}
    />
  );
}
