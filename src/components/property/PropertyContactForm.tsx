import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  user_name: z.string().min(1, "Name is required"),
  user_email: z.string().email("Valid email is required"),
  user_phone: z.string().optional(),
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
    defaultValues: {
      subject: `Inquiry about: ${propertyTitle}`,
    },
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
        ...data,
        property_id: propertyId,
        user_id: user.id,
        status: "new",
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
          <DialogTitle>Contact About Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...register("subject")}
              placeholder="What would you like to know?"
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="user_name">Your Name</Label>
            <Input
              id="user_name"
              {...register("user_name")}
              placeholder="Enter your full name"
            />
            {errors.user_name && (
              <p className="text-sm text-red-500 mt-1">{errors.user_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="user_email">Your Email</Label>
            <Input
              id="user_email"
              type="email"
              {...register("user_email")}
              placeholder="Enter your email address"
            />
            {errors.user_email && (
              <p className="text-sm text-red-500 mt-1">{errors.user_email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="user_phone">Phone Number (Optional)</Label>
            <Input
              id="user_phone"
              {...register("user_phone")}
              placeholder="Enter your phone number"
            />
            {errors.user_phone && (
              <p className="text-sm text-red-500 mt-1">{errors.user_phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Tell us what you'd like to know about this property..."
              rows={4}
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
