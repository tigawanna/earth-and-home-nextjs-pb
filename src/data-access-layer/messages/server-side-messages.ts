import "server-only";
import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { and, eq } from "@tigawanna/typed-pocketbase";

interface GetSinglePropertyMessageprops {
  msgId:string
}
export async function getSinglePropertyMessage({
  msgId,
}: GetSinglePropertyMessageprops) {
  try {
    const client = await createServerClient();
    const response = await client
      .from("property_messages")
      .getOne(msgId);
      // .getFirstListItem(and(eq("parent", propertyId), eq("user_id", userId)));
    return {
      success: true,
      result: response,
    };
  } catch (error) {
    console.error("Error fetching property message parent:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property message parent",
      result: null,
    };
  }
}
