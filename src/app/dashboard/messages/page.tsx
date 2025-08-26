import { PropertyMessagesManager } from "@/components/dashboard/messages/PropertyMessagesManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import { Suspense } from "react";

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Property Messages</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Property Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </div>
          }>
            <PropertyMessagesManager />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
