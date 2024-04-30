"use client";
import Link from "next/link";
import {Settings, Newspaper, Home, FilePenLine, Building2} from 'lucide-react';
import {useState} from "react";

export default function MenuBar() {
    const [isActive, setIsActive] = useState(0);
    const off = "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";
    const on = "flex items-center gap-3 rounded-lg px-3 py-2 text-blue-500 transition-all hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-50";
    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-[60px] pl-7 pr-10">
                <Link className="flex items-center gap-3 font-semibold" href="/admin">
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
                    href="/admin">
                    <Building2 className="h-6 w-6"/>
                    Công ty
                </Link>
                <Link
                    onClick={() => setIsActive(1)}
                    className={isActive === 1 ? on : off}
                    href="/admin/request">
                    <FilePenLine className="h-6 w-6"/>
                    Xác minh
                </Link>
                <Link
                    onClick={() => setIsActive(2)}
                    className={isActive === 2 ? on : off}
                    href="/admin/config">
                    <Settings className="h-6 w-6"/>
                    Cấu hình
                </Link>
                <Link
                    onClick={() => setIsActive(3)}
                    className={isActive === 3 ? on : off}
                    href="/admin/news">
                    <Newspaper className="w-6 h-6"/>
                    Bảng tin
                </Link>
            </nav>
        </div>
    );
}
