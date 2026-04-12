import { agents, properties } from "@/db/schema/app-schema";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { getMediaBucket } from "@/lib/media/r2";
import { isSafeMediaObjectKey } from "@/lib/media/media-key";
import { canManageProperty } from "@/lib/property/can-manage-property";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFromType(contentType: string, fileName: string): string {
  const fromName = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : "";
  if (fromName && /^[a-z0-9]{1,8}$/.test(fromName)) return fromName;
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getBetterAuthSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const propertyIdRaw = formData.get("propertyId");
    const propertyId =
      typeof propertyIdRaw === "string" ? propertyIdRaw.trim() : "";
    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Missing propertyId" },
        { status: 400 },
      );
    }

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Missing file" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: "File too large" }, { status: 400 });
    }

    const user = mapSessionUserToUsersResponse(session.user);
    const db = await getDb();
    const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
    const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;

    const [existing] = await db
      .select({
        agentId: properties.agentId,
        ownerId: properties.ownerId,
      })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (existing) {
      if (
        !canManageProperty(user, agent, {
          agent_id: existing.agentId,
          owner_id: existing.ownerId ?? "",
        })
      ) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    } else {
      const canCreate = agent && (user.is_admin || agent.approval_status === "approved");
      if (!canCreate) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    }

    const bucket = await getMediaBucket();
    const ext = extFromType(file.type, file.name);
    const key = `properties/${propertyId}/${crypto.randomUUID()}.${ext}`;
    if (!isSafeMediaObjectKey(key)) {
      return NextResponse.json({ success: false, message: "Invalid key" }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const storedPath = `/${key}`;
    return NextResponse.json({ success: true, url: storedPath });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
