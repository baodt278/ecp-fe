"use client";
import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { translateType } from "@/app/utils/common";
import { requestVerify, verifyAccount } from "@/api/client";
import { Toast } from "@radix-ui/react-toast";
import { toast } from "@/components/ui/use-toast";

export default function ClientInfo() {
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [image, setImage] = useState([]);
  const getData = async () => {
    const username = await JSON.parse(localStorage.getItem("responseClient"))
      .username;
    setUsername(username);
    const response = await requestVerify(username);
    if (response.data.code == 200) {
      setRequests(response.data.data);
    }
  };

const handleVerify = async () => {
    const response = await verifyAccount(username, image);
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
};

useEffect(() => {
    getData();
}, []);
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header
        name="Thông tin người dùng"
        hrefInfo="/client/info"
        hrefLogin="/client-login"
      />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Tài khoản</TabsTrigger>
            <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
            <TabsTrigger value="verify">Xác minh tài khoản</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Xác minh tài khoản</CardTitle>
                <CardDescription>
                  Để sử dụng các tính năng của ứng dụng, người dùng cần xác minh
                  tài khoản bằng Căn cước công dân <br />
                  Sau khi xác minh từ hệ thống, bạn sẽ nhận được thông báo qua
                  email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid w-full max-w-sm items-center gap-1.5 grid-cols-3">
                  <Label htmlFor="picture">Ảnh CCCD</Label>
                  <Input id="picture" type="file" className="col-span-3"  
                        onChange={(e) => {
                            setImage(e.target.files);
                          }}/>
                  <Button onClick={handleVerify}>Xác minh</Button>
                </div>
                <div className="space-y-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã</TableHead>
                        <TableHead>Loại yêu cầu</TableHead>
                        <TableHead>Ngày yêu cầu</TableHead>
                        <TableHead>Ngày phê duyệt</TableHead>
                        <TableHead>Người phê duyệt</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.code}>
                          <TableCell>{request.code}</TableCell>
                          <TableCell>{translateType(request.type)}</TableCell>
                          <TableCell>{request.createdAt}</TableCell>
                          <TableCell>{request.acceptedAt}</TableCell>
                          <TableCell>{request.acceptedBy}</TableCell>
                          <TableCell>{request.acceptText}</TableCell>
                          <TableCell>{translateType(request.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
