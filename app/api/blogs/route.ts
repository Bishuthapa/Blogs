import { Blog } from "@/core/models/Blog.model"
import { User } from "@/core/models/User.model"
import { NextResponse } from "next/server"
import { IBlog, creatBlog } from "@/types";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";

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
        await connectDB();
        
        // ✅ Read cookie from request headers
        const cookieHeader = request.headers.get("cookie");
        console.log("🍪 Cookie header received:", cookieHeader ? "YES" : "NO");
        
        const token = cookieHeader
            ?.split("; ")
            .find((c) => c.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            console.log("❌ No token found in cookies");
            return NextResponse.json(
                { error: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        console.log("✅ Token found");

        // ✅ Verify JWT token
        let decodedToken;
        try {
            if (!process.env.TOKEN_SECRET) {
                throw new Error("TOKEN_SECRET is not configured");
            }
            
            decodedToken = jwt.verify(
                token,
                process.env.TOKEN_SECRET
            ) as { id: string };
            
            console.log("✅ Token decoded successfully, user ID:", decodedToken.id);
        } catch (jwtError) {
            console.error("❌ JWT verification failed:", jwtError);
            return NextResponse.json(
                { error: "Invalid or expired token. Please login again." },
                { status: 401 }
            );
        }

        // ✅ Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(decodedToken.id)) {
            console.error("❌ Invalid ObjectId format:", decodedToken.id);
            return NextResponse.json(
                { error: "Invalid user ID format" },
                { status: 400 }
            );
        }

        // ✅ Find user in database
        const user = await User.findById(decodedToken.id);
        if (!user) {
            console.error("❌ User not found with ID:", decodedToken.id);
            return NextResponse.json(
                { error: "User not found. Please login again." },
                { status: 404 }
            );
        }

        console.log("✅ User authenticated:", user.username);

        // ✅ Parse and validate request body
        const body: creatBlog = await request.json();

        if (!body.title?.trim() || !body.content?.trim()) {
            return NextResponse.json(
                { error: "Title and content are required." },
                { status: 400 }
            );
        }

        // ✅ Create blog post
        const result = await Blog.create({
            title: body.title.trim(),
            author: user._id,
            content: body.content.trim(),
            tags: Array.isArray(body.tags) ? body.tags : [],
            published:  true,
        });

        console.log("✅ Blog created successfully! ID:", result._id);

        return NextResponse.json(result as IBlog, { status: 201 });
    } catch (e) {
        console.error("❌ POST /api/blogs error:", e);
        const message = e instanceof Error ? e.message : "Failed to create blog";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}