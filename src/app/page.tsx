
import Link from "next/link"
import { Zap } from 'lucide-react';
export default function Component() {
  return (
      <>
        <header className="w-full bg-white py-4 px-6 md:px-12 lg:px-20 shadow">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-blue-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Quản lý điện</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="/admin-login">
                Quản trị viên
              </Link>
              <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="/employee-login">
                Nhân viên
              </Link>
            </div>
          </div>
        </header>
        <main>
          <section className=" py-20 px-6 md:px-12 lg:px-20">
            <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                  Quản lý điện năng tiêu thụ
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Dịch vụ quản lý điện tiện ích chuyên nghiệp, đảm bảo hiệu suất và
                  tiết kiệm năng lượng cho hệ thống.
                </p>
                <div className="mt-8 flex space-x-4">
                  <Link
                      className="rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600"
                      href="/client-register"
                  >
                    Tạo tài khoản
                  </Link>
                  <Link
                      className="rounded-md border border-blue-500 px-6 py-3 text-sm font-medium text-blue-500 hover:bg-blue-500 hover:text-white"
                      href="/client-login"
                  >
                    Đăng nhập
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                    alt="Hero Image"
                    className="rounded-lg"
                    height={500}
                    src="/energy.jpg"
                    style={{
                      aspectRatio: "500/500",
                      objectFit: "cover",
                    }}
                    width={500}
                />
              </div>
            </div>
          </section>
        </main>
      </>
  )
}