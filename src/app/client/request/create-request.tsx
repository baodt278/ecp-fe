"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRequest, getCompanies, getContracts } from "@/api/client";
import { toast } from "@/components/ui/use-toast";

export default function CreateRequest({onCreateRequest}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [contractName, setContractName] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [contractType, setContractType] = useState("");
  const [contractHouses, setContractHouses] = useState("");
  const [contractStatus, setContractStatus] = useState("");
  const [contractVolt, setContractVolt] = useState("");

  const types = [
    { value: "CONTRACT_NEW", label: "Tạo hợp đồng mới" },
    { value: "CONTRACT_CHANGE", label: "Thay đổi thông tin hợp đồng" },
    { value: "CONTRACT_STATUS", label: "Thay đổi trạng thái hợp đồng" },
    { value: "CONTRACT_ERROR", label: "Báo lỗi" },
    { value: "EMERGENCY", label: "Khẩn cấp" },
    { value: "ADVICE", label: "Kiến nghị" },
    { value: "QUESTION", label: "Hỏi đáp" },
  ];
  const contractTypes = [
    { value: "FAMILY", label: "Sinh hoạt" },
    { value: "PRODUCE", label: "Sản xuất" },
    { value: "BUSINESS", label: "Kinh doanh" },
    { value: "PUBLIC_GOV", label: "Hành chính công" },
    { value: "EDU_MEDIC", label: "Y tế - Giáo dục" },
    { value: "COMPLEX", label: "Tổ hợp" },
  ];
  const contractStatuses = [
    { value: "ACTIVE", label: "Đang hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" },
    { value: "CANCELED", label: "Đã hủy" },
  ];

  const contractVolts = [
    { value: "BELOW_6KV", label: "Dưới 6KV" },
    { value: "FROM_6KV_TO_22KV", label: "Từ 6KV đến 22KV" },
    { value: "FROM_22KV_TO_110KV", label: "Từ 22KV đến 110KV" },
    { value: "ABOVE_110KV", label: "Trên 110KV" },
  ];

  const getData = async () => {
    const username = JSON.parse(localStorage.getItem("client")).username;
    setUsername(username);
    const response = await getCompanies();
    if (response.data.code == 200) {
      setCompanies(response.data.data);
    }
    const response2 = await getContracts(username);
    if (response2.data.code == 200) {
      setContracts(response2.data.data);
    }
  };
  useEffect(() => {
    getData();
  }, [username]);

  useEffect(() => {
    setType("");
  }, [isDialogOpen]);

  const handleCreateRequest = async () => {
    const data = new FormData();
    data.append("type", type);
    data.append("description", description);
    data.append("acronymCompany", company);
    data.append(
      "info",
      `${contractName}|${contractAddress}|${contractHouses}|${contractType}|${contractStatus}|${contractVolt}`
    );
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      data.append(`images[${i}]`, file);
    }
    const response = await createRequest(username, data);
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
    setIsDialogOpen(false);
    onCreateRequest();
  };
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Tạo yêu cầu</Button>
        </DialogTrigger>
        <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu mới</DialogTitle>
            <DialogDescription>
              Yêu cầu sẽ được đặt ở trạng thái &quot;Đang chờ&quot; và thời gian
              tạo là hiện tại.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            {type !== "CONTRACT_CHANGE" &&
              type !== "CONTRACT_STATUS" &&
              type !== "CONTRACT_ERROR" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-left">Tên công ty</Label>
                  <Select
                    required
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
              )}

            {type !== "" && (
              <>
                {type.includes("CONTRACT_") && type !== "CONTRACT_NEW" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-left">Mã hợp đồng</Label>
                    <Select
                      required
                      onValueChange={(e) => {
                        setContractName(e);
                      }}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn mã hợp đồng" />
                      </SelectTrigger>
                      <SelectContent>
                        {contracts.map((contract) => (
                          <SelectItem key={contract.name} value={contract.name}>
                            {contract.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(type === "CONTRACT_NEW" || type === "CONTRACT_CHANGE") && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Địa chỉ</Label>
                      <Input
                        required
                        placeholder="Nhập địa chỉ"
                        className="col-span-3"
                        onChange={(e) => setContractAddress(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Loại hợp đồng</Label>
                      <Select
                        required
                        onValueChange={(e) => {
                          setContractType(e);
                        }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn loại hợp đồng" />
                        </SelectTrigger>
                        <SelectContent className="overflow-auto">
                          {contractTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Điện áp</Label>
                      <Select
                        required
                        onValueChange={(e) => {
                          setContractVolt(e);
                        }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn điện áp" />
                        </SelectTrigger>
                        <SelectContent className="overflow-auto">
                          {contractType === "FAMILY" ||
                          contractType === "COMPLEX" ? (
                            <>
                              <SelectItem value="BELOW_6KV">
                                Dưới 6KV
                              </SelectItem>
                            </>
                          ) : contractType === "PUBLIC_GOV" ||
                            contractType === "EDU_MEDIC" ? (
                            <>
                              <SelectItem value="BELOW_6KV">
                                Dưới 6KV
                              </SelectItem>
                              <SelectItem value="FROM_6KV_TO_22KV">
                                Từ 6KV đến 22KV
                              </SelectItem>
                            </>
                          ) : contractType === "BUSINESS" ? (
                            <>
                              <SelectItem value="BELOW_6KV">
                                Dưới 6KV
                              </SelectItem>
                              <SelectItem value="FROM_6KV_TO_22KV">
                                Từ 6KV đến 22KV
                              </SelectItem>
                              <SelectItem value="FROM_22KV_TO_110KV">
                                Từ 22KV đến 110KV
                              </SelectItem>
                            </>
                          ) : (
                            <>
                              {contractVolts.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {contractType === "FAMILY" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-left">Số hộ</Label>
                        <Input
                          type="number"
                          className="col-span-3"
                          onChange={(e) => setContractHouses(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
                {type === "CONTRACT_STATUS" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-left">Trạng thái hợp đồng</Label>
                    <Select
                      onValueChange={(e) => {
                        setContractStatus(e);
                      }}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn loại hợp đồng" />
                      </SelectTrigger>
                      <SelectContent className="overflow-auto">
                        {contractStatuses.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-left">Mô tả</Label>
                  <Textarea
                    placeholder="Nhập mô tả"
                    onChange={(e) => setDescription(e.target.value)}
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
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateRequest}>
              Lưu yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
