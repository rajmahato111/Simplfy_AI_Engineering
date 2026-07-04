import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Simplify AI Engineering",
    template: "%s · Simplify AI Engineering",
  },
  description:
    "AI-native learning and interview prep for AI engineering — Hello Interview, for AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
