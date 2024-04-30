"use client";
import {
    Activity,
    Receipt,
    DollarSign,
    CheckCheck,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {useEffect, useState} from "react";
import {getAnalystData} from "@/api/employee";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {formatNumber} from "@/utils/common";
import {ResponsiveBar} from "@nivo/bar";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState("");
    // @ts-ignore
    const acronym = JSON.parse(localStorage.getItem('employee')) ? JSON.parse(localStorage.getItem('employee')).acronymCompany : "";
    const currentDate = new Date().toISOString().slice(0, 10);

    const getData = async (date: string) => {
        await getAnalystData(acronym, date).then((res) => {
            if (res.data.code === 200) {
                setData(res.data.data)
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem("employee").role !== ("MANAGER")) {
            window.location.href = "/employee";
        }
        getData(currentDate);
    }, []);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tổng doanh thu
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(data.total)}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatNumber(data.percentTotal)} % so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Đã thanh toán
                        </CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(data.paid)}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatNumber(data.percentPaid)} % so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Yêu cầu đã xử lý
                        </CardTitle>
                        <CheckCheck className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.requests}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatNumber(data.percentRequests)} % so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Hợp đồng đang hoạt động
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(data.contracts)}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card
                    className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
                >
                    <CardHeader>
                        <div className="flex flex-row justify-between items-center">
                            <CardTitle>Doanh thu gần đây</CardTitle>
                            <div className="flex items-center">
                                <Input type="month" onChange={(e) => setDate(e.target.value.concat("-15"))}
                                       className="mr-2"/>
                                <Button onClick={() => getData(date)}>Chọn</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            className="w-full aspect-[2/1]"
                            data={data.values}
                        />
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-5">
                    <CardHeader>
                        <CardTitle>Chưa thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <div className="flex items-center gap-4">
                            <div className="grid gap-1">
                                <p className="font-medium leading-none">
                                    Mã hợp đồng
                                </p>
                            </div>
                            <div className="ml-auto font-medium">Còn nợ</div>
                        </div>
                        {data.bills != null && data.bills.map((bill) => (
                            <div className="flex items-center gap-4" key={bill.code}>
                                <div className="grid gap-1">
                                    <p className="font-medium leading-none">
                                        {bill.code}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">{formatNumber(bill.total)}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

function BarChart({data, className}) {
    if (!Array.isArray(data)) {
        console.error('data.values is not an array');
        return null;
    }

    return (
        <div className={className}>
            <ResponsiveBar
                data={data}
                keys={["total"]}
                indexBy="date"
                margin={{top: 60, right: 0, bottom: 40, left: 100}}
                padding={0.6}
                colors="#0000ff"
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
