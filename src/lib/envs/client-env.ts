import z from "zod";

// Client-side environment variables (publicly accessible)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_R2_PUBLIC_URL: z.url(),
});

// Only validate on client side and if variables are expected to be available
const clientResult = typeof window !== 'undefined' 
  ? clientEnvSchema.safeParse({
      NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    })
  : { success: true, data: { NEXT_PUBLIC_R2_PUBLIC_URL: '' } };

if (!clientResult.success && typeof window !== 'undefined') {
  console.log("Available env vars:", Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
  console.log("NEXT_PUBLIC_R2_PUBLIC_URL:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL);
  if ('error' in clientResult) {
    console.log("error happende = =>\n","Invalid client environment variables:", clientResult.error.issues);
  }
  throw new Error("Invalid client environment variables");
}

export const clientEnvs = clientResult.data;
