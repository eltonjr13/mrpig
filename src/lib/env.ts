import { envSchema } from "@/schemas/env.schema";

function normalizeOptionalEnv(value: string | undefined) {
  const normalizedValue = value?.trim();
  return normalizedValue && normalizedValue.length > 0 ? normalizedValue : undefined;
}

export const env = envSchema.parse({
  RIOT_API_KEY: normalizeOptionalEnv(process.env.RIOT_API_KEY),
  NEXT_PUBLIC_SUPABASE_URL: normalizeOptionalEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: normalizeOptionalEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
  SUPABASE_SERVICE_ROLE_KEY: normalizeOptionalEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
  LIVE_CLIENT_BASE_URL: normalizeOptionalEnv(process.env.LIVE_CLIENT_BASE_URL),
});
