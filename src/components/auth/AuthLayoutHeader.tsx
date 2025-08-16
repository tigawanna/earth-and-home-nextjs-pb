
import Link from "next/link";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { SiteIcon } from "@/components/icons/SiteIcon";
import LinkLoadingIndicator from "@/lib/next/LinkLoadingIndicator";
import { cn } from "@/lib/utils";

interface AuthLayoutHeaderProps {
  variant?: "default" | "floating";
  className?: string;
}

export function AuthLayoutHeader({ variant = "default", className }: AuthLayoutHeaderProps) {
  const isFloating = variant === "floating";
  
  return (
    <header
      className={cn(
        "w-full flex items-center justify-between py-4 px-6 z-50 border-b border-base-200 bg-background/20 fixed top-0",
        className
      )}>
      <Link href="/" aria-label="Earth & Home Home" className="flex items-center space-x-3 group">
        <SiteIcon className="transition-transform group-hover:scale-105" />
        <div>
          <span className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
            Earth & Home
          </span>
          <p className="text-xs text-muted-foreground">Real Estate Excellence</p>
        </div>
        <LinkLoadingIndicator />
      </Link>
      <div className="flex items-center gap-4">
        <ModeToggle compact />
      </div>
    </header>
  );
}
