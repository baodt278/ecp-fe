import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import {toast} from "@/components/ui/use-toast";
import {getInfo, updateInfo, uploadAvatar} from "@/api/admin";
import {useEffect, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {translateType} from "@/utils/common";

export default function Account({loading, setLoading, username}: {
    loading: boolean,
    setLoading: Function,
    username: string
}) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(null);
    // @ts-ignore
    const role = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).role : [""];

    const getAccount = async () => {
        const response = getInfo(username).then((res) => {
            setFullName(res.data.data.fullName);
            setEmail(res.data.data.email);
            setPhone(res.data.data.phone);
            setAddress(res.data.data.address);
            setImageUrl(res.data.data.avatar);
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
    };

    useEffect(() => {
        getAccount();
    }, []);

    const handleUpdate = () => {
        setLoading(true);
        const data = {
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
        };
        const response = updateInfo(username, data).then((response) => {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            setLoading(false);
            getAccount();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
            setLoading(false);
        });
    }
    const handleUpload = async () => {
        // @ts-ignore
        const response = await uploadAvatar(username, image);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            setOpen(false);
            await getAccount();
            // @ts-ignore
            let admin = JSON.parse(localStorage.getItem('admin'));
            admin.avatar = imageUrl;
            localStorage.setItem('admin', JSON.stringify(admin));
        } else {
            setOpen(false);
            toast({
                variant: "destructive",
                title: "Thất bại",
                description: response.data.data,
            });
        }
    };
    return (
        <Card className="space-y-2 grid grid-cols-10">
            <CardHeader className="col-span-3">
                <CardTitle>Tài khoản</CardTitle>
                <CardDescription>
                    Bạn có thể thay đổi thông tin của mình ở đây.
                </CardDescription>
                <div className="flex flex-col items-center justify-center py-3">
                    <Popover onOpenChange={setOpen} open={open}>
                        <PopoverTrigger asChild>
                            <Avatar className="h-24 w-24">
                                <AvatarImage alt="@user" src={imageUrl}/>
                                <AvatarFallback>Ảnh</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[300px] p-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Đổi ảnh đại diện</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Chọn ảnh để tải lên.</p>
                                </div>
                                <div className="grid gap-2">
                                    <Input type="file" onChange={(e) => {
                                        // @ts-ignore
                                        setImage(e.target.files);
                                    }}/>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                                        <Button onClick={handleUpload}>Lưu</Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                        <span className="font-semibold flex flex-col items-center justify-center">
                        <Badge variant='default'>{translateType(role)}</Badge>
                        <p>@{username}</p>
                        </span>
                    </Popover>
                </div>
            </CardHeader>
            <div className="col-span-6 py-20">
                <CardContent>
                    <div className="space-y-1">
                        <Label htmlFor="fullName">Tên đầy đủ</Label>
                        <Input
                            className="w-full"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            className="w-full"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                            className="w-full"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            className="w-full"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <LoadingButton loading={loading} onClick={handleUpdate}>Lưu thay đổi</LoadingButton>
                </CardFooter>
            </div>
        </Card>
    )
}