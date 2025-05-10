import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "SHome's 7th Birthday",
  description: "Lucky spin to celebrate SHome's 7th Birthday",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased max-w-md mx-auto min-h-screen p-2 flex flex-col",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <Header />
        <main className="w-full flex-grow">{children}</main>
        <footer className="flex gap-4 flex-wrap items-center justify-center py-6 text-xs text-muted-foreground mt-auto">
          <p className="flex items-center">
            <span>©</span> Copyright 2023. Công ty TNHH TM S.Home Solution
          </p>
        </footer>
      </body>
    </html>
  );
}
