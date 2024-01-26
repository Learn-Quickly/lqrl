import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/app-nav";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LQRL",
  description: "Learn Quickly ⚡️ Remember Longly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-dvh flex-col bg-stone-100 font-sans text-stone-900 antialiased md:h-dvh md:max-h-dvh md:flex-row",
          fontSans.variable,
        )}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
