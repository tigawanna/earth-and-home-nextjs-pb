"use server";

import { revalidateTag } from "next/cache";

export async function revalidatePropertiesList() {
  revalidateTag("properties-list", "max");
}

export async function revalidatePropertyById(propertyId: string) {
  revalidateTag(propertyId, "max");
  revalidateTag("properties-list", "max");
}
