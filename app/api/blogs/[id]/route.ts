import { Blog } from "@/core/models/Blog.model";
import { NextResponse } from "next/server";
import {  updateBlog } from "@/types";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Define the shape of the params for Next.js 15+
type RouteParams = { params: Promise<{ id: string }> };

// --- GET: Fetch Single Blog ---
export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid blog ID format" }, { status: 400 });
    }

    try {
        await connectDB();
        
        // .findById() returns a single object, NOT an array.
        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
}

// --- PUT: Update Single Blog ---
export async function PUT(request: Request, { params }: RouteParams) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid blog ID format" }, { status: 400 });
    }

    try {
        const body: updateBlog = await request.json();
        await connectDB();

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
    }
}

// --- DELETE: Remove Single Blog ---
export async function DELETE(request: Request, { params }: RouteParams) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid blog ID format" }, { status: 400 });
    }

    try {
        await connectDB();
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Deletion failed", details: error.message }, { status: 500 });
    }
}