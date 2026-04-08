import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getMediaBucket() {
  const { env } = await getCloudflareContext({ async: true });
  return env.MEDIA;
}
