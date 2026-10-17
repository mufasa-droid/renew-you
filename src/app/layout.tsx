import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-sanctuary-bg text-sanctuary-text-primary antialiased selection:bg-brand-purple-light selection:text-brand-purple">
        {children}
      </body>
    </html>
  );
}
