import { z } from "zod";

export const envSchema = z.object({
  RIOT_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  LIVE_CLIENT_BASE_URL: z
    .string()
    .url()
    .default("https://127.0.0.1:2999")
    .optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;
