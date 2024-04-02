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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const FormSchema = z.object({
  type: z.string(),
  company: z.string(),
});

export default function ClientRequest() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [info, setInfo] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [requestFilter, setRequestFilter] = useState([]);
  const types = [
    { value: "CONTRACT_NEW", label: "Tạo hợp đồng mới" },
    { value: "CONTRACT_CHANGE", label: "Thay đổi thông tin hợp đồng" },
    { value: "CONTRACT_STATUS", label: "Thay đổi trạng thái hợp đồng" },
    { value: "CONTRACT_ERROR", label: "Báo lỗi" },
    { value: "EMERGENCY", label: "Khẩn cấp" },
    { value: "ADVICE", label: "Kiến nghị" },
    { value: "QUESTION", label: "Hỏi đáp" },
  ];

  const getData = async () => {
    const username = await JSON.parse(localStorage.getItem("responseClient"))
      .username;
    setUsername(username);
    const response = await getRequests(username);
    if (response.data.code == 200) {
      setRequests(response.data.data);
    }
    const responseCompany = await getCompanies();
    if (responseCompany.data.code == 200) {
      setCompanies(responseCompany.data.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const requestFilter = requests.find(
      (request) => request.type === data.contract
    );
    setRequestFilter(requestFilter);
  }

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
        title: "Tạo yêu cầu thành công",
        description: response.data.data,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Tạo yêu cầu thất bại",
        description: response.data.data,
      });
    }
    setIsDialogOpen(false);
  };

  const handleUpdateRequest = async () => {
    const formData = new FormData();
    formData.append("code", selectedRequest.code);
    formData.append("description", description);
    formData.append("info", info);
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
  };

  const handleCreateRequest = async () => {
    const formData = new FormData();
    console.log(company);
    formData.append("acronymCompany", company);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("info", info);
    for (let i = 0; i < imageUrls.length; i++) {
      const file = imageUrls[i];
      formData.append(`images[${i}]`, file);
    }
    console.log(formData);
    const response = await createRequest(username, formData);
    if (response.data.code == 200) {
      toast({
        variant: "default",
        title: "Tạo yêu cầu thành công",
        description: response.data.data,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Tạo yêu cầu thất bại",
        description: response.data.data,
      });
    }
  setIsDialogOpen(false);
  };
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header
        name="Yêu cầu"
        hrefInfo="/client/info"
        hrefLogin="/client-login"
      />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Tạo yêu cầu</Button>
                </DialogTrigger>
                <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tạo yêu cầu mới</DialogTitle>
                    <DialogDescription>
                      Yêu cầu sẽ được đặt ở trạng thái &quot;Đang chờ&quot; và
                      thời gian tạo là hiện tại.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Mã công ty</Label>
                      <Select
                        onValueChange={(e) => {
                          setCompany(e);
                        }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn công ty" />
                        </SelectTrigger>
                        <SelectContent className="overflow-auto">
                          {companies.map((company) => (
                            <SelectItem
                              key={company.acronym}
                              value={company.acronym}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Loại yêu cầu</Label>
                      <Select
                        onValueChange={(e) => {
                          setType(e);
                        }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn yêu cầu" />
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
                      <Label className="text-left">Mô tả</Label>
                      <Textarea
                        placeholder="Nhập mô tả"
                        onChange={(e) => setDescription(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Thông tin</Label>
                      <Textarea
                        placeholder="Nhập thông tin"
                        onChange={(e) => setInfo(e.target.value)}
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
                          setImageUrls(e.target.files);
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateRequest}>
                      Lưu yêu cầu
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
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
                      Khi yêu cầu ở trạng thái &quot;Đang chờ&quot;, bạn có thể
                      thay đổi mô tả và chi tiết liên quan. Tuy nhiên không thể
                      thay đổi được loại yêu cầu.
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Thông tin</Label>
                      <Textarea
                        disabled={selectedRequest.status !== "PENDING"}
                        defaultValue={selectedRequest.info}
                        onChange={(e) => setInfo(e.target.value)}
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-left">Người xét duyệt</Label>
                          <Input
                            disabled
                            defaultValue={selectedRequest.reviewedBy}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-left">Ngày xét duyệt</Label>
                          <Input
                            disabled
                            defaultValue={selectedRequest.reviewedAt}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-left">Phản hồi 1</Label>
                          <Textarea
                            disabled
                            defaultValue={selectedRequest.reviewText}
                            className="col-span-3"
                          />
                        </div>
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
                          <Label className="text-left">Phản hồi 2</Label>
                          <Textarea
                            disabled
                            defaultValue={selectedRequest.acceptText}
                            className="col-span-3"
                          />
                        </div>
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
    </div>
  );
}
