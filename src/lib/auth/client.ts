import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const publicAuthBase =
  typeof process.env.NEXT_PUBLIC_BETTER_AUTH_URL === "string" &&
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL.length > 0
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    : "http://localhost:3010";

export const authClient = createAuthClient({
  baseURL: publicAuthBase,
  plugins: [adminClient()],
});
