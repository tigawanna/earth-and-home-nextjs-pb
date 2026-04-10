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
import { Clock } from "lucide-react";
import Link from "next/link";

interface AgentPendingModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AgentPendingModal({ open, onOpenChange }: AgentPendingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/15">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center">Authorization pending</DialogTitle>
          <DialogDescription className="text-center">
            Your agent application is waiting for an administrator to review it. You will be able to
            add listings after it is approved.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard" prefetch={false}>
              Back to dashboard
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
