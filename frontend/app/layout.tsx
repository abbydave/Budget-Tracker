import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { inter } from "./font";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Finance Flow",
    template: "%s · Finance Flow",
  },
  description:
    "Finance Flow is a personal finance app that helps you track income and expenses, set monthly budgets, and gain insights into your spending through clear summaries and visual analytics.",
  applicationName: "Finance Flow",
  metadataBase: new URL("https://financeflow-nithub.vercel.app"),
  openGraph: {
    title: "Finance Flow",
    description:
      "Track income, manage expenses, set monthly budgets, and understand your spending with visual insights.",
    url: "https://financeflow-nithub.vercel.app",
    siteName: "Finance Flow",
    images: [
      {
        url: "https://res.cloudinary.com/dtgigdp2j/image/upload/v1766106550/random/logo_jgjevu.png",
        width: 1200,
        height: 630,
        alt: "Finance Flow logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Flow",
    description:
      "A modern personal finance app for tracking expenses, budgeting monthly, and visualizing spending habits.",
    images: [
      "https://res.cloudinary.com/dtgigdp2j/image/upload/v1766106550/random/logo_jgjevu.png",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          inter.className,
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-background text-foreground",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}