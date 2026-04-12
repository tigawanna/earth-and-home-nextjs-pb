import { mutationOptions } from "@tanstack/react-query";
import { toggleBanUser, toggleAdminUser } from "../actions/user-actions";

export const toggleBanUserMutationOptions = mutationOptions({
  mutationFn: async ({ userId, is_banned }: { userId: string; is_banned: boolean }) => {
    const result = await toggleBanUser({ userId, isBanned: is_banned });
    if (!result.success) {
      return { success: false, message: result.message };
    }
    return { success: true, message: result.data.message };
  },
});

export const toggleAdminMutationOptions = mutationOptions({
  mutationFn: async ({ is_admin, userId }: { userId: string; is_admin: boolean }) => {
    const result = await toggleAdminUser({ userId, isAdmin: is_admin });
    if (!result.success) {
      return { success: false, message: result.message };
    }
    return { success: true, message: result.data.message };
  },
});
