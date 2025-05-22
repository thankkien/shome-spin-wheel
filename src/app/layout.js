import { Be_Vietnam_Pro, Amatic_SC } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { cn } from "@/utils/classname";

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
      <ClientLayout className={cn(beVietnamPro.variable, amaticSc.variable)}>
        {children}
      </ClientLayout>
    </html>
  );
}
