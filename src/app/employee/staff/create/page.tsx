"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import {createBill, createRecord, getContractInfo, payBill} from "@/api/employee";
import {toast} from "@/components/ui/use-toast";
import {LoadingButton} from "@/components/ui/loading-button";

export default function EmployeeCreate() {
    const [date, setDate] = useState("");
    const [date2, setDate2] = useState("");
    const [contractName, setContractName] = useState("");
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [consume, setConsume] = useState(0);
    const [normal, setNormal] = useState(0);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);
    const [contract, setContract] = useState(null);

    const handleCreate = async () => {
        setLoading1(true);
        const response = await createBill(contractName, date);
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
        setLoading1(false);
    }

    const handlePay = async () => {
        setLoading2(true);
        const response = await payBill(contractName, date);
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
        setLoading2(false);
    }

    const handleGetContract = async () => {
        setLoading3(true)
        const response = await getContractInfo(contractName);
        if (response.data.code === 200) {
            setContract(response.data.data);
        } else {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: response.data.data,
            });
        }
        setLoading3(false);
    }

    const handleCreateRecord = async () => {
        setLoading4(true);
        const data = {
            consume: consume,
            normal: normal,
            low: low,
            high: high,
        };
        const response = await createRecord(contractName, date2, data);
        if (response.data.code === 200) {
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
        setLoading4(false);
    }

    return (
        <>
            <Tabs defaultValue="account" className="w-full">
                <TabsList>
                    <TabsTrigger value="account">Hóa đơn</TabsTrigger>
                    <TabsTrigger value="password">Bản ghi</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hóa đơn</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-center">
                            <div className="w-1/4 mr-4">
                                <Label htmlFor="name">Mã hợp đồng</Label>
                                <Input id="name" placeholder="Nhập mã hợp đồng của khách hàng"
                                       onChange={(e) => setContractName(e.target.value)}/>
                            </div>
                            <div>
                                <Label htmlFor="username">Thời gian</Label>
                                <Input id="username" type="month"
                                       onChange={(e) => setDate(e.target.value.concat("-15"))}/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <LoadingButton onClick={handleCreate} loading={loading1}>Tạo hóa đơn</LoadingButton>
                            <LoadingButton className="mx-2" variant="secondary" onClick={handlePay}
                                           loading={loading2}> Thanh toán</LoadingButton>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bản ghi</CardTitle>
                            <CardDescription>Tạo bản ghi ở đây.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label>Mã hợp đồng</Label>
                                <div className="flex flex-row items-center w-1/3">
                                    <Input className="mr-4" onChange={(e) => setContractName(e.target.value)}/>
                                    <LoadingButton loading={loading3} onClick={handleGetContract}>
                                        Chọn
                                    </LoadingButton>
                                </div>
                            </div>
                            {contract != null && (
                                <>
                                    <div className="space-y-1 w-1/3">
                                        <Label>Thời gian</Label>
                                        <Input type="date" onChange={(e) => setDate2(e.target.value)}/>
                                    </div>
                                    {contract.type === "FAMILY" && (
                                        <div className="space-y-1 w-1/3">
                                            <Label>Điện năng tiêu thụ</Label>
                                            <Input type="number" onChange={(e) => setConsume(e.target.value)}/>
                                        </div>
                                    )}
                                    {contract.type !== "FAMILY" && (
                                        <div className="space-y-1 w-1/3">
                                            <Label>Giờ bình thường</Label>
                                            <Input className="w-1/3" type="number" onChange={(e) => setNormal(e.target.value)}/>
                                        </div>
                                    )}
                                    {(contract.type === "BUSINESS" || contract.type === "PRODUCE") && (
                                        <>
                                            <div className="space-y-1 w-1/3">
                                                <Label>Giờ thấp điểm</Label>
                                                <Input className="w-1/3" type="number" onChange={(e) => setLow(e.target.value)}/>
                                            </div>
                                            <div className="space-y-1 w-1/3">
                                                <Label>Giờ cao điểm</Label>
                                                <Input className="w-1/3" type="number" onChange={(e) => setHigh(e.target.value)}/>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </CardContent>
                        {contract != null && (
                            <CardFooter>
                                <LoadingButton onClick={handleCreateRecord} loading={loading4}>
                                    Tạo bản ghi
                                </LoadingButton>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}
