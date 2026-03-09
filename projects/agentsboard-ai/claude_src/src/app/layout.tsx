import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AgentsBoard.ai — The $5M Agent Board",
  description:
    "The first machine-readable directory of the AI agent economy. Agents pay USDC to claim tiles, build verifiable profiles, and become discoverable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>
        {children}
      </body>
    </html>
  );
}
