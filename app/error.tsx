"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-lg py-16 text-center">
    <h1 className="text-xl font-semibold">Something went wrong</h1>
    <p className="mt-2 text-sm text-gray-600">Your saved leads remain in this browser. Try loading the page again.</p>
    <button onClick={reset} className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Try again</button>
  </main>;
}
