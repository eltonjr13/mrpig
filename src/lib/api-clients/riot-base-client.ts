import { env } from "@/lib/env";
import type { RiotPlatformRoute, RiotRegionalRoute } from "@/types/riot";
import { toErrorMessage } from "@/utils/safe-error";

interface RiotHostRegion {
  type: "regional";
  route: RiotRegionalRoute;
}

interface RiotHostPlatform {
  type: "platform";
  route: RiotPlatformRoute;
}

interface RiotRequestConfig {
  host: RiotHostRegion | RiotHostPlatform;
  path: string;
  query?: Record<string, string | number | undefined>;
}

export class RiotApiError extends Error {
  status: number;
  endpoint: string;
  details?: string;

  constructor(message: string, status: number, endpoint: string, details?: string) {
    super(message);
    this.name = "RiotApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.details = details;
  }
}

const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 8_000;

function getBaseUrl(host: RiotRequestConfig["host"]) {
  if (host.type === "regional") {
    return `https://${host.route}.api.riotgames.com`;
  }

  return `https://${host.route}.api.riotgames.com`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriableError(error: unknown) {
  if (error instanceof RiotApiError) {
    return error.status >= 500 || error.status === 429;
  }

  if (error instanceof Error && error.name === "AbortError") {
    return true;
  }

  return false;
}

export class RiotBaseClient {
  private readonly apiKey: string | undefined;

  constructor(apiKey: string | undefined = env.RIOT_API_KEY) {
    this.apiKey = apiKey;
  }

  hasApiKey() {
    return Boolean(this.apiKey);
  }

  async get<TResponse>({ host, path, query }: RiotRequestConfig): Promise<TResponse> {
    if (!this.apiKey) {
      throw new RiotApiError(
        "RIOT_API_KEY nao configurada. Operando com fallback/mock.",
        401,
        path,
      );
    }

    const url = new URL(path, getBaseUrl(host));
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "X-Riot-Token": this.apiKey,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        clearTimeout(timeout);

        if (response.status === 429 && attempt < MAX_RETRIES) {
          const retryAfterSeconds = Number(response.headers.get("Retry-After") ?? 1);
          await sleep((retryAfterSeconds + attempt) * 1_000);
          continue;
        }

        if (!response.ok) {
          const details = await response.text();
          throw new RiotApiError(
            `Erro na chamada Riot (${response.status})`,
            response.status,
            path,
            details,
          );
        }

        return (await response.json()) as TResponse;
      } catch (error) {
        clearTimeout(timeout);

        if (attempt < MAX_RETRIES && isRetriableError(error)) {
          await sleep((attempt + 1) * 650);
          continue;
        }

        if (error instanceof RiotApiError) {
          throw error;
        }

        throw new RiotApiError(
          `Falha inesperada na Riot API: ${toErrorMessage(error)}`,
          500,
          path,
        );
      }
    }

    throw new RiotApiError("Falha apos retries na Riot API", 500, path);
  }
}
