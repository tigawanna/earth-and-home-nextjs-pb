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
import { UserPlus, Users } from "lucide-react";
import Link from "next/link";

interface AgentRequiredModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AgentRequiredModal({ open, onOpenChange }: AgentRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Agent Required</DialogTitle>
          <DialogDescription className="text-center">
            You need to have an agent assigned to perform this action. Please add an agent to continue.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
          <Button asChild className="w-full">
            <Link href="/dashboard/agents/add">
              <UserPlus className="w-4 h-4" />
              Add Agent
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
