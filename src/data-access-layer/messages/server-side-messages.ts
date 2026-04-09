import "server-only";

import { drizzleGetSinglePropertyMessage } from "./drizzle-message-queries";

interface GetSinglePropertyMessageprops {
  msgId: string;
}

export async function getSinglePropertyMessage({ msgId }: GetSinglePropertyMessageprops) {
  try {
    return await drizzleGetSinglePropertyMessage(msgId);
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching property message parent:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property message parent",
      result: null,
    };
  }
}
