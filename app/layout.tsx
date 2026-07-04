import "./globals.css";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Simplify AI Engineering",
  description:
    "AI-native learning and interview prep for AI engineering — Hello Interview, for AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
