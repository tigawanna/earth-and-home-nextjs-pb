"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/client-side-auth";
import { ChevronRight, Loader, Pen } from "lucide-react";
import Link from "next/link";

interface EditPropertyLinkProps {
  id: string;
}

export function EditPropertyLink({ id }: EditPropertyLinkProps) {
  const { data, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <Button variant={"outline"} disabled className="" size={"sm"}>
        <Link href={`/properties/${id}`} className="">
          <Loader className="animate-spin mr-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }
  if (data?.user?.role !== "admin") {
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
