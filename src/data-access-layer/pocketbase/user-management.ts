import { browserPB } from "@/lib/pocketbase/browser-client";
import { mutationOptions } from "@tanstack/react-query";

export const banUserMutationOptions = mutationOptions({
    mutationFn: async (userId: string) => {
        return await browserPB.collection("users").update(userId, { banned: true });
    }
})
