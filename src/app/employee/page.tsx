"use client";
import {
    getCompany,
    getEmployees,
    getContracts, createEmployee, deleteEmployee,
} from "@/api/employee";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {translateType} from "@/utils/common";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {toast} from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {updateInfo} from "@/api/employee";
import {LoadingButton} from "@/components/ui/loading-button";

export default function CompanyPage() {
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [company, setCompany] = useState("");
    const [usernameEmployee, setUsernameEmployee] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [contracts, setContracts] = useState([]);
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const user = JSON.parse(localStorage.getItem("employee"));


    const roles = [
        {value: "MANAGER", label: "Quản lý"},
        {value: "STAFF", label: "Nhân viên"},
    ];
    const switchBadge = (status) => {
        switch (status) {
            case "MANAGER":
                return <Badge variant="outline">Quản lý</Badge>;
            case "STAFF":
                return <Badge variant="secondary">Nhân viên</Badge>;
            case "ACTIVE":
                return <Badge variant="default">Đang hoạt động</Badge>;
            case "INACTIVE":
                return <Badge variant="secondary">Ngưng hoạt động</Badge>;
            case "CANCELLED":
                return <Badge variant="destructive">Đã hủy</Badge>;
            default:
                return <Badge variant="secondary">Không xác định</Badge>;
        }
    }

    const getData = async () => {
        const acronym = user.acronymCompany;
        const response1 = await getCompany(acronym);
        if (response1.data.code == 200) {
            setCompany(response1.data.data);
        }
        const response2 = await getEmployees(acronym);
        if (response2.data.code == 200) {
            setEmployees(response2.data.data);
        }
        if (user.role === "MANAGER") {
            const response3 = await getContracts(acronym);
            if (response3.data.code == 200) {
                setContracts(response3.data.data);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleRowClick = (employee) => {
        setEmployee(employee);
        setIsDialogOpen(true);
    }

    const handleUpdate = (employee) => {
        setLoading(true);
        const data = {
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
        };
        const response = updateInfo(employee.username, data).then((response) => {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setIsDialogOpen(false);
        setLoading(false);
    }

    const handleDelete = (username) => {
        setLoading(true);
        const response = deleteEmployee(username).then((response) => {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            getData();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                // @ts-ignore
                description: response.data.data,
            });
        });
        setIsDialogOpen(false);
        setLoading(false);
    }

    const handleCreateEmployee = async () => {
        const data = {
            username: usernameEmployee,
            password: password,
            email: email,
            role: role,
        };
        const response = await createEmployee(user.username, user.acronymCompany, data);
        if (response.data.code == 200) {
            setIsEmployeeDialogOpen(false);
        }
    };
    return (
        <>
            <section>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-lg font-semibold">{company.acronym} - {company.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{company.address}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nhân viên</h4>
                                <p className="text-lg font-semibold">{company.numberEmployees}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hợp đồng</h4>
                                <p className="text-lg font-semibold">{company.numberContracts}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Khách hàng</h4>
                                <p className="text-lg font-semibold">{company.numberClients}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Yêu cầu</h4>
                                <p className="text-lg font-semibold">{company.numberRequests}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
            <section>
                <Tabs defaultValue="employee" className="w-full">
                    <TabsList>
                        <TabsTrigger value="employee">Nhân viên</TabsTrigger>
                        <TabsTrigger disabled={user.role !== 'MANAGER'} value="contract">Hợp đồng</TabsTrigger>
                    </TabsList>
                    <TabsContent value="employee">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Nhân viên</CardTitle>
                                    {user.role === "MANAGER" && (
                                        <Dialog
                                            open={isEmployeeDialogOpen}
                                            onOpenChange={setIsEmployeeDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="default">Tạo nhân viên</Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Tạo nhân viên</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label className="text-left">Chọn vị trí</Label>
                                                    <Select
                                                        required
                                                        onValueChange={(e) => {
                                                            setRole(e);
                                                        }}>
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue placeholder="Chọn chức vụ"/>
                                                        </SelectTrigger>
                                                        <SelectContent className="overflow-auto">
                                                            {roles.map((role) => (
                                                                <SelectItem key={role.value} value={role.value}>
                                                                    {role.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label className="text-left">Email</Label>
                                                    <Input
                                                        required
                                                        placeholder="Nhập email"
                                                        className="col-span-3"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label className="text-left">Tên tài khoản</Label>
                                                    <Input
                                                        required
                                                        placeholder="Nhập tên tài khoản"
                                                        className="col-span-3"
                                                        onChange={(e) => setUsernameEmployee(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label className="text-left">Mật khẩu</Label>
                                                    <Input
                                                        required
                                                        placeholder="Nhập mật khẩu"
                                                        type="password"
                                                        className="col-span-3"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>

                                                <DialogFooter>
                                                    <Button type="submit" onClick={handleCreateEmployee}>
                                                        Lưu yêu cầu
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tài khoản</TableHead>
                                            <TableHead>Tên đầy đủ</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>SĐT</TableHead>
                                            <TableHead>Địa chỉ</TableHead>
                                            <TableHead>Chức vụ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="overflow-auto">
                                        {employees.map((employee) => (
                                            <TableRow key={employee.username} onClick={() => handleRowClick(employee)}>
                                                <TableCell>{employee.username}</TableCell>
                                                <TableCell>{employee.fullName}</TableCell>
                                                <TableCell>{employee.email}</TableCell>
                                                <TableCell>{employee.phone}</TableCell>
                                                <TableCell>{employee.address}</TableCell>
                                                <TableCell>{switchBadge(employee.role)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="contract">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center">
                                    <CardTitle>Hợp đồng</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã hợp đồng</TableHead>
                                            <TableHead>Khách hàng</TableHead>
                                            <TableHead>Loại</TableHead>
                                            <TableHead>Điện áp</TableHead>
                                            <TableHead>Đăng ký</TableHead>
                                            <TableHead>Cập nhật</TableHead>
                                            <TableHead>Địa chỉ</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contracts.map((contract) => (
                                            <TableRow key={contract.name}>
                                                <TableCell>{contract.name}</TableCell>
                                                <TableCell>{contract.text}</TableCell>
                                                <TableCell>{translateType(contract.type)}</TableCell>
                                                <TableCell>{translateType(contract.volt)}</TableCell>
                                                <TableCell>{contract.createdAt}</TableCell>
                                                <TableCell>{contract.updatedAt}</TableCell>
                                                <TableCell>{contract.address}</TableCell>
                                                <TableCell>{switchBadge(contract.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
            {isDialogOpen && (
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Chi tiết nhân viên</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Tài khoản</Label>
                                <Input
                                    disabled
                                    className="col-span-3"
                                    value={employee.username}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Email</Label>
                                <Input
                                    placeholder={employee.email ? employee.email : "Nhập email"}
                                    className="col-span-3"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Tên đầy đủ</Label>
                                <Input
                                    placeholder={employee.fullName ? employee.fullName : "Nhập tên nhân viên"}
                                    className="col-span-3"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Số điện thoại</Label>
                                <Input
                                    placeholder={employee.phone ? employee.phone : "Nhập số điện thoại"}
                                    className="col-span-3"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-left">Địa chỉ</Label>
                                <Input
                                    placeholder={employee.address ? employee.address : "Nhập địa chỉ"}
                                    className="col-span-3"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <LoadingButton variant="destructive" onClick={() => handleDelete(employee.username)} loading={loading}>
                                Xóa nhân viên
                            </LoadingButton>
                            <LoadingButton onClick={() => handleUpdate(employee)} loading={loading}>
                                Lưu thay đổi
                            </LoadingButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

