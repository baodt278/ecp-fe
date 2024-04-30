"use client";
import Header from "@/app/client/header";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import ChangePassword from "@/app/client/info/password";
import RequestVerify from "@/app/client/info/verify";
import Account from "@/app/client/info/account";

export default function ClientInfo() {
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const username = localStorage.getItem("client") ? JSON.parse(localStorage.getItem("client")).username : "";
    return (
        <>
            <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                <Tabs defaultValue="account" className="w-full">
                    <TabsList>
                        <TabsTrigger value="account">Tài khoản</TabsTrigger>
                        <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                        <TabsTrigger value="verify">Xác minh tài khoản</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                    <Account loading={loading} setLoading={setLoading} username={username}/>
                    </TabsContent>
                    <TabsContent value="password">
                    <ChangePassword loading={loading} username={username}/>
                    </TabsContent>
                    <TabsContent value="verify">
                    <RequestVerify loading={loading} setLoading={setLoading} username={username}/>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    );
}
