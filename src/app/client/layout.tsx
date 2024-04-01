import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import MenuBar from "@/app/client/menubar-client";
import Header from "@/components/custom/header";

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
      <Toaster />
      <div className={inter.className}>
        <div className="flex min-h-screen w-full">
          <MenuBar />
          {children}
        </div>
      </div>
    </html>
  );
}
