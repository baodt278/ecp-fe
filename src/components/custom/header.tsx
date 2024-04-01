"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface HeaderProps {
  name: string;
  hrefInfo: string;
  hrefLogin: string;
}

export default function Header({ name, hrefInfo, hrefLogin }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="flex-1">
        <h1 className="font-semibold text-lg">{name}</h1>
      </div>
      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost">
              <Image
                src="/public/images/icon.png"
                width={500}
                height={500}
                alt="Picture of the author"
              />
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
                  localStorage.clear;
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
