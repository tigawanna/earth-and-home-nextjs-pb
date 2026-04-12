"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updatePropertyMutationOptions } from "@/data-access-layer/properties/property-mutations";
import type { PropertiesResponse, PropertiesUpdate } from "@/types/domain-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Edit, Eye, EyeOff, MoreVertical, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PropertyAdminActionsProps {
  property: PropertiesResponse;
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "sold":
      return "destructive";
    case "rented":
      return "outline";
    case "draft":
      return "secondary";
    case "off_market":
      return "outline";
    default:
      return "secondary";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <Eye className="w-3 h-3" />;
    case "pending":
      return <Sparkles className="w-3 h-3" />;
    case "sold":
    case "rented":
      return <Star className="w-3 h-3" />;
    case "draft":
      return <Edit className="w-3 h-3" />;
    case "off_market":
      return <EyeOff className="w-3 h-3" />;
    default:
      return null;
  }
}

export function PropertyAdminActions({ property }: PropertyAdminActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updatePropertyMutation = useMutation({
    ...updatePropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        router.refresh();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update property");
    },
  });

  const applyUpdate = async (updates: Partial<PropertiesUpdate>) => {
    await updatePropertyMutation.mutateAsync({
      id: property.id,
      ...updates,
    });
  };

  const handleStatusChange = async (status: string) => {
    await applyUpdate({ status: status as PropertiesResponse["status"] });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 border-border/50 hover:bg-primary/5 hover:border-primary/30"
          aria-label={`Property options for ${property.title || "property"}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(100vw-2rem,20rem)] max-h-[min(80vh,28rem)] overflow-y-auto p-1"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Manage listing
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/properties/${property.id}/edit`} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit property
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void navigator.clipboard.writeText(property.id);
            toast.success("Property ID copied");
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            {getStatusIcon(property.status)}
            <span className="capitalize">{property.status.replace("_", " ")}</span>
            <Badge variant={getStatusBadgeVariant(property.status)} className="ml-auto text-[10px]">
              {property.status}
            </Badge>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
            {["draft", "active", "pending", "sold", "rented", "off_market"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </span>
                {property.status === status ? (
                  <Badge variant="secondary" className="text-[10px]">
                    Current
                  </Badge>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <div className="grid grid-cols-2 gap-1 px-0.5 pb-1">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs capitalize h-auto py-2">
              {property.property_type.replace("_", " ")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-48 overflow-y-auto">
              {[
                "house",
                "apartment",
                "condo",
                "townhouse",
                "duplex",
                "studio",
                "villa",
                "land",
                "commercial",
                "industrial",
                "farm",
              ].map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() =>
                    applyUpdate({ property_type: type as PropertiesResponse["property_type"] })
                  }
                  className="justify-between text-xs capitalize"
                >
                  {type.replace("_", " ")}
                  {property.property_type === type ? (
                    <Badge variant="secondary" className="text-[10px]">
                      ✓
                    </Badge>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs capitalize h-auto py-2">
              {property.listing_type}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {(["sale", "rent"] as const).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => applyUpdate({ listing_type: type })}
                  className="justify-between text-xs capitalize"
                >
                  {type}
                  {property.listing_type === type ? (
                    <Badge variant="secondary" className="text-[10px]">
                      ✓
                    </Badge>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </div>

        {updatePropertyMutation.isPending ? (
          <p className="text-center text-xs text-primary py-1">Updating…</p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
