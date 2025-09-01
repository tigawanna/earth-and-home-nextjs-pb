import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowRight, ArrowUp, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  link?: {
    href: string;
    label: string;
  };
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  className,
  link
}: StatsCardProps) {
  return (
    <Card className={`relative overflow-hidden ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span 
              className={`text-xs ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {Math.abs(trend.value)}%
            </span>
            <TrendingUp className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        )}
        {link && (
          <Link 
            href={link.href}
            className="inline-flex items-center text-xs text-primary hover:text-primary/80 mt-2 group"
          >
            {link.label}
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
