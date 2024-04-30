"use client";
import {
    createCompany,
    createEmployee, deleteCompany,
    getCompanies, getContracts,
    getEmployees, updateCompany,
} from "@/api/admin";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {translateType} from "@/utils/common";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {toast} from "@/components/ui/use-toast";

export default function AdminPage() {
    const username = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).username : "";
    const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [name, setName] = useState("");
    const [acronym, setAcronym] = useState("");
    const [address, setAddress] = useState("");
    const [company, setCompany] = useState("");
    const [usernameEmployee, setUsernameEmployee] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [chosenCompany, setChosenCompany] = useState(false);
    const [nameCom, setNameCom] = useState("");
    const [acronymCom, setAcronymCom] = useState("");
    const [addressCom, setAddressCom] = useState("");

    const roles = [
        {value: "MANAGER", label: "Quản lý"},
        {value: "STAFF", label: "Nhân viên"},
    ];

    const getData = async () => {
        const response = await getCompanies();
        if (response.data.code == 200) {
            setCompanies(response.data.data);
        }
    };

    const handleRowClick = async (company) => {
        const response = await getEmployees(company.acronym);
        const response2 = await getContracts(company.acronym);
        setNameCom(company.name);
        setAcronymCom(company.acronym);
        setAddressCom(company.address);
        setEmployees(response.data.data);
        setContracts(response2.data.data);
        setIsDialogOpen(true);
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
            setIsCompanyDialogOpen(false);
        }
        setChosenCompany(true);
        setRole("MANAGER");
        setCompany(acronym);
        setIsEmployeeDialogOpen(true);
        getData();
    };

    const handleCreateEmployee = async () => {
        const data = {
            username: usernameEmployee,
            password: password,
            email: email,
            role: role,
        };
        const response = await createEmployee(username, company, data);
        if (response.data.code == 200) {
            setIsEmployeeDialogOpen(false);
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
        } else {
            setIsEmployeeDialogOpen(false);
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                description: response.data.data,
            });
        }
    };

    const handleUpdateCompany = async () => {
        const data = {
            name: nameCom,
            acronym: acronymCom,
            address: addressCom,
        };
        const response = await updateCompany(data);
        if (response.data.code == 200) {
            setIsDialogOpen(false);
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            getData();
        } else {
            setIsDialogOpen(false);
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                description: response.data.data,
            });
        }
    }

    const handleDeleteCompany = async () => {
        const response = await deleteCompany(acronymCom);
        if (response.data.code == 200) {
            setIsDialogOpen(false);
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
            getData();
        } else {
            setIsDialogOpen(false);
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                description: response.data.data,
            });
        }
    }
    return (
            <>
                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <CardTitle className="mt-2">
                            <Dialog
                                open={isCompanyDialogOpen}
                                onOpenChange={setIsCompanyDialogOpen}>
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
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Tên công ty</Label>
                                            <Input
                                                required
                                                placeholder="Nhập tên công ty"
                                                className="col-span-3"
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Định danh</Label>
                                            <Input
                                                required
                                                placeholder="Nhập định danh"
                                                className="col-span-3"
                                                onChange={(e) => setAcronym(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Địa chỉ</Label>
                                            <Input
                                                required
                                                placeholder="Nhập địa chỉ"
                                                className="col-span-3"
                                                onChange={(e) => setAddress(e.target.value)}
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
                        <CardTitle className="mx-4">
                            <Dialog
                                open={isEmployeeDialogOpen}
                                onOpenChange={setIsEmployeeDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Tạo nhân viên</Button>
                                </DialogTrigger>
                                <DialogContent className="w-2/3 h-2/3 overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Tạo nhân viên</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Chọn công ty</Label>
                                            {chosenCompany ? <Input
                                                disabled={true}
                                                value={name}
                                                className="col-span-3"
                                            /> : (
                                                <Select
                                                    required
                                                    onValueChange={(e) => {
                                                        setCompany(e);
                                                    }}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Chọn công ty"/>
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
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-left">Chọn vị trí</Label>
                                            {chosenCompany ? (<Input
                                                disabled={true}
                                                value="Quản lý"
                                                className="col-span-3"
                                            />) : (
                                                <Select
                                                    required
                                                    onValueChange={(e) => {
                                                        setRole(e);
                                                    }}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Chọn vị trí"/>
                                                    </SelectTrigger>
                                                    <SelectContent className="overflow-auto">
                                                        {roles.map((role) => (
                                                            <SelectItem key={role.value} value={role.value}>
                                                                {role.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
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
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" onClick={handleCreateEmployee}>
                                            Lưu yêu cầu
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Định danh</TableHead>
                                    <TableHead>Công ty</TableHead>
                                    <TableHead>Địa chỉ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.map((company) => (
                                    <TableRow
                                        key={company.acronym}
                                        onClick={() => handleRowClick(company)}>
                                        <TableCell>{company.acronym}</TableCell>
                                        <TableCell>{company.name}</TableCell>
                                        <TableCell>{company.address}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="overflow-auto">
                                <DialogHeader>
                                    <DialogTitle>Thông tin công ty</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="company">
                                    <TabsList className="grid grid-cols-3">
                                        <TabsTrigger value="company">Công ty</TabsTrigger>
                                        <TabsTrigger value="employee">Nhân viên</TabsTrigger>
                                        <TabsTrigger value="contract">Hợp đồng</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="company">
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Định danh</Label>
                                                <Input
                                                    disabled
                                                    className="col-span-3"
                                                    value={acronymCom}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Tên công ty</Label>
                                                <Input
                                                    value={nameCom}
                                                    className="col-span-3"
                                                    onChange={(e) => setNameCom(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-left">Địa chỉ</Label>
                                                <Input
                                                    value={addressCom}
                                                    className="col-span-3"
                                                    onChange={(e) => setAddressCom(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="destructive" onClick={handleDeleteCompany}>Xóa</Button>
                                                <Button variant="default" onClick={handleUpdateCompany}>Cập nhật</Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="employee">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tài khoản</TableHead>
                                                    <TableHead>Vị trí</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {employees.map((employee) => (
                                                    <TableRow key={employee.username}>
                                                        <TableCell>{employee.username}</TableCell>
                                                        <TableCell>{translateType(employee.role)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>
                                    <TabsContent value="contract">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mã hợp đồng</TableHead>
                                                    <TableHead>Loại</TableHead>
                                                    <TableHead>Đăng ký</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {contracts.map((contract) => (
                                                    <TableRow key={contract.name}>
                                                        <TableCell>{contract.name}</TableCell>
                                                        <TableCell className="whitespace-nowrap">{translateType(contract.type)}</TableCell>
                                                        <TableCell>{contract.createdAt}</TableCell>
                                                        <TableCell className="whitespace-nowrap">{translateType(contract.status)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                )}
            </>
    );
}
