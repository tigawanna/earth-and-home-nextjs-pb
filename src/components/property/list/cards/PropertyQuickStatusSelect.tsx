"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePropertyMutationOptions } from "@/data-access-layer/properties/property-mutations";
import { cn } from "@/lib/utils";
import type { PropertiesResponse, PropertiesUpdate, PropertyStatus } from "@/types/domain-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, EyeOff, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUSES: PropertyStatus[] = [
  "draft",
  "active",
  "pending",
  "sold",
  "rented",
  "off_market",
];

function getStatusIcon(status: PropertyStatus) {
  switch (status) {
    case "active":
      return <Eye className="size-3.5 shrink-0" />;
    case "pending":
      return <Sparkles className="size-3.5 shrink-0" />;
    case "sold":
    case "rented":
      return <Star className="size-3.5 shrink-0" />;
    case "draft":
      return <Edit className="size-3.5 shrink-0" />;
    case "off_market":
      return <EyeOff className="size-3.5 shrink-0" />;
    default:
      return null;
  }
}

function formatStatusLabel(status: PropertyStatus) {
  return status.replace(/_/g, " ");
}

export function PropertyQuickStatusSelect({
  property,
  className,
}: {
  property: Pick<PropertiesResponse, "id" | "status">;
  className?: string;
}) {
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

  const applyStatus = async (status: PropertyStatus) => {
    await updatePropertyMutation.mutateAsync({
      id: property.id,
      status,
    } satisfies PropertiesUpdate);
  };

  return (
    <div
      className={cn("w-full", className)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Select
        value={property.status}
        onValueChange={(v) => void applyStatus(v as PropertyStatus)}
        disabled={updatePropertyMutation.isPending}
      >
        <SelectTrigger
          size="sm"
          className="h-9 w-full border-border/60 bg-muted/40 font-normal shadow-none hover:bg-muted/60"
          aria-label="Listing status"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {getStatusIcon(property.status)}
            <SelectValue placeholder="Status" />
          </div>
        </SelectTrigger>
        <SelectContent position="popper" className="z-[200]">
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              <span className="flex items-center gap-2">
                {getStatusIcon(s)}
                <span className="capitalize">{formatStatusLabel(s)}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
