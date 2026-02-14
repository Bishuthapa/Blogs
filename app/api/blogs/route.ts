import { Blog } from "@/core/models/Blog.model"
import { NextResponse } from "next/server"
import { IBlog, creatBlog } from "@/types";
import { ObjectId } from "mongodb";
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

        if (!body.title && !body.author && !body.content) {
            return NextResponse.json(
                { error: `Title, content, author are required` },
                {
                    status: 400
                }
            );
        }

        await connectDB();
        const result: IBlog = await Blog.create({
            _id: new ObjectId(),
            title: body.title,
            author: body.author,
            content: body.content,
            tags: body.tags,
            published: true,
        });
        return NextResponse.json(result, {
            status: 201
        });
    }
    catch (e) {
        return NextResponse.json({ error: "error", e },
            {
                status: 500
            }
        )

    }
}
