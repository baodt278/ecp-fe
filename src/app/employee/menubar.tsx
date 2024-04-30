"use client";
import Link from "next/link";
import {Newspaper, Home, LineChart, Building2, FilePlus2, FilePenLine} from 'lucide-react';
import {useState} from "react";

export default function MenuBar() {
    // @ts-ignore
    const role = JSON.parse(localStorage.getItem("employee")).role
    const [isActive, setIsActive] = useState(0);
    const off = "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";
    const on = "flex items-center gap-3 rounded-lg px-3 py-2 text-blue-500 transition-all hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-50";
    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-[60px] pl-7 pr-10">
                <Link className="flex items-center gap-3 font-semibold" href="/employee">
                    <div>
                        <Home className="h-6 w-6"/>
                    </div>
                    <p className="whitespace-nowrap">Trang chủ</p>
                </Link>
            </div>
            <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                    onClick={() => setIsActive(0)}
                    className={isActive === 0 ? on : off}
                    href="/employee">
                    <Building2 className="h-6 w-6"/>
                    Công ty
                </Link>
                {role === "STAFF" && (
                    <>
                        <Link
                            onClick={() => setIsActive(1)}
                            className={isActive === 1 ? on : off}
                            href="/employee/staff/create">
                            <FilePlus2 className="h-6 w-6"/>
                            Khởi tạo
                        </Link>
                        <Link
                            onClick={() => setIsActive(2)}
                            className={isActive === 2 ? on : off}
                            href="/employee/staff/request">
                            <FilePenLine className="h-6 w-6"/>
                            Xét duyệt
                        </Link>
                    </>
                )}
                {role === "MANAGER" && (
                    <>
                        <Link
                            onClick={() => setIsActive(3)}
                            className={isActive === 3 ? on : off}
                            href="/employee/manager/analyst">
                            <LineChart className="h-6 w-6"/>
                            Thống kê
                        </Link>
                        <Link
                            onClick={() => setIsActive(4)}
                            className={isActive === 4 ? on : off}
                            href="/employee/manager/request">
                            <FilePenLine className="h-6 w-6"/>
                            Phê duyệt
                        </Link>
                    </>
                )}
                <Link
                    onClick={() => setIsActive(5)}
                    className={isActive === 5 ? on : off}
                    href="/employee/news">
                    <Newspaper className="w-6 h-6"/>
                    Bảng tin
                </Link>
            </nav>
        </div>
    );
}
