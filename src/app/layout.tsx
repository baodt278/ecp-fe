import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Roboto } from "next/font/google";
import "./globals.css";

const inter = Roboto({
  subsets: ["vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {children}
        </body>
    </html>
  );
}
