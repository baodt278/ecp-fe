"use client";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {useEffect, useState} from "react";

const FormSchema = z.object({
    contract: z.string({
        required_error:
            "Vui lòng chọn hợp đồng!!",
    }),
});
import {CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import {formatNumber, translateType} from "@/utils/common";
import {
    getBillCurrentMonth,
    getBillsContract, getCharge,
    getContracts, getMessages, payment,
} from "@/api/client";
import Header from "@/app/client/header";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Account from "@/app/admin/info/account";
import ChangePassword from "@/app/admin/info/password";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";
import {toast} from "@/components/ui/use-toast";
import {LoadingButton} from "@/components/ui/loading-button";

export default function ClientBill() {
    const [open, setOpen] = useState(false);
    const [haveSubmitted, setHaveSubmitted] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [infoContract, setInfoContract] = useState([]);
    const [billmonths, setBillmonths] = useState([]);
    const [charges, setCharges] = useState([]);
    const [bills, setBills] = useState([]);
    const currentDate = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [billCode, setBillCode] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabledRows, setDisabledRows] = useState(false);
    const username = localStorage.getItem("client") ? JSON.parse(localStorage.getItem("client")).username : "";
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const getData = async (date: string) => {
        const response = await getContracts(username);
        if (response.data.code == 200) {
            setContracts(response.data.data);
        }
        const responseBillmonths = await getBillCurrentMonth(username, date);
        if (responseBillmonths.data.code == 200) {
            setBillmonths(responseBillmonths.data.data);
        }
        const responseCharge = await getCharge(username);
        if (responseCharge.data.code == 200) {
            setCharges(responseCharge.data.data);
        }
    };

    const getMess = async () => {
        const response = await getMessages();
        if (response.data.code == 200) {
            setMessage(response.data.data);
        }
    }

    useEffect(() => {
        getMess();
        getData(currentDate);
    }, []);



    const switchBadge = (status) => {
        switch (status) {
            case "PAID":
                return <Badge variant="default" className="whitespace-nowrap">Đã thanh toán</Badge>;
            case "UNPAID":
                return <Button variant="default" size="sm" onClick={() => setIsDialogOpen(true)}>Thanh toán</Button>;
            case "PENDING":
                return <Badge variant="secondary" className="whitespace-nowrap">Chờ duyệt</Badge>;
            case "EXPIRED":
                return <Badge variant="destructive">Quá hạn</Badge>;
            default:
                return <Badge variant="secondary">Không xác định</Badge>;
        }
    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setHaveSubmitted(true);
        const contract = contracts.find(
            (contract) => contract.name === data.contract
        );
        if (contract) {
            setInfoContract(contract);
        }
        const responseBills = await getBillsContract(data.contract);
        if (responseBills.data.code == 200) {
            setBills(responseBills.data.data);
        }
    }

    const handlePay = async () => {
        setLoading(true);
        const data = new FormData();
        data.append("billCode", billCode);
        for (let i = 0; i < images.length; i++) {
            data.append(`images[${i}]`, images[i]);
        }
        const response = await payment(username, data);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: response.data.data,
            });
        }
        setLoading(false);
        setIsDialogOpen(false);
    }

    return (
        <>
            <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">

                <Tabs defaultValue="bill" className="w-full">
                    <TabsList>
                        <TabsTrigger value="bill">Hóa đơn</TabsTrigger>
                        <TabsTrigger value="charge">Phụ phí</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bill">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="flex flex-row items-center">
                                    <FormField
                                        control={form.control}
                                        name="contract"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-[360px] justify-between h-11",
                                                                    !field.value && "text-muted-foreground"
                                                                )}>
                                                                {field.value
                                                                    ? contracts.find(
                                                                        (contract) => contract.name === field.value
                                                                    )?.name
                                                                    : "Chọn hợp đồng để xem hóa đơn"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[360px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Chọn hợp đồng"/>
                                                            <CommandEmpty>Không có hợp đồng</CommandEmpty>
                                                            <CommandList>
                                                                <CommandGroup>
                                                                    {contracts.map((contract) => (
                                                                        <CommandItem
                                                                            value={contract.name}
                                                                            key={contract.name}
                                                                            onSelect={() => {
                                                                                form.setValue("contract", contract.name);
                                                                                setOpen(false);
                                                                            }}>
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    contract.name === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {contract.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="ml-3 ">
                                        Chọn
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        {haveSubmitted && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hóa đơn theo hợp đồng</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mã</TableHead>
                                                    <TableHead>Ngày tạo</TableHead>
                                                    <TableHead>Bắt đầu</TableHead>
                                                    <TableHead>Kết thúc</TableHead>
                                                    <TableHead>Hạn trả</TableHead>
                                                    {infoContract.type === "FAMILY" && (
                                                        <TableHead>Điện năng tiêu thụ (kWh)</TableHead>
                                                    )}
                                                    {infoContract.type !== "FAMILY" && (
                                                        <TableHead>Giờ bình thường (kWh)</TableHead>
                                                    )}
                                                    {(infoContract.type === "PRODUCE" ||
                                                        infoContract.type === "BUSINESS") && (
                                                        <>
                                                            <TableHead>Giờ thấp điểm (kWh)</TableHead>
                                                            <TableHead>Giờ cao điểm (kWh)</TableHead>
                                                        </>
                                                    )}
                                                    <TableHead>Tiền điện chưa thuế (VNĐ)</TableHead>
                                                    <TableHead>Thuế GTGT (8%) tiền điện (VNĐ)</TableHead>
                                                    <TableHead>Tiền phát sinh (VNĐ)</TableHead>
                                                    <TableHead>Tổng tiền (VNĐ)</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {bills.map((bill) => (
                                                <TableBody key={bill.code}>
                                                    <TableRow>
                                                        <TableCell>{bill.code}</TableCell>
                                                        <TableCell>{bill.createdAt}</TableCell>
                                                        <TableCell>{bill.start}</TableCell>
                                                        <TableCell>{bill.end}</TableCell>
                                                        <TableCell>{bill.expire}</TableCell>
                                                        {infoContract.type === "FAMILY" && (
                                                            <TableCell>{formatNumber(bill.consume)}</TableCell>
                                                        )}
                                                        {infoContract.type !== "FAMILY" && (
                                                            <TableCell>{formatNumber(bill.normal)}</TableCell>
                                                        )}
                                                        {(infoContract.type === "PRODUCE" ||
                                                            infoContract.type === "BUSINESS") && (
                                                            <>
                                                                <TableCell>{formatNumber(bill.low)}</TableCell>
                                                                <TableCell>{formatNumber(bill.high)}</TableCell>
                                                            </>
                                                        )}
                                                        <TableCell>{formatNumber(bill.cost)}</TableCell>
                                                        <TableCell>{formatNumber(bill.tax)}</TableCell>
                                                        <TableCell>{formatNumber(bill.charge)}</TableCell>
                                                        <TableCell>{formatNumber(bill.total)}</TableCell>
                                                        <TableCell onClick={() => setBillCode(bill.code)}>{switchBadge(bill.status)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ))}
                                        </Table>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        {!haveSubmitted && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-row justify-between items-center">
                                            <CardTitle>Hợp đồng trong tháng</CardTitle>
                                            <div className="flex items-center">
                                                <Input type="month" onChange={(e) => setDate(e.target.value.concat("-15"))}
                                                       className="mr-2"/>
                                                <Button onClick={() => getData(date)}>Chọn</Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mã</TableHead>
                                                    <TableHead>Ngày tạo</TableHead>
                                                    <TableHead>Bắt đầu</TableHead>
                                                    <TableHead>Kết thúc</TableHead>
                                                    <TableHead>Hạn trả</TableHead>
                                                    <TableHead>Tiền điện chưa thuế (VNĐ)</TableHead>
                                                    <TableHead>Thuế GTGT (8%) tiền điện (VNĐ)</TableHead>
                                                    <TableHead>Tiền phát sinh (VNĐ)</TableHead>
                                                    <TableHead>Tổng tiền (VNĐ)</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {billmonths.map((billmonth) => (
                                                <TableBody key={billmonth.code}>
                                                    <TableRow>
                                                        <TableCell>{billmonth.code}</TableCell>
                                                        <TableCell>{billmonth.createdAt}</TableCell>
                                                        <TableCell>{billmonth.start}</TableCell>
                                                        <TableCell>{billmonth.end}</TableCell>
                                                        <TableCell>{billmonth.expire}</TableCell>
                                                        <TableCell>{formatNumber(billmonth.cost)}</TableCell>
                                                        <TableCell>{formatNumber(billmonth.tax)}</TableCell>
                                                        <TableCell>{formatNumber(billmonth.charge)}</TableCell>
                                                        <TableCell>{formatNumber(billmonth.total)}</TableCell>
                                                        <TableCell onClick={() => setBillCode(billmonth.code)}>{switchBadge(billmonth.status)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ))}
                                        </Table>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </TabsContent>
                    <TabsContent value="charge">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-row justify-between items-center">
                                    <CardTitle>Hợp đồng trong tháng</CardTitle>
                                    <div className="flex items-center">
                                        <Input type="month" onChange={(e) => setDate(e.target.value.concat("-15"))}
                                               className="mr-2"/>
                                        <Button onClick={() => getData(date)}>Chọn</Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã hợp đồng</TableHead>
                                            <TableHead>Mã yêu cầu</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead>Khoản thu</TableHead>
                                            <TableHead>Thành tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {charges.map((charge) => (
                                        <TableBody key={charge.id}>
                                            <TableRow>
                                                <TableCell>{charge.contractName}</TableCell>
                                                <TableCell>{charge.requestCode}</TableCell>
                                                <TableCell>{charge.createdAt}</TableCell>
                                                <TableCell>{charge.reason}</TableCell>
                                                <TableCell>{charge.value}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    ))}
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                {isDialogOpen && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thanh toán hóa đơn</DialogTitle>
                                <DialogDescription className="whitespace-pre-line">
                                    {message}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-left">Mã hóa đơn</Label>
                                    <Input
                                        disabled
                                        defaultValue={billCode}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center">
                                    <Label htmlFor="picture" className="text-left">
                                        Ảnh
                                    </Label>
                                    <Input
                                        multiple
                                        className="col-span-3"
                                        id="picture"
                                        type="file"
                                        onChange={(e) => {
                                            setImages(e.target.files);
                                        }}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => {
                                        setIsDialogOpen(false);
                                    }}>
                                        Hủy
                                    </Button>
                                    <LoadingButton loading={loading} variant="default" onClick={handlePay}>
                                       Thanh toán
                                    </LoadingButton>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </main>
        </>
    );
}
