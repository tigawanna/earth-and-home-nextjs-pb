import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { PropertyMessagesResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import {
    CheckCircle,
    Eye,
    Filter,
    Loader2,
    MessageSquare,
    Reply,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const replySchema = z.object({
  admin_reply: z.string().min(1, "Reply is required"),
});

type ReplyFormData = z.infer<typeof replySchema>;

type PropertyMessage = PropertyMessagesResponse & {
  expand?: {
    property_id?: {
      id: string;
      title: string;
    };
    user_id?: {
      id: string;
      name: string;
      email: string;
    };
    replied_by?: {
      id: string;
      name: string;
      email: string;
    };
  };
};

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

export function PropertyMessagesManager() {
  const [messages, setMessages] = useState<PropertyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<PropertyMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const result = await browserPB
        .collection("property_messages")
        .getList(1, 50, {
          sort: "-created",
          expand: "property_id,user_id,replied_by",
        });
      
      setMessages(result.items as PropertyMessage[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await browserPB.collection("property_messages").update(messageId, {
        status: "read",
      });
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: "read" as const } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const onReply = async (data: ReplyFormData) => {
    if (!selectedMessage) return;

    try {
      setIsReplying(true);
      const user = browserPB.authStore.model;
      
      await browserPB.collection("property_messages").update(selectedMessage.id, {
        admin_reply: data.admin_reply,
        status: "replied",
        replied_at: new Date().toISOString(),
        replied_by: user?.id,
      });

      toast.success("Reply sent successfully!");
      reset();
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };

  const updateStatus = async (messageId: string, status: string) => {
    try {
      await browserPB.collection("property_messages").update(messageId, {
        status,
      });
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: status as any } : msg
        )
      );
      
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedMessage && selectedMessage.status === "new") {
      markAsRead(selectedMessage.id);
    }
  }, [selectedMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No messages found
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => {
            const StatusIcon = statusIcons[message.status];
            
            return (
              <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      <CardDescription className="mt-1">
                        From: {message.user_name} ({message.user_email})
                        {message.user_phone && ` • ${message.user_phone}`}
                      </CardDescription>
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
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {message.message}
                  </p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{message.subject}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>From:</strong> {message.user_name}
                            </div>
                            <div>
                              <strong>Email:</strong> {message.user_email}
                            </div>
                            {message.user_phone && (
                              <div>
                                <strong>Phone:</strong> {message.user_phone}
                              </div>
                            )}
                            <div>
                              <strong>Status:</strong> 
                              <Badge className={`ml-2 ${statusColors[message.status]} text-white`}>
                                {message.status}
                              </Badge>
                            </div>
                            <div>
                              <strong>Received:</strong> {formatDistanceToNow(new Date(message.created), { addSuffix: true })}
                            </div>
                            {message.expand?.property_id && (
                              <div className="col-span-2">
                                <strong>Property:</strong> {message.expand.property_id.title}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <strong>Message:</strong>
                            <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                              {message.message}
                            </div>
                          </div>

                          {message.admin_reply && (
                            <div>
                              <strong>Admin Reply:</strong>
                              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                                {message.admin_reply}
                              </div>
                              {message.replied_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Replied {formatDistanceToNow(new Date(message.replied_at), { addSuffix: true })}
                                </p>
                              )}
                            </div>
                          )}

                          {message.status !== "replied" && message.status !== "closed" && (
                            <form onSubmit={handleSubmit(onReply)} className="space-y-4">
                              <div>
                                <Label htmlFor="admin_reply">Reply to Message</Label>
                                <Textarea
                                  id="admin_reply"
                                  {...register("admin_reply")}
                                  placeholder="Type your reply here..."
                                  rows={4}
                                />
                                {errors.admin_reply && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {errors.admin_reply.message}
                                  </p>
                                )}
                              </div>
                              <Button type="submit" disabled={isReplying}>
                                {isReplying ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending Reply...
                                  </>
                                ) : (
                                  <>
                                    <Reply className="w-4 h-4 mr-2" />
                                    Send Reply
                                  </>
                                )}
                              </Button>
                            </form>
                          )}

                          <div className="flex gap-2 pt-4 border-t">
                            <Select
                              value={message.status}
                              onValueChange={(value) => updateStatus(message.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="replied">Replied</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
