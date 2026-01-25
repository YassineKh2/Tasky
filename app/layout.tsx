import type { Metadata } from "next";
import { Caveat, Crimson_Text } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-handwriting",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
  variable: "--font-serif-text",
});

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Task tracking and journal management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${caveat.variable} ${crimsonText.variable}`}>
      <body>{children}</body>
    </html>
  );
}
