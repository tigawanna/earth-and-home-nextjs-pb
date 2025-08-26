import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserMessages } from "@/data-access-layer/user/user-dashboard";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, Eye, MessageSquare, XCircle } from "lucide-react";

const statusColors = {
  new: "bg-blue-500",
  read: "bg-yellow-500",
  replied: "bg-green-500",
  closed: "bg-gray-500",
};

const statusIcons = {
  new: MessageSquare,
  read: Eye,
  replied: CheckCircle,
  closed: XCircle,
};

interface UserMessagesViewProps {
  user: UsersResponse | null;
}
export async function UserMessagesView({ user }: UserMessagesViewProps) {
  if (!user) {
    return <div>Please sign in to view your messages.</div>;
  }

  const messages = getUserMessages({ userId: user.id, limit: 50, page: 1 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Your Messages</h2>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p>Your property inquiries will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => {
            const StatusIcon = statusIcons[message.status];

            return (
              <Card key={message.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      {message.expand?.property_id && (
                        <CardDescription className="mt-1">
                          Property: {message.expand.property_id.title}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusColors[message.status]} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {message.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Your message:</h4>
                      <div className="p-3 bg-muted rounded-md text-sm">{message.message}</div>
                    </div>

                    {message.admin_reply && (
                      <div>
                        <h4 className="font-medium mb-2 text-green-700">Admin Reply:</h4>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                          {message.admin_reply}
                        </div>
                        {message.replied_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Replied{" "}
                            {formatDistanceToNow(new Date(message.replied_at), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    )}

                    {message.status === "new" && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Waiting for admin response...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
