import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import Link from "next/link";
import { BasePropertyCard } from "./BasePropertyCard";

type PropertiesResponseWithExpandedRelations = PropertiesResponse & {
  expand?: {
    owner_id?: UsersResponse[] | undefined;
    agent_id?: UsersResponse[] | undefined;
  } | undefined;
};

interface LinkedPropertyCardProps {
  property: PropertiesResponseWithExpandedRelations;
  href?: string;
  className?: string;
  showFooterActions?: boolean;
  footerActions?: React.ReactNode;
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
}: LinkedPropertyCardProps) {
  // Default href patterns
  const defaultHref = href || `/properties/${property.id}`;

  return (
    <Link href={defaultHref} className="block">
      <BasePropertyCard
        property={property}
        className={`transition-transform hover:scale-105 cursor-pointer ${className}`}
        showFooterActions={showFooterActions}
        footerActions={footerActions}
      />
    </Link>
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
}: Omit<LinkedPropertyCardProps, 'href'>) {
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
