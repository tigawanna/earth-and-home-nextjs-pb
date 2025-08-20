import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";

interface PropertiesEmptyProps {}

export function PropertiesEmpty({}: PropertiesEmptyProps) {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <Card className="p-8 text-center w-full">
        <div className="space-y-4">
          <Home className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">No properties found</h3>
            <p className="text-muted-foreground">
              No properties match your current filters. Try broadening your search
              or clear filters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/properties">
              <Button variant="default">Browse properties</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
