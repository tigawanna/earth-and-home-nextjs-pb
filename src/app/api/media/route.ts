import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getMediaBucket } from "@/lib/media/r2";
import { isSafeMediaObjectKey } from "@/lib/media/media-key";
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

    const bucket = await getMediaBucket();
    const ext = extFromType(file.type, file.name);
    const key = `properties/${session.user.id}/${crypto.randomUUID()}.${ext}`;
    if (!isSafeMediaObjectKey(key)) {
      return NextResponse.json({ success: false, message: "Invalid key" }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()?.replace(/\/+$/, "") ?? "";
    if (!r2Base) {
      return NextResponse.json(
        { success: false, message: "NEXT_PUBLIC_R2_PUBLIC_URL is not configured" },
        { status: 503 },
      );
    }

    const url = `${r2Base}/${key}`;
    return NextResponse.json({ success: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
