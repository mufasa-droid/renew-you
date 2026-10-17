import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#5E44B3",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Renew You — Pause. Reflect. Renew.",
  description:
    "A private, mindful sanctuary to explore your emotions, find clarity, and recognize your personal growth.",
  icons: {
    icon: "/brand/lotus-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-sanctuary-bg text-sanctuary-text-primary antialiased selection:bg-brand-purple-light selection:text-brand-purple">
        {children}
      </body>
    </html>
  );
}
