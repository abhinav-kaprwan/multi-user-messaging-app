import type { Metadata } from "next";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import AuthContext from "./context/AuthContext";


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
      <body>
        <AuthContext>
          <ToasterContext/>
          {children}
        </AuthContext>
        </body>
    </html>
  );
}
