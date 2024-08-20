import type { Metadata } from "next";
import ToasterContext from "./context/ToasterContext";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "realtime chat App",
  description: "realtime chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext/>
        {children}
        </body>
    </html>
  );
}
