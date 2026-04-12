"use server";

import { agents, properties } from "@/db/schema/app-schema";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { sanitizeStoredPath } from "@/data-access-layer/media/image-url";
import { getMediaBucket } from "@/lib/media/r2";
import { isSafeMediaObjectKey } from "@/lib/media/media-key";
import { canManageProperty } from "@/lib/property/can-manage-property";
import { eq } from "drizzle-orm";

type UploadResult =
  | { success: true; url: string }
  | { success: false; message: string };

type DeleteResult = { success: true } | { success: false; message: string };

function resolvePropertyMediaObjectKey(propertyId: string, storedPath: string): string | null {
  const path = sanitizeStoredPath(storedPath);
  if (!path) return null;
  const key = path.startsWith("/") ? path.slice(1) : path;
  if (!isSafeMediaObjectKey(key)) return null;
  const expectedPrefix = `properties/${propertyId}/`;
  if (!key.startsWith(expectedPrefix)) return null;
  const remainder = key.slice(expectedPrefix.length);
  if (!remainder || remainder.includes("/")) return null;
  return key;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFromType(contentType: string, fileName: string): string {
  const fromName = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : "";
  if (fromName && /^[a-z0-9]{1,8}$/.test(fromName)) return fromName;
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "jpg";
}

export async function uploadPropertyImage(formData: FormData): Promise<UploadResult> {
  try {
    const session = await getBetterAuthSession();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const propertyId = (formData.get("propertyId") as string | null)?.trim() ?? "";
    if (!propertyId) {
      return { success: false, message: "Missing propertyId" };
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return { success: false, message: "Missing file" };
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return { success: false, message: "Unsupported file type" };
    }

    if (file.size > MAX_BYTES) {
      return { success: false, message: "File too large (max 5 MB)" };
    }

    const user = mapSessionUserToUsersResponse(session.user);
    const db = await getDb();
    const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
    const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;

    const [existing] = await db
      .select({ agentId: properties.agentId, ownerId: properties.ownerId })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (existing) {
      if (!canManageProperty(user, agent, { agent_id: existing.agentId, owner_id: existing.ownerId ?? "" })) {
        return { success: false, message: "Forbidden" };
      }
    } else {
      const canCreate = agent && (user.is_admin || agent.approval_status === "approved");
      if (!canCreate) {
        return { success: false, message: "Forbidden" };
      }
    }

    const bucket = await getMediaBucket();
    const ext = extFromType(file.type, file.name);
    const key = `properties/${propertyId}/${crypto.randomUUID()}.${ext}`;
    if (!isSafeMediaObjectKey(key)) {
      return { success: false, message: "Invalid key" };
    }

    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    return { success: true, url: `/${key}` };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Upload failed" };
  }
}

export async function deletePropertyImage(propertyId: string, storedPath: string): Promise<DeleteResult> {
  try {
    const session = await getBetterAuthSession();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const id = propertyId.trim();
    if (!id) {
      return { success: false, message: "Missing propertyId" };
    }

    const key = resolvePropertyMediaObjectKey(id, storedPath);
    if (!key) {
      return { success: false, message: "Invalid image path" };
    }

    const user = mapSessionUserToUsersResponse(session.user);
    const db = await getDb();
    const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
    const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;

    const [existing] = await db
      .select({ agentId: properties.agentId, ownerId: properties.ownerId })
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (existing) {
      if (!canManageProperty(user, agent, { agent_id: existing.agentId, owner_id: existing.ownerId ?? "" })) {
        return { success: false, message: "Forbidden" };
      }
    } else {
      const canCreate = agent && (user.is_admin || agent.approval_status === "approved");
      if (!canCreate) {
        return { success: false, message: "Forbidden" };
      }
    }

    const bucket = await getMediaBucket();
    await bucket.delete(key);
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Delete failed" };
  }
}
