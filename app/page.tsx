import { ShortenForm } from "@/components/short-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Stubby</h1>
          <p className="text-gray-600">a simple url shortener</p>
        </div>

        <div className="border border-black rounded-lg p-8 bg-white">
          <ShortenForm />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>paste your long url above and get a short one back. no strings attached.</p>
        </div>
      </div>
    </div>
  );
}
