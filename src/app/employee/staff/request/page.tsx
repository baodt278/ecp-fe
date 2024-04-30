"use client";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import {convertString, translateType} from "@/utils/common";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";
import {toast} from "@/components/ui/use-toast";
import {getRequestsForStaff, reviewRequest} from "@/api/employee";
import {Badge} from "@/components/ui/badge";

export default function EmployeeRequest() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);
    const username = JSON.parse(localStorage.getItem("employee")).username;
    const [requests, setRequests] = useState([]);
    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const [type, setType] = useState("");
    const getData = async () => {
        const acrnoym = await JSON.parse(localStorage.getItem("employee")).acronymCompany;
        const response = await getRequestsForStaff(acrnoym);
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

    const handleUpdateRequest = async () => {
        const data = {
            code: selectedRequest.code,
            status: type,
            text: text,
        };
        console.log(data);
        const response = await reviewRequest(username, data);
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
        setIsDialogOpen2(false);
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
            <Card>
                <CardHeader>
                    <CardTitle>Xét duyệt yêu cầu</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã</TableHead>
                                <TableHead>Người yêu cầu</TableHead>
                                <TableHead>Loại yêu cầu</TableHead>
                                <TableHead>Ngày yêu cầu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow
                                    key={request.code}
                                    onClick={() => handleRowClick(request)}>
                                    <TableCell>{request.code}</TableCell>
                                    <TableCell>{request.usernameClient}</TableCell>
                                    <TableCell>{translateType(request.type)}</TableCell>
                                    <TableCell>{request.createdAt}</TableCell>
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
                                        Xét duyệt yêu cầu của người dùng.
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
                                        <Label className="text-left">Người yêu cầu</Label>
                                        <Input
                                            disabled
                                            defaultValue={selectedRequest.usernameClient}
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
                                            defaultValue={convertString(selectedRequest.info)}
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
                                                    className="flex flex-end px-1"
                                                    key={image}
                                                    src={image}
                                                    width={500}
                                                    height={500}
                                                    alt="Picture of the author"
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                                <DialogFooter>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="destructive" onClick={() => {
                                            setIsDialogOpen(false);
                                            setIsDialogOpen2(true);
                                            setType("REJECTED");
                                        }}>
                                            Từ chối
                                        </Button>
                                        <Button variant="default" onClick={() => {
                                            setIsDialogOpen(false);
                                            setIsDialogOpen2(true);
                                            setType("REVIEWED");
                                        }}>
                                            Chấp nhận
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {isDialogOpen2 && (
                        <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
                            <DialogContent className="w-1/3 h-1/2 overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Xét duyệt</DialogTitle>
                                    <DialogDescription>
                                        Xét duyệt yêu cầu của người dùngz
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-left">Trạng thái</Label>
                                        <Input
                                            disabled
                                            className="col-span-3"
                                            value={translateType(type)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-left">Phản hồi</Label>
                                        <Textarea
                                            placeholder="Nhập phản hồi"
                                            className="col-span-3"
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => {
                                            setIsDialogOpen2(false)
                                        }}>
                                            Hủy
                                        </Button>
                                        <Button onClick={handleUpdateRequest}>Lưu</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
