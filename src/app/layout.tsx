import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/crt.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echoes of the Void | Kiroween 2025",
  description: "A retro horror text adventure powered by AI. Can you survive the void?",
  keywords: ["Horror", "AI Game", "Text Adventure", "Kiroween", "Next.js"],
  themeColor: "#00ff00",
  openGraph: {
    title: "Echoes of the Void | Kiroween 2025",
    description: "A retro horror text adventure powered by AI. Can you survive the void?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Echoes of the Void | Kiroween 2025",
    description: "A retro horror text adventure powered by AI. Can you survive the void?",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00ff00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
