import { AuthLayoutHeader } from "@/components/auth/AuthLayoutHeader";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function BannedPage() {
  return (
    <section className="w-full min-h-[99vh] flex items-center justify-center py-12 px-4">
      <AuthLayoutHeader variant="floating" />
      <Card className="max-w-lg w-full text-center p-8">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-destructive/90" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">You have been banned</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Your account no longer has access to this site. If you believe this is a mistake, you
              can contact the team to request a review.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>

            <Link href="/contact">
              <Button>Contact support</Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            If you think this is in error, please include your account email and any relevant
            information when contacting support.
          </p>

          <p className="text-xs text-muted-foreground">
            Tip: you may need to log out and log back in to refresh your account status.
          </p>
          <LogoutButton />
        </CardContent>
      </Card>
    </section>
  );
}
