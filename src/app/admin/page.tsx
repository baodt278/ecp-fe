"use client";
import { createCompany, getCompanies } from "@/api/admin";
import Header from "@/components/custom/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [address, setAddress] = useState("");
  const getData = async () => {
    const username = await JSON.parse(localStorage.getItem("responseAdmin"))
      .username;
    setUsername(username);
    const response = await getCompanies();
    if (response.data.code == 200) {
      setCompanies(response.data.data);
    }
    // const responseCompany = await getCompanies();
    // if (responseCompany.data.code == 200) {
    //   setCompanies(responseCompany.data.data);
    // }
  };

  useEffect(() => {
    getData();
  }, []);
  const handleCreateCompany = async () => {
    const data = {
      name: name,
      acronym: acronym,
      address: address,
    };
    const response = await createCompany(data);
    if (response.data.code == 200) {
      getData();
      setIsDialogOpen(false);
    }
  };
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header name="Khởi tạo" hrefInfo="/admin/info" hrefLogin="/admin-login" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Tạo công ty</Button>
                </DialogTrigger>
                <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tạo công ty mới</DialogTitle>
                    <DialogDescription>
                      Công ty được tạo với yêu cầu có định danh là mã công ty.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4"></div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Tên công ty</Label>
                      <Input
                        placeholder="Nhập tên công ty"
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Định danh</Label>
                      <Input
                        placeholder="Nhập định danh"
                        onChange={(e) => setAcronym(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-left">Định danh</Label>
                      <Input
                        placeholder="Nhập định danh"
                        onChange={(e) => setAcronym(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center">
                      <Label htmlFor="picture" className="text-left">
                        Biểu tượng
                      </Label>
                      <Input
                        multiple
                        className="col-span-3"
                        id="picture"
                        type="file"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateCompany}>
                      Lưu yêu cầu
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardTitle>
              <Button variant="outline">Tạo nhân viên</Button>
            </CardTitle>
            <CardTitle>Nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Định dạng</TableHead>
                  <TableHead>Công ty</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.acronym}>
                    <TableCell>{company.acronym}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
