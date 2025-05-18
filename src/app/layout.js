import { Be_Vietnam_Pro, Amatic_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

const amaticSc = Amatic_SC({
  variable: "--font-amatic-sc",
  subsets: ["vietnamese"],
  weight: ["400", "700"],
  preload: true,
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
    icon: "/assets/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased min-w-sm max-w-md mx-auto min-h-screen p-2 flex flex-col w-[100vw]",
          beVietnamPro.variable,
          amaticSc.variable
        )}
      >
        <Header />
        <main className="w-full flex-grow">{children}</main>
        <footer className="flex gap-4 flex-wrap items-center justify-center py-6 text-xs text-muted-foreground mt-auto">
          <p className="flex items-center">
            <span>©</span> Copyright 2023. Công ty TNHH TM S.Home Solution
          </p>
        </footer>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
