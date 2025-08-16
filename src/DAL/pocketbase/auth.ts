import { createBrowserClient } from "@/lib/pocketbase/browser-client";
import { UsersCreate } from "@/lib/pocketbase/types/pb-zod";
import { deleteBrowserCookie } from "@/utils/browser-cookie";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function viewerQueryOptions(){
    return queryOptions({
        queryKey:["viewer"],
        queryFn: async ({ signal }) => {
            const client = createBrowserClient();
            const res =client.from("users").authRefresh()
            return res
        }
    })
}

export function logoutMutationOptions() {
    return mutationOptions({
        mutationFn: async () => {
            const client = createBrowserClient();
            await client.authStore.clear();
            deleteBrowserCookie("pb_auth");
            return true;
        }
    })
}

export function signinMutationOptions() {
    return mutationOptions({
        mutationFn: async (data: { email: string; password: string }) => {
            const client = createBrowserClient();
            const res = await client
                .from("users")
                .authWithPassword(data.email, data.password);
            return res;
        }
    });
}

export function signupMutationOptions() {
    return mutationOptions({
        mutationFn: async (data:UsersCreate) => {
            const client = createBrowserClient();
            const res = await client.from("users").create(data);
            return res;
        }
    });
}
