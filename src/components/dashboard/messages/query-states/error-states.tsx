"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

// ====================================================
// ERROR STATES
// ====================================================

export function PropertyMessagesError({
  title = "Error Loading Messages",
  message = "Failed to load property messages. Please try again later.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-destructive">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export function PropertyMessagesConnectionError() {
  return (
    <PropertyMessagesError
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
    />
  );
}

export function PropertyMessagesPermissionError() {
  return (
    <PropertyMessagesError
      title="Access Denied"
      message="You don't have permission to view these messages. Please contact an administrator."
    />
  );
}
