"use client";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import MenuBar from "@/app/employee/menubar";
import Header from "@/app/employee/header";
import {useEffect} from "react";

const inter = Roboto({
  subsets: ["vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    useEffect(() => {
        if (!localStorage.getItem("employee")) {
            window.location.href = "/employee-login";
        }
    }, []);
    return (
        <html lang="en">
        <Toaster />
        <div className={inter.className}>
            <div className="flex min-h-screen w-full">
                <MenuBar/>
                <div className="flex flex-col w-full min-h-screen">
                    <Header hrefInfo="/employee/info" hrefLogin="/employee-login"/>
                    <div className="flex flex-col w-full min-h-screen">
                        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
        </html>
    );
}
