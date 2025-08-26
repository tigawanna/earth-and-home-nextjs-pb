import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface PropertyContactFormProps {
  propertyId: string;
  propertyTitle: string;
  children?: React.ReactNode;
}

export function PropertyContactForm({
  propertyId,
  propertyTitle,
  children,
}: PropertyContactFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageFormData) => {
    try {
      setIsSubmitting(true);
      
      const user = browserPB.authStore.model;
      if (!user) {
        toast.error("Please sign in to send a message");
        return;
      }

      await browserPB.collection("property_messages").create({
        message: data.message,
        property_id: propertyId,
        user_id: user.id,
      });

      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div>
            <Label htmlFor="message">Your Message</Label>
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
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
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
