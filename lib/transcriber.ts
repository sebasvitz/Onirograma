import OpenAI from "openai";
import { toFile } from "openai";

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string,
  apiKey: string
): Promise<string> {
  const client = new OpenAI({ apiKey });

  const file = await toFile(audioBuffer, filename, {
    type: getMimeType(filename),
  });

  // When response_format is "text", the SDK returns a plain string.
  // The TypeScript overloads require an explicit cast here.
  const result = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "es",
    response_format: "text",
  });

  return (result as string).trim();
}

function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    mp4: "audio/mp4",
    mpeg: "audio/mpeg",
    mpga: "audio/mpeg",
    m4a: "audio/mp4",
    wav: "audio/wav",
    webm: "audio/webm",
    ogg: "audio/ogg",
    flac: "audio/flac",
  };
  return mimeTypes[ext ?? ""] ?? "audio/webm";
}
