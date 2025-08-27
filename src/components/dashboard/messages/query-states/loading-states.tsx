import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Home, MessageCircle } from "lucide-react";

// ====================================================
// LOADING STATES
// ====================================================

export function AllPropertiesMessagesLoading() {
  return (
    <div className="w-full h-full gap-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Property Messages</h2>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PropertyMessageCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PropertyMessagesLoading() {
  return (
    <div className="w-full h-full gap-4 flex flex-col">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ChatMessageSkeleton key={i} isCurrentUser={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

export function PropertyMessageCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChatMessageSkeleton({ isCurrentUser }: { isCurrentUser: boolean }) {
  return (
    <div className={cn("flex gap-3", isCurrentUser && "justify-end")}>
      {!isCurrentUser && <Skeleton className="h-8 w-8 rounded-full" />}
      <div className={cn("max-w-[70%] space-y-2", isCurrentUser && "order-first")}>
        <Skeleton className="h-4 w-20" />
        <Skeleton
          className={cn("h-16 w-full rounded-lg", isCurrentUser ? "bg-primary/20" : "bg-muted")}
        />
        <Skeleton className="h-3 w-16" />
      </div>
      {isCurrentUser && <Skeleton className="h-8 w-8 rounded-full" />}
    </div>
  );
}

// ====================================================
// EMPTY/NOT FOUND STATES
// ====================================================

export function NoPropertyMessages() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <MessageCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No Messages Found</h3>
        <p className="text-muted-foreground max-w-md">
          No property messages found. Messages will appear here when users inquire about properties.
        </p>
      </div>
    </div>
  );
}

export function NoMessagesForProperty({ propertyTitle }: { propertyTitle?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <MessageCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No Messages Yet</h3>
        <p className="text-muted-foreground max-w-md">
          No messages for {propertyTitle || "this property"} yet. Messages from interested users
          will appear here.
        </p>
      </div>
      <Button variant="outline" size="sm">
        <Home className="w-4 h-4 mr-2" />
        View Property Details
      </Button>
    </div>
  );
}


