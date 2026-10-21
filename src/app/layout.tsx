import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
    <html lang="en" className={`h-full ${plusJakartaSans.variable}`}>
      <body className="min-h-full flex flex-col font-sans tracking-normal bg-sanctuary-bg text-sanctuary-text-primary antialiased selection:bg-brand-purple-light selection:text-brand-purple">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#4E31AA] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C4AB6]"
        >
          Skip to main content
        </a>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

