import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ToastContainer from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masal — Lead Copilot",
  description: "AI-powered real estate lead ranking and management",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
          <nav className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="text-lg font-bold text-blue-600">
              Masal
            </Link>
            <div className="flex gap-4 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/today" className="hover:text-blue-600">
                Today
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
