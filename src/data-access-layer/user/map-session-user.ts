import type { UsersResponse } from "@/lib/pocketbase/types/pb-types";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  emailVerified?: boolean;
};

export function mapSessionUserToUsersResponse(sessionUser: SessionUser): UsersResponse {
  const now = new Date().toISOString();
  return {
    collectionName: "users",
    collectionId: "",
    id: sessionUser.id,
    username: sessionUser.email,
    tokenKey: "",
    email: sessionUser.email,
    emailVisibility: true,
    verified: sessionUser.emailVerified ?? false,
    name: sessionUser.name,
    avatar: sessionUser.image ?? "",
    is_admin: sessionUser.role === "admin",
    is_banned: sessionUser.banned ?? false,
    phone: "",
    is_agent: false,
    created: now,
    updated: now,
  };
}
