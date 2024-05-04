"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {RegisterBody} from "@/schema/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {registerClient} from "@/api/auth";
import {useToast} from "@/components/ui/use-toast";
import Link from "next/link";
import {useState} from "react";
import {LoadingButton} from "@/components/ui/loading-button";

export default function ClienRegister() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof RegisterBody>>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof RegisterBody>) {
        setLoading(true);
        const response = await registerClient(values);
        if (response.data.code === 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            router.push("/client-login");
        } else {
            form.setError("email", {
                type: "manual",
                message: "",
            });
            form.setError("username", {
                type: "manual",
                message: "",
            });
            form.setError("password", {
                type: "manual",
                message: "",
            });
            form.setError("confirmPassword", {
                type: "manual",
                message: "",
            });
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: response.data.data,
            });
        }
        setLoading(false);
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng ký</CardTitle>
                    <CardDescription>Nhập thông tin của bạn để tiếp tục</CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                            noValidate>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem className="grid gap-2 pb-2">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem className="grid gap-2 pb-2">
                                        <FormLabel>Tên đăng nhập</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập thông tin tài khoản"
                                                type="username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem className="grid gap-2 pb-2">
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập thông tin mật khẩu"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem className="grid gap-2 pb-2">
                                        <FormLabel>Nhập lại mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Xác nhận lại mật khẩu"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <LoadingButton className="w-full" type="submit" loading={loading}>
                                Đăng ký
                            </LoadingButton>
                            <div className="mt-4 text-center text-sm">
                                Đã có tài khoản?{" "}
                                <Link href="/client-login" className="underline">
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
