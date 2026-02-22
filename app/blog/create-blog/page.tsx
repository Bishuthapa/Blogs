"use client";

import { useState } from "react";
import axios from "axios";
import {  useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Blog() {
    const [data, setData] = useState({
        title: "",
        tags: "",
        content: "",
        published: false,
    });

    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
             await axios.post("/api/blogs", {
                title: data.title.trim(),
                tags: data.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== ""),
                content: data.content,
                published: data.published,
            }, {
                withCredentials: true
            });

            toast.success("Blog Created Successfully!");

            setData({
                title: "",
                tags: "",
                content: "",
                published: false,
            });

            route.push("/blog") 
        } catch (err) {
            if (err instanceof Error)
                console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "min-h-scree flex item-center justify-center" >
        <div className="w-full max-w-3xl mx-auto p-5 border-2 rounded-2xl shadow-lg">

            <h1 className="text-2xl font-bold mb-6 text-center" >Create Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full border-2 rounded-2xl p-3"
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={data.title}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    className="w-full border-2 rounded-2xl p-3"
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={data.tags}
                    onChange={handleChange}
                />
                <br />

                <textarea
                    className="w-full border-2 rounded-2xl p-2 min-h-35.7"
                    name="content"
                    placeholder="Content"
                    value={data.content}
                    onChange={handleChange}
                    required
                />
                <br />

                <button
                className="w-full border-2 rounded-2xl p-3"
                    type="button"
                    onClick={() => setData((prev) => ({
                        ...prev,
                        published: !prev.published
                    }))}
                >
                    {data.published ? "Unpublish" : "Publish"}
                </button>
                <br />

                <button className="w-full border-2 rounded-2xl p-3 " type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
        </div>
    );
}
