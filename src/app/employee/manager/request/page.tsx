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
import { set, z } from "zod";
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
import {
  createRequest,
  deleteRequest,
  getCompanies,
  getRequests,
  updateRequest,
} from "@/api/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestVerify, verifyClient } from "@/api/admin";
import { acceptRequest, getRequestsForStaff, getRequestsNeedAccept, reviewRequest } from "@/api/employee";

const FormSchema = z.object({
  type: z.string(),
  company: z.string(),
});

export default function ManagerRequest() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [acronym, setAcronym] = useState("");
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("");
  const types = [
    { value: "REJECTED", label: "Từ chối" },
    { value: "APPROVED", label: "Chấp nhận" },
  ];
  const getData = async () => {
    const username = await JSON.parse(localStorage.getItem("responseEmployee"))
      .username;
    const acrnoym = await JSON.parse(localStorage.getItem("responseEmployee"))
      .acronymCompany;
    setUsername(username);
    setAcronym(acrnoym);
    const response = await getRequestsNeedAccept(acrnoym);
    if (response.data.code == 200) {
      setRequests(response.data.data);
    }
    // const responseCompany = await getCompanies();
    // if (responseCompany.data.code == 200) {
    //   setCompanies(responseCompany.data.data);
    // }
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
    const response = await acceptRequest(acronym, data);
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
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header
        name="Xét duyệt yêu cầu"
        hrefInfo="/employee/info"
        hrefLogin="/employee-login"
      />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
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
                    <TableCell>{translateType(request.type)}</TableCell>
                    <TableCell>{request.createdAt}</TableCell>
                    <TableCell>{request.reviewedAt}</TableCell>
                    <TableCell>{request.acceptedAt}</TableCell>
                    <TableCell>{translateType(request.status)}</TableCell>
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
                      <Label className="text-left">Trạng thái</Label>
                      <Select
                        onValueChange={(e) => {
                          setType(e);
                        }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Phản hồi</Label>
                      <Input
                        placeholder="Nhập phản hồi"
                        className="col-span-3"
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Mã</Label>
                      <Input
                        disabled
                        defaultValue={selectedRequest.code}
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
                        defaultValue={selectedRequest.info}
                        className="col-span-3"
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
                  <DialogFooter>
                    <Button type="submit" onClick={handleUpdateRequest}>
                      Lưu thay đổi
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
