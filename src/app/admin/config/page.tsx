"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useEffect, useState} from "react";
import {createBase, deleteBase, deletePrice, getBase, getPrices, updateBase, updatePrice} from "@/api/admin";
import {toast} from "@/components/ui/use-toast";
import {translateType} from "@/utils/common";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { CirclePlus } from 'lucide-react';
import {Button} from "@/components/ui/button";

export default function Config() {
    const [bases, setBases] = useState([]);
    const [prices, setPrices] = useState([]);
    const [price, setPrice] = useState([]);
    const [value, setValue] = useState(0);
    const [isDialogPriceOpen, setIsDialogPriceOpen] = useState(false);
    const [object, setObject] = useState("");
    const [valueBase, setValueBase] = useState("");
    const [isDialogBaseOpen, setIsDialogBaseOpen] = useState(false);
    const [base, setBase] = useState([]);
    const [create, setCreate] = useState(false);

    const getData = async () => {
        const response = getBase().then((res) => {
            setBases(res.data.data);
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        const response2 = getPrices().then((res) => {
            setPrices(res.data.data);
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response2.data.data,
            });
        });
    }

    const handleUpdate = () => {
        const response = updatePrice(price.id, value).then((res) => {
            toast({
                variant: "default",
                title: "Cập nhật thành công!",
                description: res.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setIsDialogPriceOpen(false);
    }

    const handleRowClickPrice = (price:any) => {
        setIsDialogPriceOpen(true);
        setPrice(price);
    }

    const handleRowClickBase = (base:any) => {
        setCreate(false);
        setIsDialogBaseOpen(true);
        setBase(base);
    }

    const handleUpdateBase = () => {
        setObject(base.object)
        const data = {
            object: object,
            value: valueBase,
        }
        const response = updateBase(data).then((res) => {
            toast({
                variant: "default",
                title: "Cập nhật thành công!",
                description: res.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setIsDialogBaseOpen(false);
    }

    const handleCreateBase = () => {
        const data = {
            object: object,
            value: valueBase,
        }
        const response = createBase(data).then((res) => {
            toast({
                variant: "default",
                title: "Cập nhật thành công!",
                description: res.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setCreate(false);
        setIsDialogBaseOpen(false);
    }
    const handleDeletePrice = () => {
        const response = deletePrice(price.id).then((res) => {
            toast({
                variant: "default",
                title: "Xóa thành công!",
                description: res.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setIsDialogPriceOpen(false);
    }

    const handleDeleteBase = () => {
        const response = deleteBase(base.object).then((res) => {
            toast({
                variant: "default",
                title: "Xóa thành công!",
                description: res.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setIsDialogBaseOpen(false);

    }
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="grid grid-cols-10">
                <div className="col-span-5">
                    <Card className="mr-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Cấu hình hệ thống</CardTitle>
                            <Button
                                className="ml-3 -mt-3"
                                onClick={() => {
                                    setCreate(true);
                                    setIsDialogBaseOpen(true);
                                }}>
                                Tạo cấu hình
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-y-auto h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Thuộc tính</TableHead>
                                        <TableHead>Giá trị</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bases.map((base) => (
                                        <TableRow
                                            key={base.id}
                                            onClick={() => handleRowClickBase(base)}
                                        >
                                            <TableCell>{base.object}</TableCell>
                                            <TableCell>{base.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        {isDialogBaseOpen && (
                            <Dialog open={isDialogBaseOpen} onOpenChange={setIsDialogBaseOpen}>
                                <DialogContent className="w-1/3">
                                    <DialogHeader>
                                        <DialogTitle>{create ? "Thêm cấu hình" : "Chi tiết cấu hình"}</DialogTitle>
                                        <DialogDescription>
                                            {create ? "Thêm cấu hình hệ thống" : "Thay đổi chi tiết cấu hình"}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Thuộc tính</Label>
                                            <Input
                                                placeholder={create ? "Nhập thuộc tính" : base.object}
                                                disabled={!create}
                                                className="col-span-3"
                                                onChange={(e) => setObject(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Giá trị</Label>
                                            <Input
                                                placeholder={create ? "Nhập giá trị" : base.value}
                                                className="col-span-3"
                                                onChange={(e) => setValueBase(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            {!create && (
                                                <Button variant="destructive" onClick={handleDeleteBase}>
                                                    Xóa
                                                </Button>
                                            )}
                                            <Button onClick={create ? handleCreateBase : handleUpdateBase}>Lưu</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </Card>
                </div>
                <div className="col-span-5">
                    <Card className="ml-2">
                        <CardHeader>
                            <CardTitle>Giá bán lẻ điện</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loại hợp đồng</TableHead>
                                        <TableHead>Điệp áp</TableHead>
                                        <TableHead>Mức</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prices.map((price) => (
                                        <TableRow
                                            key={price.id}
                                            onClick={() => handleRowClickPrice(price)}
                                        >
                                            <TableCell>{translateType(price.contractType)}</TableCell>
                                            <TableCell>{translateType(price.volt)}</TableCell>
                                            <TableCell>{translateType(price.tag)}</TableCell>
                                            <TableCell>{price.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {isDialogPriceOpen && (
                                <Dialog open={isDialogPriceOpen} onOpenChange={setIsDialogPriceOpen}>
                                    <DialogContent className="w-1/3 ">
                                        <DialogHeader>
                                            <DialogTitle>Chi tiết đơn giá</DialogTitle>
                                            <DialogDescription>
                                                Thay đổi đơn giá bán lẻ điện
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Loại hợp đồng</Label>
                                                <Input
                                                    disabled
                                                    className="col-span-3"
                                                    value={translateType(price.contractType)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Điện áp</Label>
                                                <Input
                                                    disabled
                                                    className="col-span-3"
                                                    value={translateType(price.volt)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Mức</Label>
                                                <Input
                                                    disabled
                                                    className="col-span-3"
                                                    value={translateType(price.tag)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Đơn giá</Label>
                                                <Input
                                                    placeholder={price.price}
                                                    className="col-span-3"
                                                    onChange={(e) => setValue(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="destructive" onClick={handleDeletePrice}>
                                                    Xóa
                                                </Button>
                                                <Button onClick={handleUpdate}>Lưu</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}