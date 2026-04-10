import { redirect } from "next/navigation";

interface AgentsAddPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function AgentsAddAliasPage({ searchParams }: AgentsAddPageProps) {
  const sp = await searchParams;
  const raw = sp.returnTo;
  const returnTo = Array.isArray(raw) ? raw[0] : raw;
  if (typeof returnTo === "string" && returnTo.startsWith("/dashboard") && !returnTo.startsWith("//")) {
    throw redirect(
      `/dashboard/agents/new?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }
  throw redirect("/dashboard/agents/new");
}
