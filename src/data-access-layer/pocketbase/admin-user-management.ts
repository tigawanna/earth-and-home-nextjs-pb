import { browserPB } from "@/lib/pocketbase/browser-client";
import { mutationOptions } from "@tanstack/react-query";

export const toggleBanUserMutationOptions = mutationOptions({
  mutationFn: async ({ userId, is_banned }: { userId: string; is_banned: boolean }) => {
    try {
      const response = await browserPB.from("users").update(userId, { is_banned: !is_banned });
      return {
        success: true,
        message: `User ${is_banned ? "banned" : "unbanned"} successfully`,
        result: response,
      };
    } catch (error) {
      console.error("Error banning user:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

export const toggleAdminMutationOptions = mutationOptions({
  mutationFn: async ({ is_admin, userId }: { userId: string; is_admin: boolean }) => {
    try {
      const response = await browserPB.from("users").update(userId, { is_admin: !is_admin });
      return {
        success: true,
        message: `User ${is_admin ? "granted" : "revoked"} admin privileges successfully`,
        result: response,
      };
    } catch (error) {
      console.error("Error toggling admin status:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
