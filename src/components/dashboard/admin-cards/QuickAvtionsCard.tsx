import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building2, Heart, Plus, Settings } from "lucide-react";
import Link from "next/link";

interface QuickActionsCardProps {
  className?: string;
  isAdmin?: boolean;
}

export function QuickActionsCard({ className, isAdmin }: QuickActionsCardProps) {
  return (
    <Card
      className={`relative w-full bg-card/95 border border-border/60 shadow-sm overflow-hidden group transition-colors rounded-lg ${
        className || ""
      }`}>
      <CardContent className="relative p-3 space-y-2">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="relative">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                <Settings className="h-4 w-4" aria-hidden />
              </div>
              <div className="absolute -inset-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 blur-sm" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h3 className="text-[11px] font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                Quick Actions
              </h3>
              <p className="text-[10px] text-muted-foreground/80">Common tasks</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-[10px] font-medium hover:bg-primary/10 hover:text-primary h-6 px-2 shrink-0">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid gap-4">
          {/* {data?.viewer?.is_admin &&  */}
          {isAdmin && (
            <Button asChild size="sm" className="justify-start h-7 text-[11px]">
              <Link href="/dashboard/properties/add">
                <Plus className="mr-2 h-3.5 w-3.5" /> Add Property
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild size="sm" className="justify-start h-7 text-[11px]">
            <Link href="/dashboard/properties">
              <Building2 className="mr-2 h-3.5 w-3.5" /> My Properties
            </Link>
          </Button>
          <Button variant="outline" asChild size="sm" className="justify-start h-7 text-[11px]">
            <Link href="/dashboard/favorites">
              <Heart className="mr-2 h-3.5 w-3.5" /> Saved Properties
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
