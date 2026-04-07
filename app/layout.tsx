import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zellers Chocolates — AI Avurudu",
  description:
    "Transform into a legendary AI Avurudu Kumara or Kumariya with Zellers Chocolates. Create your royal avatar and win big!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-transparent`}
    >
      <body className="min-h-full flex flex-col">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
