"use client";
import Header from "@/components/custom/header";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Account from "@/app/employee/info/account";
import ChangePassword from "@/app/employee/info/password";
import {useState} from "react";

export default function AdminInfo() {
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const username = JSON.parse(localStorage.getItem("employee")) ? JSON.parse(localStorage.getItem("employee")).username : "";
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
