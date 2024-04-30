"use client";
import {CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import {ResponsiveBar} from "@nivo/bar";
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
import {
    getContracts,
    getPredictCurrentMonth,
    getRecords7DaysBefore,
    getRecordsCurrentMonth,
    getTotals6MonthsBefore,
} from "@/api/client";
import {formatNumber, translateType} from "@/utils/common";
import LineBetween from "@/components/custom/line-between";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import RequestVerify from "@/app/client/info/verify";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";

const FormSchema = z.object({
    name: z.string({
        required_error:
            "Nếu không có hợp đồng, vui lòng tạo yêu cầu!",
    }),
});

export default function ClientElectric() {
    const [open, setOpen] = useState(false);
    const [haveSubmitted, setHaveSubmitted] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [infoContract, setInfoContract] = useState([]);
    const [records, setRecords] = useState([]);
    const [perdictCurrent, setPerdictCurrent] = useState([]);
    const [records7DaysBefore, setRecords7DaysBefore] = useState([]);
    const [total6Months, setTotal6Months] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState("");
    // @ts-ignore
    const active = localStorage.getItem("client") ? JSON.parse(localStorage.getItem("client")).active : "";
    // @ts-ignore
    const username = localStorage.getItem("client") ? JSON.parse(localStorage.getItem("client")).username : "";

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const getContractsData = async () => {
        setDate(new Date().toISOString().slice(0, 10));
        const response = await getContracts(username);
        if (response.data.code == 200) {
            setContracts(response.data.data);
        }
    };

    useEffect(() => {
        if (active) {
            getContractsData();
        }
    }, []);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setHaveSubmitted(true);
        const contract = contracts.find(
            (contract) => contract.name === data.name
        );
        if (contract) {
            setInfoContract(contract);
        }
        await onChangeDate(data.name);
    }

    const onChangeDate = async (contractName: string) => {
        const responseRecords = await getRecordsCurrentMonth(contractName, date);
        if (responseRecords.data.code == 200) {
            setRecords(responseRecords.data.data);
        }
        const responsePerdictCurrent = await getPredictCurrentMonth(contractName, date);
        if (responsePerdictCurrent.data.code == 200) {
            setPerdictCurrent(responsePerdictCurrent.data.data);
        }
        const resoponseRecords7DaysBefore = await getRecords7DaysBefore(contractName, date);
        if (resoponseRecords7DaysBefore.data.code == 200) {
            setRecords7DaysBefore(resoponseRecords7DaysBefore.data.data);
        }
        const responseTotals6Months = await getTotals6MonthsBefore(contractName, date);
        if (responseTotals6Months.data.code == 200) {
            setTotal6Months(responseTotals6Months.data.data);
        }
    }

    const switchBadge = (status) => {
        switch (status) {
            case "ACTIVE":
                return <Badge variant="default" className="whitespace-nowrap">Đang hoạt động</Badge>;
            case "INACTIVE":
                return <Badge variant="secondary" className="whitespace-nowrap">Ngưng hoạt động</Badge>;
            case "CANCELLED":
                return <Badge variant="destructive">Đã hủy</Badge>;
            default:
                return <Badge variant="secondary">Không xác định</Badge>;
        }
    }

    return (
        <>
            {!active ? (<RequestVerify loading={loading} username={username} setLoading={setLoading}/>) : (
                <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-row">
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
                                                                : "Chọn hợp đồng để xem điện năng tiêu thụ"}
                                                            <ChevronsUpDown
                                                                className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
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
                                                                            form.setValue("name", contract.name);
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
                            <div className="grid gap-4 md:gap-8 md:grid-cols-[1fr_1fr]">
                                <div className="grid gap-4">
                                    <Tabs defaultValue="predict">
                                        <div className="flex items-center justify-between">
                                            <TabsList>
                                                <TabsTrigger value="predict">Chỉ số công tơ</TabsTrigger>
                                                <TabsTrigger value="activity">Hợp đồng</TabsTrigger>
                                            </TabsList>
                                            <div className="flex items-center">
                                                <Input type="month" onChange={(e) => setDate(e.target.value.concat("-15"))} className="mr-2"/>
                                                <Button onClick={() => onChangeDate(infoContract.name)}>Chọn</Button>
                                            </div>
                                        </div>
                                        <TabsContent value="predict">
                                            <Card className="h-[180px]">
                                            <CardHeader>
                                                    <CardTitle>
                                                        Tổng tiêu thụ
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-4">
                                                        {!(perdictCurrent.consume <= 0) && (
                                                            <>
                                                                <div className="grid gap-1">
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Điện năng tiêu thụ
                                                                    </p>
                                                                    <p className="text-2xl font-semibold">
                                                                        {formatNumber(perdictCurrent.consume)} kWh
                                                                    </p>
                                                                </div>
                                                                <LineBetween/>
                                                            </>
                                                        )}
                                                        {!(perdictCurrent.normal <= 0) && (
                                                            <>
                                                                <div className="grid gap-1">
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Giờ bình thường
                                                                    </p>
                                                                    <p className="text-2xl font-semibold">
                                                                        {formatNumber(perdictCurrent.normal)} kWh
                                                                    </p>
                                                                </div>
                                                                <LineBetween/>
                                                            </>
                                                        )}
                                                        {!(perdictCurrent.low <= 0) && (
                                                            <>
                                                                <div className="grid gap-1">
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Giờ thấp điểm
                                                                    </p>
                                                                    <p className="text-2xl font-semibold">
                                                                        {formatNumber(perdictCurrent.low)} kWh
                                                                    </p>
                                                                </div>
                                                                <LineBetween/>
                                                            </>
                                                        )}
                                                        {!(perdictCurrent.high <= 0) && (
                                                            <>
                                                                <div className="grid gap-1">
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Giờ cao điểm
                                                                    </p>
                                                                    <p className="text-2xl font-semibold">
                                                                        {formatNumber(perdictCurrent.high)} kWh
                                                                    </p>
                                                                </div>
                                                                <LineBetween/>
                                                            </>
                                                        )}
                                                        <div className="grid gap-1">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Tiền điện chưa thuế
                                                            </p>
                                                            <p className="text-2xl font-semibold">
                                                                {formatNumber(perdictCurrent.cost)} VNĐ
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="my-2 h-[290px]">
                                                <CardHeader>
                                                    <CardTitle>
                                                        Chỉ số công tơ
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="overflow-auto max-h-[200px]">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Ngày</TableHead>
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
                                                            </TableRow>
                                                        </TableHeader>
                                                        {records.map((record) => (
                                                            <TableBody key={record.time}>
                                                                <TableRow>
                                                                    <TableCell>{record.time}</TableCell>
                                                                    {infoContract.type === "FAMILY" && (
                                                                        <TableCell>{record.consume}</TableCell>
                                                                    )}
                                                                    {infoContract.type !== "FAMILY" && (
                                                                        <TableCell>{record.normal}</TableCell>
                                                                    )}
                                                                    {(infoContract.type === "PRODUCE" ||
                                                                        infoContract.type === "BUSINESS") && (
                                                                        <>
                                                                            <TableCell>{record.low}</TableCell>
                                                                            <TableCell>{record.high}</TableCell>
                                                                        </>
                                                                    )}
                                                                </TableRow>
                                                            </TableBody>
                                                        ))}
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                        <TabsContent value="activity">
                                            <Card className="h-[480px]">
                                                <CardHeader>
                                                    <CardTitle>
                                                        Thông tin hợp đồng
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-4">
                                                        <div className="grid gap-1">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Loại hợp đồng
                                                            </p>
                                                            <p className="text-lg font-semibold">
                                                                {translateType(infoContract.type)}
                                                            </p>
                                                        </div>
                                                        <LineBetween/>
                                                        <div className="grid gap-1">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Điện áp
                                                            </p>
                                                            <p className="text-lg font-semibold">
                                                                {translateType(infoContract.volt)}
                                                            </p>
                                                        </div>
                                                        <LineBetween/>
                                                        {infoContract.houses > 0 && (
                                                            <>
                                                                <div className="grid gap-1">
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Số hộ
                                                                    </p>
                                                                    <p className="text-lg font-semibold">
                                                                        {infoContract.houses}
                                                                    </p>
                                                                </div>
                                                                <LineBetween/>
                                                            </>
                                                        )}
                                                        <div className="grid gap-1">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Trạng thái
                                                            </p>
                                                            <p className="text-lg font-semibold">
                                                                {translateType(infoContract.status)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 my-2">
                                                        <div className="grid gap-1">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Địa chỉ
                                                            </p>
                                                            <p className="text-lg font-semibold">
                                                                {infoContract.address}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 my-2">
                                                        <div className="grid gap-1">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Bên cung cấp
                                                            </p>
                                                            <p className="text-lg font-semibold">
                                                                {infoContract.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                                <div className="grid gap-4">
                                    <Tabs defaultValue="7days">
                                        <TabsList>
                                            <TabsTrigger value="7days">7 ngày gần nhất</TabsTrigger>
                                            <TabsTrigger value="6months">6 tháng gần nhất</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="7days">
                                            <Card className="h-[480px]">
                                                <CardHeader>
                                                    <CardTitle>
                                                        Điện năng tiêu thụ trong 7 ngày gần nhất
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <BarChart
                                                        className="w-full aspect-[2/1]"
                                                        data={records7DaysBefore}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                        <TabsContent value="6months">
                                            <Card className="h-[480px]">
                                                <CardHeader>
                                                    <CardTitle>
                                                        Tổng tiêu thụ trong 6 tháng gần nhất
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <BarChart
                                                        className="w-full aspect-[2/1]"
                                                        data={total6Months}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </>
                    )}
                    {!haveSubmitted && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hợp đồng của bạn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tên</TableHead>
                                                <TableHead>Loại</TableHead>
                                                <TableHead>Điện áp</TableHead>
                                                <TableHead className="whitespace-nowrap">Số hộ</TableHead>
                                                <TableHead>Ngày tạo</TableHead>
                                                <TableHead className="whitespace-nowrap">Cập nhật</TableHead>
                                                <TableHead>Địa chỉ</TableHead>
                                                <TableHead>Công ty</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        {contracts.map((contract) => (
                                            <TableBody key={contract.name} onClick={() => onSubmit(contract)}>
                                                <TableRow>
                                                    <TableCell>{contract.name}</TableCell>
                                                    <TableCell>{translateType(contract.type)}</TableCell>
                                                    <TableCell>{translateType(contract.volt)}</TableCell>
                                                    <TableCell>{contract.houses == 0 ? "" : contract.houses}</TableCell>
                                                    <TableCell>{contract.createdAt}</TableCell>
                                                    <TableCell>{contract.updatedAt}</TableCell>
                                                    <TableCell>{contract.address}</TableCell>
                                                    <TableCell>{contract.text}</TableCell>
                                                    <TableCell>{switchBadge(contract.status)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        ))}
                                    </Table>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </main>)}
        </>
    );
}

function BarChart({data, className}) {
    return (
        <div className={className}>
            <ResponsiveBar
                data={data}
                keys={["consume", "normal", "low", "high"]}
                indexBy="time"
                margin={{top: 60, right: 0, bottom: 40, left: 100}}
                padding={0.6}
                colors={["#0000ff", "#ffff00", "#008000", "#ff0000"]}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 20,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickValues: 5,
                    tickPadding: 40,
                }}
                gridYValues={4}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "16px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                tooltipLabel={({id}) => `${id}`}
                enableLabel={false}
                role="application"
                ariaLabel="A bar chart showing data"
            />
        </div>
    );
}
