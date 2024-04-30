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
import {LoginBody} from "@/schema/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {loginEmployee} from "@/api/auth";
import {useToast} from "@/components/ui/use-toast";
import {useState} from "react";
import {LoadingButton} from "@/components/ui/loading-button";
import Link from "next/link";

export default function EmployeeLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();
    const form = useForm<z.infer<typeof LoginBody>>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof LoginBody>) {
        setLoading(true);
        const response = await loginEmployee(values);
        if (response.data.code === 200) {
            localStorage.setItem("employee", JSON.stringify(response.data.data));
            router.push("/employee");
        } else {
            form.setError("username", {
                type: "manual",
                message: "",
            });
            form.setError("password", {
                type: "munual",
                message: "",
            });
            toast({
                variant: "destructive",
                title: "Đăng nhập thất bại",
                description: response.data.data,
            });
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Nhân viên</CardTitle>
                    <CardDescription>
                        Nhập thông tin đăng nhập của bạn để tiếp tục
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                            noValidate>
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
                                        <div className="flex flex-row justify-between items-center">
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <Link onClick={() => localStorage.setItem("type", "employee")}
                                                  href={"/forgot-password"} className="underline text-sm font-medium">Lấy lại mật khẩu</Link>
                                        </div>
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
                            <LoadingButton className="w-full" type="submit" loading={loading}>
                                Đăng nhập
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
