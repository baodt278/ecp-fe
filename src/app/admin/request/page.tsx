"use client";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import {translateType} from "@/utils/common";
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
import {getRequestGeneral, requestVerify, verifyClient} from "@/api/admin";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";


export default function ClientRequest() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);
    const [username, setUsername] = useState("");
    const [requests, setRequests] = useState([]);
    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const [type, setType] = useState("");
    const [general, setGeneral] = useState([]);
    const [display, setDisplay] = useState(false);

    const getData = async () => {
        const username = await JSON.parse(localStorage.getItem("admin")).username;
        setUsername(username);
        const response = await requestVerify();
        if (response.data.code == 200) {
            setRequests(response.data.data);
        }
        const response2 = await getRequestGeneral();
        if (response2.data.code == 200) {
            setGeneral(response2.data.data);
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
        const response = await verifyClient(username, data);
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
            <Tabs defaultValue="approve" className="w-full">
                <TabsList>
                    <TabsTrigger value="approve">Xác minh</TabsTrigger>
                    <TabsTrigger value="request">Lịch sử</TabsTrigger>
                </TabsList>
                <TabsContent value="approve">
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã</TableHead>
                                        <TableHead>Người yêu cầu</TableHead>
                                        <TableHead>Ngày yêu cầu</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow
                                            key={request.code}
                                            onClick={() => {
                                                setDisplay(true);
                                                handleRowClick(request)
                                            }}>
                                            <TableCell>{request.code}</TableCell>
                                            <TableCell>{request.usernameClient}</TableCell>
                                            <TableCell>{request.createdAt}</TableCell>
                                            <TableCell>{switchBadge(request.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="request">
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã</TableHead>
                                        <TableHead>Loại yêu cầu</TableHead>
                                        <TableHead>Yêu cầu bởi</TableHead>
                                        <TableHead>Ngày yêu cầu</TableHead>
                                        <TableHead>Xét duyệt bởi</TableHead>
                                        <TableHead>Ngày xét duyệt</TableHead>
                                        <TableHead>Phê duyệt bởi</TableHead>
                                        <TableHead>Ngày phê duyệt</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {general.map((request) => (
                                        <TableRow
                                            key={request.code} onClick={() => {
                                            setDisplay(false);
                                            handleRowClick(request);
                                        }}>
                                            <TableCell>{request.code}</TableCell>
                                            <TableCell>{translateType(request.type)}</TableCell>
                                            <TableCell>{request.usernameClient}</TableCell>
                                            <TableCell>{request.createdAt}</TableCell>
                                            <TableCell>{request.reviewedBy}</TableCell>
                                            <TableCell>{request.reviewedAt}</TableCell>
                                            <TableCell>{request.acceptedBy}</TableCell>
                                            <TableCell>{request.acceptedAt}</TableCell>
                                            <TableCell>{switchBadge(request.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{display ? "Xác minh yêu cầu" : "Chi tiết yêu cầu"}</DialogTitle>
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
                            </div>
                        </div>
                        {display && (
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
                                        setType("APPROVED");
                                    }}>
                                        Chấp nhận
                                    </Button>
                                </div>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>
            )}
            {isDialogOpen2 && (
                <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
                    <DialogContent className="w-1/3 h-1/2 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Xác minh</DialogTitle>
                            <DialogDescription>
                                Xác minh định danh tài khoản của người dùng.
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
        </>
    );
}
