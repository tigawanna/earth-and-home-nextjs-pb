import {
  PropertyWithFavorites,
  PropertyFilters,
  PropertySortBy,
  SortOrder,
} from "@/data-access-layer/properties/property-types";
import { getProperties } from "@/data-access-layer/properties/server-side-property-queries";
import type { AgentsResponse, UsersResponse } from "@/types/domain-types";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";
import { PropertiesEmpty } from "../query-states/PropertiesEmpty";
import { LinkedPropertyCard } from "./cards/LinkedPropertyCard";

interface DashboardPropertiesListProps {
  user: UsersResponse | null;
  agent: Pick<AgentsResponse, "id"> | null;
  listFilterAgentId?: string;
  limit?: number;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export async function DashboardPropertiesList({
  user,
  agent,
  listFilterAgentId,
  limit,
  searchParams,
}: DashboardPropertiesListProps) {
  const canSeeStatusFilter = Boolean(user?.is_admin || user?.is_agent);
  const scope = (searchParams?.scope as string) || "all";
  const mineScope =
    !listFilterAgentId && canSeeStatusFilter && scope === "mine" ? true : false;

  let listAgentId: string | undefined;
  let ownerIdFilter: string | undefined;
  if (listFilterAgentId) {
    listAgentId = listFilterAgentId;
  } else if (mineScope) {
    if (agent?.id) {
      listAgentId = agent.id;
    } else if (user?.is_admin) {
      ownerIdFilter = user.id;
    }
  }

  const filters: PropertyFilters = {
    search: (searchParams?.search as string) || "",
    propertyType: searchParams?.propertyType as string,
    listingType: searchParams?.listingType as "sale" | "rent",
    status: canSeeStatusFilter
      ? (searchParams?.status as string) || undefined
      : "active",
    minPrice: searchParams?.minPrice ? Number(searchParams?.minPrice) : undefined,
    maxPrice: searchParams?.maxPrice ? Number(searchParams?.maxPrice) : undefined,
    beds: searchParams?.beds ? Number(searchParams?.beds) : undefined,
    baths: searchParams?.baths ? Number(searchParams?.baths) : undefined,
    city: searchParams?.city as string,
    isFeatured: searchParams?.featured === "true" ? true : undefined,
    ownerId: ownerIdFilter,
  };

  const sortBy = (searchParams?.sortBy as PropertySortBy) || "created";
  const sortOrder = (searchParams?.sortOrder as SortOrder) || "desc";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  const result = await getProperties({
    filters,
    sortBy,
    sortOrder,
    page,
    limit: limit || 50,
    agentId: listAgentId,
  });

  const properties = result.success ? result.properties : [];
  const totalPages = result.success ? result.pagination.totalPages : 0;

  // Render empty state if no properties
  if (properties.length === 0) {
    return <PropertiesEmpty />;
  }
  return (
    <div className="w-full h-full flex  flex-col items-center ">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
        {properties.map((property) => (
          <LinkedPropertyCard
            basePath="/dashboard/"
            key={property.id}
            property={property as PropertyWithFavorites}
            currentUser={user}
            currentAgentId={agent?.id}
          />
        ))}
      </div>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
