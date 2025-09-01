"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showToast?: boolean;
  toastMessage?: string;
  children?: React.ReactNode;
  title?: string;
}

export function CopyButton({
  text,
  label = "Text",
  className,
  size = "sm",
  variant = "ghost",
  showToast = true,
  toastMessage,
  children,
  title
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      if (showToast) {
        const message = toastMessage || `${label} copied to clipboard!`;
        toast.success(message);
      }
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("error happende = =>\n","Failed to copy to clipboard:", error);
      
      if (showToast) {
        toast.error(`Failed to copy ${label.toLowerCase()}`);
      }
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={cn("transition-all duration-200", className)}
      onClick={copyToClipboard}
      title={title || `Copy ${label.toLowerCase()}`}
    >
      {children || (
        <>
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </>
      )}
    </Button>
  );
}
