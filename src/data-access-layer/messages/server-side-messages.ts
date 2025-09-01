import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import "server-only";

interface GetSinglePropertyMessageprops {
  msgId: string;
}
export async function getSinglePropertyMessage({ msgId }: GetSinglePropertyMessageprops) {
  try {
    const client = await createServerClient();
    const response = await client.from("property_messages").getOne(msgId, {
      // expand: "user_id,property_id",
      select: {
        expand: {
          user_id: true,
          property_id: true,
        },
      },
    });
    // client.beforeSend = function (url, options) {
    //   // For list of the possible request options properties check
    //   // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
    //   console.log({ url, options });
    //   return { url, options };
    // };
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
