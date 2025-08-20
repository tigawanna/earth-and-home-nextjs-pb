import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ClearAllNuqsSearchParms } from "../../lib/nuqs/ClearAllNuqsSearchParms";

interface TableEmptyProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  querykeys?: string[];
}

export function TableEmpty({
  title = "Nothing here yet",
  description = "There are no items to show right now. Try adjusting filters or add new items.",
  primaryLabel = "Browse properties",
  primaryHref = "/properties",
  secondaryLabel = "Clear filters",
  icon,
  className = "",
  querykeys,
}: TableEmptyProps) {
  return (
    <div className={`w-full p-6 flex justify-center min-h-[70vh] ${className}`}>
      <Card className="max-w-xl w-full">
        <CardHeader className="flex flex-col items-center text-center p-6">
          <div className="flex items-center justify-center rounded-full bg-muted/40 w-16 h-16 mb-3">
            {icon ?? <Heart className="w-8 h-8 text-primary/90" />}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </CardHeader>

        <CardContent className="flex justify-center gap-3 p-6">
          {primaryHref ? (
            <Link href={primaryHref} className="inline-block">
              <Button>{primaryLabel}</Button>
            </Link>
          ) : (
            <Button>{primaryLabel}</Button>
          )}

          {secondaryLabel && <ClearAllNuqsSearchParms keys={querykeys} />}
        </CardContent>
      </Card>
    </div>
  );
}
