"use server";

import { revalidateTag } from "next/cache";

export async function revalidatePropertiesList() {
  revalidateTag("properties-list");
}

export async function revalidatePropertyById(propertyId: string) {
  revalidateTag(propertyId);
}
