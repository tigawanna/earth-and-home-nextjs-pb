"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import Link from "next/link";

interface AgentRejectedModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AgentRejectedModal({ open, onOpenChange }: AgentRejectedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Application not approved</DialogTitle>
          <DialogDescription className="text-center">
            Your agent application was not approved. You can update your details and submit again for
            review.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
          <Button asChild className="w-full">
            <Link
              href={`/dashboard/agents/new?returnTo=${encodeURIComponent("/dashboard/properties/add")}`}
              prefetch={false}
            >
              <UserPlus className="w-4 h-4" />
              Update and resubmit
            </Link>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange?.(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
