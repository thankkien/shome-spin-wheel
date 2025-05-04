import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SHome's 7th Birthday",
  description: "Lucky spin to celebrate SHome's 7th Birthday",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-md mx-auto`}
      >
        <div className="mobile-container">
          <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <header className="py-4">
              <Image
                src="/logo.svg"
                alt="SHome logo"
                width={180}
                height={38}
                priority
              />
            </header>
            <main className="w-full max-w-md">
              {children}
            </main>
            <footer className="flex gap-4 flex-wrap items-center justify-center py-6 text-xs text-gray-500">
              <p className="flex items-center">
                <span>©</span> Copyright 2023. Công ty TNHH TM S.Home Solution
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
