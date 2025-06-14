"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sha256 } from "js-sha256";

function generateShortCode(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getBaseUrl(): string {
  const url = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://stbby.link";
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export async function shortenUrl(originalUrl: string) {
  if (!originalUrl || !isValidUrl(originalUrl)) {
    return { success: false, error: "Please enter a valid URL" };
  }

  const normalizedUrl = originalUrl.endsWith('/') ? originalUrl.slice(0, -1) : originalUrl;
  
  const kv = getCloudflareContext().env.kv;
  const hash = sha256(normalizedUrl);
  const existingShortCode = await kv.get(`hash:${hash}`);

  const baseUrl = getBaseUrl();

  if (existingShortCode) {
    return {
      success: true,
      shortUrl: `${baseUrl}/${existingShortCode}`,
    };
  }

  let shortCode = generateShortCode();
  while (await kv.get(`short:${shortCode}`)) {
    shortCode = generateShortCode();
  }

  await kv.put(`short:${shortCode}`, normalizedUrl);
  await kv.put(`hash:${hash}`, shortCode);

  return {
    success: true,
    shortUrl: `${baseUrl}/${shortCode}`,
  };
}

export async function getOriginalUrl(
  shortCode: string
): Promise<string | null> {
  const kv = getCloudflareContext().env.kv;
  return await kv.get(`short:${shortCode}`);
}
