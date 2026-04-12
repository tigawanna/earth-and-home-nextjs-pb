import { properties } from "@/db/schema";
import { getDb } from "@/lib/db/get-db";

export default async function pagePage() {
  const db = await getDb();
//   const imageRul =
//     process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
//     "/properties/dpAY3DTBBeVlxxXcvyfeajouTOeT8olB/04871a9b-ede1-45c0-9c20-22b591592e02.jpg";
  const prts = await db.select().from(properties).limit(10);

  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
        {prts.map((p) => {
            if (!p.imageUrl) return null;
            return (
            <div key={p.id}>
                <div>{p.title}</div>
                <div>{p.imageUrl}</div>
                <img src={p.imageUrl} alt={p.title} width={200} height={200} />
            </div>
        )})}
    </section>
  );
}
