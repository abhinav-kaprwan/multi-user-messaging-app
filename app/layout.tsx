import type { Metadata } from "next";
import ToasterContext from "./context/ToasterContext";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "./context/AuthContext";

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
        <AuthContext>
          <ToasterContext/>
          {children}
        </AuthContext>
        </body>
    </html>
  );
}
