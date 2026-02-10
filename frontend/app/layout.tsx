import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Pattern from "@/components/Pattern/Pattern";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delete Background",
  description: "Delete background in your photo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Pattern />
        {children}
      </body>
    </html>
  );
}
