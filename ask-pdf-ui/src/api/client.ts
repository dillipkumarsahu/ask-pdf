import type { UploadResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!BASE_URL) {
  // Fails loudly in dev rather than silently hitting a relative path.
  console.warn(
    "VITE_API_BASE_URL is not set. Copy .env.example to .env and set your backend URL."
  );
}

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseJsonSafely(
  res: Response
): Promise<Record<string, unknown> | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    // Backend returned plain text instead of JSON.
    return { message: text };
  }
}

export async function uploadPdf(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the backend running?");
  }

  const data = await parseJsonSafely(res);

  if (!res.ok) {
    const detail =
      (data && (data.detail || data.message || data.error)) ||
      `Upload failed (${res.status})`;
    throw new ApiError(String(detail), res.status);
  }

  return data ?? {};
}

export async function askQuestionStream(
  question: string,
  onChunk: (chunk: string) => void,
  options?: { delayMs?: number; charsPerTick?: number }
): Promise<void> {
  const params = new URLSearchParams({ question });
  const delayMs = options?.delayMs ?? 20;
  const charsPerTick = options?.charsPerTick ?? 2;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/ask?${params.toString()}`, {
      method: "GET",
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the backend running?");
  }

  if (!res.ok) {
    const text = await res.text();
    let detail = `Request failed (${res.status})`;
    try {
      const parsed = JSON.parse(text);
      detail = parsed.detail || parsed.message || detail;
    } catch {
      if (text) detail = text;
    }
    throw new ApiError(detail, res.status);
  }

  if (!res.body) {
    onChunk(await res.text());
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  // Queue that decouples network arrival speed from display speed.
  let buffer = "";
  let streamDone = false;

  const pump = (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        streamDone = true;
        break;
      }
      buffer += decoder.decode(value, { stream: true });
    }
  })();

  const drip = (async () => {
    while (!streamDone || buffer.length > 0) {
      if (buffer.length > 0) {
        const piece = buffer.slice(0, charsPerTick);
        buffer = buffer.slice(charsPerTick);
        onChunk(piece);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  })();

  await Promise.all([pump, drip]);
}

export { ApiError };
