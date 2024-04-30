"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useEffect} from "react";

interface HeaderProps {
  hrefInfo: string;
  hrefLogin: string;
}

export default function Header({ hrefInfo, hrefLogin }: HeaderProps) {
  // @ts-ignore
  const avatar = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).avatar : "";
  const router = useRouter();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="flex-1">
        <h1 className="font-semibold text-lg"></h1>
      </div>
      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost">
              <Avatar>
                <AvatarImage src={avatar} alt="Ảnh" />
                <AvatarFallback>Ảnh</AvatarFallback>
              </Avatar>

            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push(hrefInfo)}>
                Tài khoản
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem('admin');
                  router.push(hrefLogin);
                }}>
                Đăng xuất
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
