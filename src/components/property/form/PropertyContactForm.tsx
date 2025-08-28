"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { eq, and } from "@tigawanna/typed-pocketbase";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";

const messageSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface PropertyContactFormProps {
  propertyId: string;
  propertyTitle: string;
  children?: React.ReactNode;
  user: UsersResponse
}

interface SendMessagePayload {
  message: string;
  propertyId: string;
  userId: string;
}

// Mutation function to send a message
const sendMessage = async ({ message, propertyId, userId }: SendMessagePayload) => {
  return await browserPB.collection("property_messages").create({
    body: message,
    property_id: propertyId,
    user_id: userId,
    type: "parent",
  });
};

export function PropertyContactForm({
  propertyId,
  propertyTitle,
  children,
  user,
}: PropertyContactFormProps) {
  const userId = user.id;
  const [open, setOpen] = useState(false);
  const { data: message } = useQuery({
    queryKey: ["property_messages", propertyId, userId],
    queryFn: async () => {
      try {
        const result = await browserPB
          .from("property_messages")
          .getFirstListItem(
            and(eq("property_id", propertyId), eq("user_id", userId), eq("type", "parent"))
          );
        return {
          result,
          success: true,
        };
      } catch (error) {
        console.error("Error fetching messages:", error);
        return {
          result: null,
          success: false,
        };
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    },
  });

  const onSubmit = async (data: MessageFormData) => {
    const user = browserPB.authStore.record;
    if (!user) {
      toast.error("Please sign in to send a message");
      return;
    }

    sendMessageMutation.mutate({
      message: data.message,
      propertyId,
      userId: user.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact About This Property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message About Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            {/* <Label htmlFor="message" className="text-muted-foreground">Your Message</Label> */}
            <Textarea
              id="message"
              {...register("message")}
              placeholder={`Ask about "${propertyTitle}" - pricing, availability, features, etc.`}
              rows={6}
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={sendMessageMutation.isPending} className="flex-1">
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
