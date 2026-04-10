import { getMediaBucket } from "@/lib/media/r2";
import { isSafeMediaObjectKey } from "@/lib/media/media-key";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const key = path.join("/");
  if (!isSafeMediaObjectKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  const bucket = await getMediaBucket();
  const obj = await bucket.get(key);
  if (!obj) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = obj.httpMetadata?.contentType ?? "application/octet-stream";
  const body = await obj.arrayBuffer();

  return new Response(body, {
    headers: {
      "content-type": contentType,
      "content-length": body.byteLength.toString(),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
