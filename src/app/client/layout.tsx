"use client";
import {Roboto} from "next/font/google";
import {Toaster} from "@/components/ui/toaster";
import MenuBar from "@/app/client/menubar";
import Header from "@/app/client/header";
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
        if (!localStorage.getItem("client")) {
            window.location.href = "/client-login";
        }
    }, []);
    return (
        <html lang="en">
        <Toaster/>
        <div className={inter.className}>
            <div className="flex min-h-screen w-full">
                <MenuBar/>
                <div className="flex flex-col w-full min-h-screen">
                    <Header hrefInfo="/client/info" hrefLogin="/client-login"/>
                    {children}
                </div>
            </div>
        </div>
        </html>
    );
}
