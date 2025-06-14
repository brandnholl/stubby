"use server"

import { shortenUrl } from "@/lib/kv"

export async function handleShortenUrl(originalUrl: string) {
  return await shortenUrl(originalUrl)
}
