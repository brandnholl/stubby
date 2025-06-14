import { getOriginalUrl } from "@/lib/kv";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Params {
  shortCode: string;
}

export default async function RedirectPage({ params }: { params: Promise<Params> }) {
  const { shortCode } = await params;
  const originalUrl = await getOriginalUrl(shortCode);

  if (!originalUrl) {
    return (
      <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-gray-600">link not found</p>
          <Link href="/" className="text-black underline hover:text-gray-600">
            go back home
          </Link>
        </div>
      </div>
    );
  }

  redirect(originalUrl);
}
