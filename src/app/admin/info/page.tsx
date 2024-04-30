"use client";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Account from "@/app/admin/info/account";
import ChangePassword from "@/app/admin/info/password";
import {useState} from "react";

export default function AdminInfo() {
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const username = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).username : "";
    return (
        <>
            <Tabs defaultValue="account" className="w-full">
                <TabsList>
                    <TabsTrigger value="account">Tài khoản</TabsTrigger>
                    <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Account loading={loading} setLoading={setLoading} username={username}/>
                </TabsContent>
                <TabsContent value="password">
                    <ChangePassword loading={loading} username={username}/>
                </TabsContent>
            </Tabs>
        </>
    );
}
