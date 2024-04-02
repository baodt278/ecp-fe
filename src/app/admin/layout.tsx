import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import MenuBar from "@/app/admin/menubar-admin";

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
