import { createBrowserClient } from "@/lib/pocketbase/browser-client";
import { queryOptions } from "@tanstack/react-query";

export function authQueryOptions(){
    return queryOptions({
        queryKey:["viewer"],
        queryFn: async ({ signal }) => {
            const client = createBrowserClient();
            const res =client.from("users").authRefresh()
            return res
        }
    })
}
