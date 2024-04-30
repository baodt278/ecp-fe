"use client";

import {Tabs, TabsContent, TabsTrigger, TabsList} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {createNews, deleteNews, getLocalNews, getSystemNews} from "@/api/employee";
import {convertToShortContent} from "@/utils/common";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "@/components/ui/use-toast";

export default function Component() {
    const username = JSON.parse(localStorage.getItem("employee")) ? JSON.parse(localStorage.getItem("employee")).username : "";
    const acronym = JSON.parse(localStorage.getItem("employee")) ? JSON.parse(localStorage.getItem("employee")).acronymCompany : "";
    const [global, setGlobal] = useState([]);
    const [local, setLocal] = useState([]);
    const [selectNews, setSelectNews] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [isShowCreate, setIsShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const getData = async () => {
        const response = await getSystemNews();
        if (response.data.code === 200) {
            setGlobal(response.data.data);
        }
        const response2 = await getLocalNews(acronym);
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

    const handleCreate = async () => {
        const data = new FormData();
        data.append("title", title);
        data.append("content", content);
        data.append("author", username);
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            data.append(`images[${i}]`, file);
        }
        console.log(data)
        const response = await createNews(acronym, data);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: response.data.data,
            });
        }
        getData();
        setIsShowCreate(false);
    }

    const handleDelete = async () => {
        const response = await deleteNews(selectNews.code);
        if (response.data.code == 200) {
            toast({
                variant: "default",
                title: "Thành công",
                description: response.data.data,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: response.data.data,
            });
        }
        getData();
        setIsShow(false);
    }


    return (
        <>
            <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                <Tabs defaultValue="local" className="w-full">
                    <div className="flex justify-between flex-row">
                        <TabsList>
                            <TabsTrigger value="global" onClick={() => setIsShow(false)}>Tin hệ thống</TabsTrigger>
                            <TabsTrigger value="local" onClick={() => setIsShow(false)}>Bảng tin công ty</TabsTrigger>
                        </TabsList>
                        <Button onClick={() => setIsShowCreate(true)}>
                            Tạo tin tức
                        </Button>
                    </div>
                    <TabsContent value="global">
                        {!isShow && (
                            <Card className="space-y-2">
                                {global.map((item) => (
                                    <div className="grid grid-cols-10 p-4" key={item.code}
                                         onClick={() => handleShow(item)}>
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
                                    <div className="grid grid-cols-10 p-4" key={item.code}
                                         onClick={() => handleShow(item)}>
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
                                <div className="flex items-center justify-center">
                                    <h1 className="text-3xl font-bold text-center flex-grow">{selectNews.title}</h1>
                                    {selectNews.acronym != null && (
                                        <Button className="ml-auto" variant="destructive" onClick={handleDelete}>Xóa tin
                                            tức</Button>)}
                                </div>
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
                    {isShowCreate && (
                        <Dialog open={isShowCreate} onOpenChange={setIsShowCreate}>
                            <DialogContent className="container px-4 md:px-6">
                                <div className="flex flex-col gap-8">
                                    <div className="space-y-2">
                                        <DialogTitle>Tạo tin tức mới</DialogTitle>
                                    </div>
                                    <div className="grid gap-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Tiêu đề</Label>
                                                <Input placeholder="Nhập tiêu đề của bài viết"
                                                       onChange={(e) => setTitle(e.target.value)}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nội dung</Label>
                                                <Textarea className="min-h-[200px]" id="content"
                                                          placeholder="Nhập nội dung của bài viết"
                                                          onChange={(e) => setContent(e.target.value)}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="image">Ảnh</Label>
                                                <Input id="image" type="file"
                                                       onChange={(e) => {
                                                           setImages(e.target.files);
                                                       }}/>
                                            </div>
                                            <Button className="w-full" onClick={handleCreate}>
                                                Lưu thay đổi
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </Tabs>
            </main>
        </>
    )
}