/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1HuvMQsUUTO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Header from "@/components/custom/header";
import Link from "next/link";

export default function EmpployeeNews() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header name="Bảng tin" hrefInfo="/admin/info" hrefLogin="/admin-login" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="container space-y-6 px-4 md:px-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Latest News
            </h1>
          </div>
          <nav className="flex items-center justify-start space-x-4 text-sm font-medium md:space-x-6">
            <Link
              className="text-gray-900 dark:text-gray-50 hover:underline hover:text-gray-900/90 dark:hover:text-gray-50/90"
              href="#">
              All
            </Link>
            <Link
              className="text-gray-900 dark:text-gray-50 hover:underline hover:text-gray-900/90 dark:hover:text-gray-50/90"
              href="#">
              Global
            </Link>
            <Link
              className="text-gray-900 dark:text-gray-50 hover:underline hover:text-gray-900/90 dark:hover:text-gray-50/90"
              href="#">
              Local
            </Link>
            <Link
              className="text-gray-900 dark:text-gray-50 hover:underline hover:text-gray-900/90 dark:hover:text-gray-50/90"
              href="#">
              Entertainment
            </Link>
          </nav>
          <div className="grid gap-6 md:gap-8 lg:gap-12">
            <div className="flex flex-col gap-2">
              <Link className="font-bold text-xl" href="#">
                The future of electric vehicles in cities
              </Link>
              <p className="text-gray-500 dark:text-gray-400">by John Smith</p>
              <time
                className="text-gray-500 dark:text-gray-400"
                dateTime="2023-09-23">
                September 23, 2023
              </time>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="font-bold text-xl" href="#">
                How to build a sustainable garden at home
              </Link>
              <p className="text-gray-500 dark:text-gray-400">
                by Emily Johnson
              </p>
              <time
                className="text-gray-500 dark:text-gray-400"
                dateTime="2023-09-23">
                September 23, 2023
              </time>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="font-bold text-xl" href="#">
                The impact of AI on healthcare
              </Link>
              <p className="text-gray-500 dark:text-gray-400">by Alex Brown</p>
              <time
                className="text-gray-500 dark:text-gray-400"
                dateTime="2023-09-23">
                September 23, 2023
              </time>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="font-bold text-xl" href="#">
                Exploring the wonders of the deep sea
              </Link>
              <p className="text-gray-500 dark:text-gray-400">by Sarah Lee</p>
              <time
                className="text-gray-500 dark:text-gray-400"
                dateTime="2023-09-23">
                September 23, 2023
              </time>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="font-bold text-xl" href="#">
                Uncovering ancient mysteries in the Amazon
              </Link>
              <p className="text-gray-500 dark:text-gray-400">
                by Michael Clark
              </p>
              <time
                className="text-gray-500 dark:text-gray-400"
                dateTime="2023-09-23">
                September 23, 2023
              </time>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
