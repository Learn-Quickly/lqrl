import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/app-nav";
import { Providers } from "@/app/providers";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lqrl.vercel.app/"),
  title: "LQRL",
  description: "Learn Quickly ⚡️ Remember Longly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-dvh md:max-h-dvh md:overflow-hidden">
      <body
        className={cn(
          "flex min-h-dvh flex-col bg-stone-100 font-sans text-stone-900 antialiased md:h-dvh md:max-h-dvh md:flex-row",
          fontSans.variable,
        )}
      >
        <Providers>
          <Suspense>
            <Navigation />
            <div className="w-full max-w-full overflow-y-auto">{children}</div>
            <Toaster />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
