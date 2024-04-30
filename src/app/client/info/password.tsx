import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import {useState} from "react";
import {changePassword} from "@/api/client";
import {useRouter} from "next/navigation";
import {toast} from "@/components/ui/use-toast";

export default function ChangePassword({loading, username}: { loading: boolean, username: string }) {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [renewPassword, setRenewPassword] = useState("");
    const handleChangePassword = () => {
        const data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            renewPassword: renewPassword
        }
        const response = changePassword(username, data).then(() => {
            localStorage.clear();
            router.push("/client-login");
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        })
    }
    return (
        <Card className="grid grid-cols-10">
            <CardHeader className="col-span-3">
                <CardTitle>Mật khẩu</CardTitle>
                <CardDescription>
                    Đổi mật khẩu của bạn ở đây. Sau khi thành đổi, tài khoản sẽ tự
                    động đăng xuất.
                </CardDescription>
            </CardHeader>
            <div className="col-span-6 py-6">
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="current">Mật khẩu cũ</Label>
                        <Input  type="password" placeholder="Nhập mật khẩu cũ"
                                onChange={(e) => setOldPassword(e.target.value)}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new">Mật khẩu mới</Label>
                        <Input type="password" placeholder="Nhập mật khẩu mới"
                               onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new">Nhập lại mật khẩu</Label>
                        <Input type="password" placeholder="Nhập lại mật khẩu"
                               onChange={(e) => setRenewPassword(e.target.value)}/>
                    </div>
                </CardContent>
                <CardFooter>
                    <LoadingButton loading={loading} onClick={handleChangePassword}>
                        Lưu thay đổi
                    </LoadingButton>
                </CardFooter>
            </div>
        </Card>
    )
}