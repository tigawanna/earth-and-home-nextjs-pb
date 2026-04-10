import type { UsersResponse } from "@/types/domain-types";

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
    id: sessionUser.id,
    email: sessionUser.email,
    verified: sessionUser.emailVerified ?? false,
    name: sessionUser.name,
    avatar: sessionUser.image ?? "",
    is_admin: sessionUser.role === "admin",
    is_banned: sessionUser.banned ?? false,
    phone: "",
    is_agent: sessionUser.role === "agent",
    created: now,
    updated: now,
  };
}
