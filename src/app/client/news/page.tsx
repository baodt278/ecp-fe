"use client";

import {Tabs, TabsContent, TabsTrigger, TabsList} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {getLocalNews, getSystemNews} from "@/api/client";
import {convertContentByLine, convertToShortContent} from "@/utils/common";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";

export default function Component() {
    const username = localStorage.getItem("client") ? JSON.parse(localStorage.getItem("client")).username : "";
    const [global, setGlobal] = useState([]);
    const [local, setLocal] = useState([]);
    const [selectNews, setSelectNews] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const getData = async () => {
        const response = await getSystemNews();
        if (response.data.code === 200) {
            setGlobal(response.data.data);
        }
        const response2 = await getLocalNews(username);
        if (response2.data.code === 200) {
            setLocal(response2.data.data);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleShow = (news) => {
        setSelectNews(news);
        setIsShow(true);
    }

    return (
        <>
            <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                <Tabs defaultValue="global" className="w-full">
                    <TabsList>
                        <TabsTrigger value="global" onClick={() => setIsShow(false)}>Tin hệ thống</TabsTrigger>
                        <TabsTrigger value="local" onClick={() => setIsShow(false)}>Bảng tin công ty</TabsTrigger>
                    </TabsList>
                    <TabsContent value="global">
                        {!isShow && (
                            <Card className="space-y-2">
                                {global.map((item) => (
                                    <div className="grid grid-cols-10 p-4" key={item.code} onClick={() => handleShow(item)}>
                                        <div className="col-span-2">
                                            <img
                                                alt="Cover image"
                                                className="aspect-video rounded-lg object-cover object-center overflow-hidden"
                                                height="100"
                                                src={item.imageUrl}
                                                width="200"
                                            />
                                        </div>
                                        <div className="col-span-8">
                                            <h1 className="text-xl font-semibold tracking-tighter">
                                                {item.title}
                                            </h1>
                                            <p className="text-sm text-gray-500">{convertToShortContent(item.content, 500)}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        )}
                    </TabsContent>
                    <TabsContent value="local">
                        {!isShow && (
                            <Card className="space-y-2">
                                {local.map((item) => (
                                    <div className="grid grid-cols-10 p-4" key={item.code} onClick={() => handleShow(item)}>
                                        <div className="col-span-2">
                                            <img
                                                alt="Cover image"
                                                className="aspect-video rounded-lg object-cover object-center overflow-hidden"
                                                height="100"
                                                src={item.imageUrl}
                                                width="200"
                                            />
                                        </div>
                                        <div className="col-span-8">
                                            <h1 className="text-xl font-semibold tracking-tighter">
                                                {item.title}
                                            </h1>
                                            <p className="text-sm text-gray-500">{convertToShortContent(item.content, 500)}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        )}
                    </TabsContent>
                    {isShow && (
                        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-4">
                                <h1 className="text-3xl font-bold text-center">
                                    {selectNews.title}
                                </h1>
                                <p className="text-sm text-gray-500 text-center mt-2">Bởi {selectNews.author} lúc {selectNews.time}</p>
                                <div className="mt-4 items-center flex justify-center">
                                    <img
                                        alt="Cover image"
                                        className="h-1/2 w-1/2 object-cover object-center"
                                        src={selectNews.imageUrl}
                                    />
                                </div>
                                <div className="whitespace-pre-line pt-4">
                                    {selectNews.content}
                                </div>
                            </div>
                        </Card>
                    )}
                </Tabs>
            </main>
        </>
    )
}