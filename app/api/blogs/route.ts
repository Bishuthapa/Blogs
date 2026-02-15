import { Blog } from "@/core/models/Blog.model"
import { User } from "@/core/models/User.model"
import { NextResponse } from "next/server"
import { IBlog, creatBlog } from "@/types";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

export async function GET(): Promise<NextResponse<IBlog[] | { error: string }>> {
    try {
        await connectDB();

        const blogs = await Blog.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDoc",
                },
            },
            { $unwind: { path: "$authorDoc", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    tags: 1,
                    published: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    author: {
                        _id: "$author",
                        username: "$authorDoc.username",
                        avatar: "$authorDoc.avatar",
                    },
                },
            },
        ]);

        if (!blogs || blogs.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(blogs, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<NextResponse<IBlog | { error: string }>> {
    try {
        const body: creatBlog = await request.json();

        if (!body.title?.trim() || !body.author?.trim() || !body.content?.trim()) {
            return NextResponse.json(
                { error: "Title, author, and content are required." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(body.author)) {
            return NextResponse.json(
                { error: "Author must be a valid user ID." },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findById(body.author);
        if (!user) {
            return NextResponse.json(
                { error: "User not found. Use a valid user ID." },
                { status: 404 }
            );
        }

        const result = await Blog.create({
            title: body.title.trim(),
            author: new mongoose.Types.ObjectId(body.author),
            content: body.content.trim(),
            tags: Array.isArray(body.tags) ? body.tags : [],
            published: true,
        });

        return NextResponse.json(result as IBlog, { status: 201 });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to create blog";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
