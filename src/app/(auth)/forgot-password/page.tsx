"use client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {LoadingButton} from "@/components/ui/loading-button";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {forgotPassword} from "@/api/auth";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const type = localStorage.getItem("type");
    const goBack = (type) => {
        if (type === "client") {
            return "/client-login";
        } else if (type === "employee") {
            return "/employee-login";
        } else {
            return "/admin-login";
        }
    }
    const onSubmit = async () => {
        setLoading(true);
        // @ts-ignore
        const response = await forgotPassword(email, type);
        if (response.data.code === 200) {
            toast({
                variant: "default",
                title: "Kiểm tra email",
                description: "Vui lòng kiểm tra email để lấy lại mật khẩu",
            });
            router.push(goBack(type));
        } else {
            toast({
                variant: "destructive",
                title: "Lấy lại mật khẩu thất bại",
                description: response.data.data,
            });
        }
        setLoading(false);
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Lấy lại mật khẩu</CardTitle>
                    <CardDescription>
                        Nhập email đã đăng ký tài khoản để tiếp tục
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input placeholder="Nhập email" type="email" onChange={(e) => setEmail(e.target.value)}/>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <LoadingButton className="w-full" loading={loading} onClick={onSubmit}>Lấy lại mật khẩu </LoadingButton>
                    <div className="mt-4 text-center text-sm">
                        Quay lại{" "}
                        <Link href={goBack(type)} className="underline">
                            Đăng nhập
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}