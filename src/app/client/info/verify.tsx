import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {translateType} from "@/utils/common";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";
import {deleteRequest, requestVerify, verifyAccount} from "@/api/client";
import {toast} from "@/components/ui/use-toast";
import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";

export default function RequestVerify({loading, setLoading, username}: {
    loading: boolean,
    setLoading: Function,
    username: string
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);
    const [requests, setRequests] = useState([]);
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const getData = async () => {
        // @ts-ignore
        const response = requestVerify(username).then((response) => {
            setRequests(response.data.data);
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
    };
    const switchBadge = (status) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline">
                    Đang chờ
                </Badge>;
            case "APPROVED":
                return <Badge variant="default">Đã chấp nhận</Badge>;
            case "REJECTED":
                return <Badge variant="destructive">Đã từ chối</Badge>;
            default:
                return <Badge variant="secondary">Đã xét duyệt</Badge>;
        }
    }

    const handleVerify = async () => {
        setLoading(true);
        // @ts-ignore
        const response = await verifyAccount(username, image);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            await getData();
            setLoading(false);
        } else {
            toast({
                variant: "destructive",
                title: "Thất bại",
                description: response.data.data,
            });
        }
    };
    const handleRowClick = (request: any) => {
        setSelectedRequest(request);
        setImages(request.imageUrls);
        setIsDialogOpen(true);
    };
    const handleDeleteRequest = async () => {
        // @ts-ignore
        const response = await deleteRequest(username, selectedRequest.code);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Thất bại",
                description: response.data.data,
            });
        }
        setIsDialogOpen(false);
        await getData();
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Xác minh tài khoản</CardTitle>
                    <CardDescription>
                        Để sử dụng các tính năng của ứng dụng, người dùng cần xác minh
                        tài khoản bằng Căn cước công dân <br/>
                        Sau khi xác minh từ hệ thống, bạn sẽ nhận được thông báo qua
                        email.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5 grid-cols-3">
                        <Input
                            id="picture"
                            type="file"
                            className="col-span-2"
                            onChange={(e) => {
                                // @ts-ignore
                                setImage(e.target.files);
                            }}
                        />
                        <LoadingButton onClick={handleVerify} loading={loading}>Xác minh</LoadingButton>
                    </div>
                    <div className="space-y-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã</TableHead>
                                    <TableHead>Loại yêu cầu</TableHead>
                                    <TableHead>Ngày yêu cầu</TableHead>
                                    <TableHead>Ngày phê duyệt</TableHead>
                                    <TableHead>Người phê duyệt</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow
                                        key={request.code}
                                        onClick={() => handleRowClick(request)}>
                                        <TableCell>{request.code}</TableCell>
                                        <TableCell>{translateType(request.type)}</TableCell>
                                        <TableCell>{request.createdAt}</TableCell>
                                        <TableCell>{request.acceptedAt}</TableCell>
                                        <TableCell>{request.acceptedBy}</TableCell>
                                        <TableCell>{switchBadge(request.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Chi tiết yêu cầu</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Mã</Label>
                                <Input
                                    disabled
                                    defaultValue={selectedRequest.code}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Trạng thái</Label>
                                <Input
                                    disabled
                                    defaultValue={translateType(selectedRequest.status)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Ngày tạo</Label>
                                <Input
                                    disabled
                                    defaultValue={selectedRequest.createdAt}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Mô tả</Label>
                                <Textarea
                                    disabled
                                    defaultValue={selectedRequest.description}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Thông tin</Label>
                                <Textarea
                                    disabled
                                    defaultValue={selectedRequest.info}
                                    className="col-span-3 h-[120px]"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center">
                                <Label htmlFor="picture" className="text-left">
                                    Ảnh
                                </Label>
                                {images != null &&
                                    images.map((image) => (
                                        <Image
                                            className="col-span-3"
                                            key={image}
                                            src={image}
                                            width={500}
                                            height={500}
                                            alt="Picture of the author"
                                        />
                                    ))}

                                {images == null && (
                                    <Input
                                        multiple
                                        disabled
                                        className="col-span-3"
                                        id="picture"
                                        type="file"
                                    />
                                )}
                            </div>
                            {selectedRequest.status !== "PENDING" && (
                                <>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-left">Người phê duyệt</Label>
                                        <Input
                                            disabled
                                            defaultValue={selectedRequest.acceptedBy}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-left">Ngày phê duyệt</Label>
                                        <Input
                                            disabled
                                            defaultValue={selectedRequest.acceptedAt}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-left">Phản hồi</Label>
                                        <Textarea
                                            disabled
                                            defaultValue={selectedRequest.acceptText}
                                            className="col-span-3"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            {selectedRequest.status === "PENDING" && (
                                <>
                                    <LoadingButton
                                        type="submit"
                                        variant="destructive"
                                        onClick={handleDeleteRequest}>
                                        Xoá yêu cầu
                                    </LoadingButton>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}</>
    );
}