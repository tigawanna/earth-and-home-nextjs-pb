import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import Link from "next/link";
import { BasePropertyCard } from "./BasePropertyCard";
import { FavoriteProperty } from "../../form/FavoriteProperty";

type PropertiesResponseWithExpandedRelations = PropertiesResponse & {
  is_favorited?: boolean | null;
  favorite_timestamp?: string | null;
  expand?:
    | {
        owner_id?: UsersResponse[] | undefined;
        agent_id?: UsersResponse[] | undefined;
      }
    | undefined;
};

interface LinkedPropertyCardProps {
  property: PropertiesResponseWithExpandedRelations;
  href?: string;
  className?: string;
  showFooterActions?: boolean;
  footerActions?: React.ReactNode;
  currentUserId?: string
  basePath?: "/" | "/dashboard/"
}

/**
 * Server-side property card component that wraps BasePropertyCard with a Link
 * Use this in server components for property listings
 */
export function LinkedPropertyCard({
  property,
  href,
  className,
  showFooterActions = false,
  footerActions,
  currentUserId,
  basePath,
}: LinkedPropertyCardProps) {
  // Default href patterns
  const defaultHref = href || `${basePath || "/"}properties/${property.id}`;

  return (
    <div>
      <Link href={defaultHref} className="block">
        <BasePropertyCard
          property={property}
          className={`transition-transform  cursor-pointer ${className}`}
          showFooterActions={showFooterActions}
          footerActions={footerActions}
        />
      </Link>
      <FavoriteProperty
        propertyId={property.id}
        userId={currentUserId}
        is_favorited={property.is_favorited}
      />
    </div>
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
}: Omit<LinkedPropertyCardProps, "href">) {
  return (
    <LinkedPropertyCard
      property={property}
      href={`/dashboard/properties/${property.id}`}
      className={className}
      showFooterActions={showFooterActions}
      footerActions={footerActions}
    />
  );
}
