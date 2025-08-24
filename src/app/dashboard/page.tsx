interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const sp = await searchParams;
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      Dashboard Page
    </section>
  );
}
