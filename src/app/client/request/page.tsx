"use client";
import Header from "@/components/custom/header";
import LineBetween from "@/components/custom/line-between";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { formatNumber, translateType } from "@/app/utils/common";
import { getRequests } from "@/api/client";

const FormSchema = z.object({
  type: z.string({
    required_error:
      "Vui lòng chọn hợp đồng! Nếu không có hợp đồng, vui lòng tạo yêu cầu!",
  }),
});

export default function ClientRequest() {
  const [open, setOpen] = useState(false);
  const [haveSubmitted, setHaveSubmitted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestFilter, setRequestFilter] = useState([]);
//   const types = ["FAMILY", "BUSINESS", "PRODUCE", "PUBLIC_GOV", "EDU_MEDIC"];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const getData = async () => {
    const username = JSON.parse(
      localStorage.getItem("responseClient")
    ).username;
    console.log(username);
    const response = await getRequests(username);
    if (response.data.code == 200) {
      setRequests(response.data.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setHaveSubmitted(true);
    const requestFilter = requests.find(
      (request) => request.type === data.contract
    );
    setRequestFilter(requestFilter);
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header
        name="Hóa đơn"
        hrefInfo="/client/info"
        hrefLogin="/client-login"
      />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-row items-center">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
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
                              : "Chọn loại yêu cầu"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[360px] p-0">
                        <Command>
                          <CommandInput placeholder="Chọn hợp đồng" />
                          <CommandEmpty>Không có hợp đồng</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {types.map((type) => (
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
                    <FormMessage />
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
                <CardTitle className="text-lg">Hóa đơn theo hợp đồng</CardTitle>
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
                  {bills.map((bills) => (
                    <TableBody key={bills.code}>
                      <TableRow>
                        <TableCell>{bills.code}</TableCell>
                        <TableCell>{bills.createdAt}</TableCell>
                        <TableCell>{bills.start}</TableCell>
                        <TableCell>{bills.end}</TableCell>
                        <TableCell>{bills.expire}</TableCell>
                        {infoContract.type === "FAMILY" && (
                          <TableCell>{formatNumber(bills.consume)}</TableCell>
                        )}
                        {infoContract.type !== "FAMILY" && (
                          <TableCell>{formatNumber(bills.normal)}</TableCell>
                        )}
                        {(infoContract.type === "PRODUCE" ||
                          infoContract.type === "BUSINESS") && (
                          <>
                            <TableCell>{formatNumber(bills.low)}</TableCell>
                            <TableCell>{formatNumber(bills.high)}</TableCell>
                          </>
                        )}
                        <TableCell>{formatNumber(bills.cost)}</TableCell>
                        <TableCell>{formatNumber(bills.tax)}</TableCell>
                        <TableCell>{formatNumber(bills.charge)}</TableCell>
                        <TableCell>{formatNumber(bills.total)}</TableCell>
                        <TableCell>{translateType(bills.status)}</TableCell>
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
                <CardTitle className="text-lg">Hóa đơn trong tháng</CardTitle>
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
                        <TableCell>{translateType(billmonth.status)}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
