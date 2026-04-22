import { env } from "@/lib/env";
import { toErrorMessage } from "@/utils/safe-error";

export class LiveClientError extends Error {
  kind: "not_in_game" | "unavailable";

  constructor(message: string, kind: "not_in_game" | "unavailable") {
    super(message);
    this.name = "LiveClientError";
    this.kind = kind;
  }
}

const REQUEST_TIMEOUT_MS = 1_200;

export class LiveClientBase {
  private readonly baseUrl: string;

  constructor(baseUrl = env.LIVE_CLIENT_BASE_URL ?? "https://127.0.0.1:2999") {
    this.baseUrl = baseUrl;
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 404) {
        throw new LiveClientError("Partida em andamento nao encontrada.", "not_in_game");
      }

      if (!response.ok) {
        throw new LiveClientError(
          `Live Client indisponivel (${response.status}).`,
          "unavailable",
        );
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof LiveClientError) {
        throw error;
      }

      throw new LiveClientError(
        `Falha ao conectar no Live Client: ${toErrorMessage(error)}`,
        "unavailable",
      );
    }
  }
}
