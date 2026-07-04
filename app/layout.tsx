import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { siteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Simplify AI Engineering",
    template: "%s · Simplify AI Engineering",
  },
  description:
    "AI-native learning and interview prep for AI engineering — Hello Interview, for AI.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Simplify AI Engineering",
  },
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
