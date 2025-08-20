"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TablePendingProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
}

export function TablePending({
  columns = 6,
  rows = 12,
  showHeader = true,
}: TablePendingProps) {
  const innerCols = Math.max(1, columns - 1);

  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader className="flex items-center justify-between gap-4 p-3 sm:p-4">
          <div className="flex-1">
            <Input disabled placeholder="Loading..." className="bg-muted/20" />
          </div>
          <div className="flex items-center gap-2">
            <Button disabled variant="ghost" className="px-3">
              <div className="h-3 w-12 rounded bg-muted/30 animate-pulse" />
            </Button>
            <Button disabled variant="ghost" className="px-3">
              <div className="h-3 w-12 rounded bg-muted/30 animate-pulse" />
            </Button>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: rows }).map((_, ri) => (
                <TableRow key={ri} className="select-none">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md bg-muted/30 animate-pulse flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 w-40 rounded bg-muted/30 animate-pulse mb-2" />
                        <div className="h-3 w-32 rounded bg-muted/30 animate-pulse" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="h-4 w-24 rounded bg-muted/30 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-muted/30 animate-pulse mt-2" />
                  </TableCell>

                  <TableCell>
                    <div className="h-4 w-20 rounded bg-muted/30 animate-pulse" />
                  </TableCell>

                  <TableCell>
                    <div className="h-4 w-28 rounded bg-muted/30 animate-pulse" />
                  </TableCell>

                  <TableCell>
                    <div className="h-4 w-20 rounded bg-muted/30 animate-pulse" />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-8 w-8 rounded bg-muted/30 animate-pulse" />
                      <div className="h-8 w-8 rounded bg-muted/30 animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
