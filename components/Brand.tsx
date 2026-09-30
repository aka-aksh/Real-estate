import Link from "next/link";

export default function Brand() {
  return <Link href="/" aria-label="Trust-Estate dashboard" className="inline-flex items-center gap-2 font-semibold tracking-tight text-white">
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-emerald-400">
      <path d="M16 2.8 28 7.2v8.7c0 7.2-4.9 11.5-12 14.2C8.9 27.4 4 23.1 4 15.9V7.2l12-4.4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9 15 7-5.5 7 5.5v7h-5v-5h-4v5H9v-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
    <span>Trust-Estate</span>
  </Link>;
}
