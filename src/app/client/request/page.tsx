"use client";
import Header from "@/app/client/header";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog";
import {useEffect, useState} from "react";
import {CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import {convertString, translateType} from "@/utils/common";
import {
    deleteRequest,
    getRequests,
    updateRequest,
} from "@/api/client";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";
import {toast} from "@/components/ui/use-toast";
import CreateRequest from "./create-request";
import {Badge} from "@/components/ui/badge";

export default function ClientRequest() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);
    const [username, setUsername] = useState("");
    const [requests, setRequests] = useState([]);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [imageUrls, setImageUrls] = useState([]);

    const getData = async () => {
        const username = JSON.parse(localStorage.getItem("client")).username;
        setUsername(username);
        const response = await getRequests(username);
        if (response.data.code == 200) {
            setRequests(response.data.data);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setImages(request.imageUrls);
        setIsDialogOpen(true);
    };

    const handleDeleteRequest = async () => {
        console.log(username);
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
        getData();
    };

    const handleUpdateRequest = async () => {
        const formData = new FormData();
        formData.append("code", selectedRequest.code);
        formData.append("description", description);
        for (let i = 0; i < imageUrls.length; i++) {
            const file = imageUrls[i];
            formData.append(`images[${i}]`, file);
        }

        const response = await updateRequest(username, formData);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Cập nhật yêu cầu thành công",
                description: response.data.data,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Cập nhật yêu cầu thất bại",
                description: response.data.data,
            });
        }
        setIsDialogOpen(false);
        getData();
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
    return (
        <>
            <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Yêu cầu</CardTitle>
                            <CreateRequest onCreateRequest={() => getData()}/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã</TableHead>
                                    <TableHead>Mã công ty</TableHead>
                                    <TableHead>Loại yêu cầu</TableHead>
                                    <TableHead>Ngày yêu cầu</TableHead>
                                    <TableHead>Ngày xét duyệt</TableHead>
                                    <TableHead>Ngày duyệt</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow
                                        key={request.code}
                                        onClick={() => handleRowClick(request)}>
                                        <TableCell>{request.code}</TableCell>
                                        <TableCell>{request.companyAcronym}</TableCell>
                                        <TableCell>{translateType(request.type)}</TableCell>
                                        <TableCell>{request.createdAt}</TableCell>
                                        <TableCell>{request.reviewedAt}</TableCell>
                                        <TableCell>{request.acceptedAt}</TableCell>
                                        <TableCell>{switchBadge(request.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {isDialogOpen && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Chi tiết yêu cầu</DialogTitle>
                                        <DialogDescription>
                                            Khi yêu cầu ở trạng thái &quot;Đang chờ&quot;, bạn có thể
                                            thay đổi mô tả và hình ảnh liên quan. Đối với các yêu cầu
                                            liên quan đến hợp đồng thì không thể thay đổi thông tin.
                                        </DialogDescription>
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
                                            <Label className="text-left">Mã công ty</Label>
                                            <Input
                                                disabled
                                                defaultValue={selectedRequest.companyAcronym}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Loại yêu cầu</Label>
                                            <Input
                                                disabled
                                                defaultValue={translateType(selectedRequest.type)}
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
                                                disabled={selectedRequest.status !== "PENDING"}
                                                defaultValue={selectedRequest.description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                        {selectedRequest.type.includes("CONTRACT_") && (
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Thông tin</Label>
                                                <Textarea
                                                    disabled
                                                    defaultValue={convertString(selectedRequest.info)}
                                                    className="col-span-3 h-[120px]"
                                                />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-4 items-center">
                                            <Label htmlFor="picture" className="text-left">
                                                Ảnh
                                            </Label>
                                            {images != null &&
                                                images.map((image) => (
                                                    <Image
                                                        className="flex flex-end px-1"
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
                                                    disabled={selectedRequest.status !== "PENDING"}
                                                    className="col-span-3"
                                                    id="picture"
                                                    type="file"
                                                    onChange={(e) => {
                                                        setImageUrls(e.target.files);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {selectedRequest.status !== "PENDING" && (
                                            <>
                                                {selectedRequest.type !== "EMERGENCY" &&
                                                    selectedRequest.type !== "ADVICE" &&
                                                    selectedRequest.type !== "QUESTION" && (
                                                        <>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label className="text-left">
                                                                    Người xét duyệt
                                                                </Label>
                                                                <Input
                                                                    disabled
                                                                    defaultValue={selectedRequest.reviewedBy}
                                                                    className="col-span-3"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label className="text-left">
                                                                    Ngày xét duyệt
                                                                </Label>
                                                                <Input
                                                                    disabled
                                                                    defaultValue={selectedRequest.reviewedAt}
                                                                    className="col-span-3"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label className="text-left">Phản hồi</Label>
                                                                <Textarea
                                                                    disabled
                                                                    defaultValue={selectedRequest.reviewText}
                                                                    className="col-span-3"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                {(selectedRequest.status === "APPROVED" || selectedRequest.acceptedAt !== null) && (
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
                                            </>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        {selectedRequest.status === "PENDING" && (
                                            <>
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    onClick={handleDeleteRequest}>
                                                    Xoá yêu cầu
                                                </Button>
                                                <Button type="submit" onClick={handleUpdateRequest}>
                                                    Lưu thay đổi
                                                </Button>
                                            </>
                                        )}
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardContent>
                </Card>
            </main>
        </>
    );
}