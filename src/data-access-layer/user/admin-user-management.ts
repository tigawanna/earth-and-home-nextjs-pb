import { mutationOptions } from "@tanstack/react-query";

export const toggleBanUserMutationOptions = mutationOptions({
  mutationFn: async ({ userId, is_banned }: { userId: string; is_banned: boolean }) => {
    try {
      const res = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_banned: !is_banned }),
      });
      const json = (await res.json()) as { success: boolean; message: string };
      return {
        success: json.success as boolean,
        message: json.message as string,
      };
    } catch (error) {
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
      const res = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_admin: !is_admin }),
      });
      const json = (await res.json()) as { success: boolean; message: string };
      return {
        success: json.success as boolean,
        message: json.message as string,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
