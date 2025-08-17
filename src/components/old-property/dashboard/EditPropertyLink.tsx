"use client";
import { Button } from "@/components/ui/button";
import { viewerQueryOptions } from "@/DAL/pocketbase/auth";
import { useQuery } from "@tanstack/react-query";

import { ChevronRight, Loader, Pen } from "lucide-react";
import Link from "next/link";

interface EditPropertyLinkProps {
  id: string;
}

export function EditPropertyLink({ id }: EditPropertyLinkProps) {
  const { data, isPending } = useQuery(viewerQueryOptions())
  const user = data?.record
  if (isPending) {
    return (
      <Button variant={"outline"} disabled className="" size={"sm"}>
        <Link href={`/properties/${id}`} className="">
          <Loader className="animate-spin mr-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }
  if (user?.is_admin) {
    return (
      <Button variant={"outline"} className="" size={"sm"}>
        <Link href={`/properties/${id}`} className="">
          <ChevronRight className="mr-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={"outline"} className="" size={"sm"}>
      <Link href={`/dashboard/properties/${id}/edit`} className="">
        <Pen className="mr-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
