import Link from "next/link";

export default function NotFound() {
  return <main className="py-16 text-center">
    <h1 className="text-2xl font-bold">Page not found</h1>
    <p className="mt-2 text-sm text-gray-600">That page may have moved or the address may be incorrect.</p>
    <Link href="/" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white">Back to Dashboard</Link>
  </main>;
}
