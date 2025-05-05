import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider, SpinWheelProvider } from "@/providers";

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
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-md mx-auto font-[family-name:var(--font-geist-sans)]`}
      >
        <AuthProvider>
          <SpinWheelProvider>
            <div className="flex flex-col min-h-screen p-8">
              <Header />
              <main className="w-full max-w-md flex-grow">{children}</main>
              <footer className="flex gap-4 flex-wrap items-center justify-center py-6 text-xs text-gray-500 mt-auto">
                <p className="flex items-center">
                  <span>©</span> Copyright 2023. Công ty TNHH TM S.Home Solution
                </p>
              </footer>
            </div>
          </SpinWheelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
