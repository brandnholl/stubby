"use client";

import React, { useState } from "react";
import { shortenUrl } from "@/lib/kv"; // your server action function

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError("");
    setShortUrl("");

    try {
      const result = await shortenUrl(url);

      if (result.success) {
        setShortUrl(result.shortUrl!);
      } else {
        setError(result.error || "Unknown error");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
    } catch {
      // fallback copy
      const textarea = document.createElement("textarea");
      textarea.value = shortUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm mb-2 text-gray-700 font-medium"
          >
            Enter URL:
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/here"
            className="bg-white rounded-md border-black text-black placeholder:text-gray-400 font-mono focus:border-gray-600 focus:ring-gray-600 w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-black text-white hover:bg-gray-800 font-mono font-bold rounded-md disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Shorten"}
        </button>
      </form>

      {error && (
        <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
          <p className="font-mono text-sm">Error: {error}</p>
        </div>
      )}
      {shortUrl && (
        <div className="space-y-4 p-4 border border-black rounded bg-gray-50">
          <p className="text-gray-700 text-sm font-medium">
            Your shortened URL:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <p className="border-black rounded-md text-black font-mono w-full">
              {shortUrl}
            </p>
            <button
              onClick={copyToClipboard}
              className="bg-black text-white rounded-md sm:w-36 hover:bg-gray-800 font-mono font-bold px-6"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
