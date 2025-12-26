import { Blog } from "@/core/models/Blog.model";
import { NextResponse } from "next/server";
import { IBlog, updateBlog } from "@/types";
import connectDB from "@/core/database/db";
import mongoose from "mongoose";
import { ApiError } from "next/dist/server/api-utils";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<IBlog | { error: string }>> {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json(
            {
                error: "Invalid blog ID"
            },
            {
                status: 400
            }
        );
    }

    try {
        await connectDB();

        const blog = await Blog.findById(params.id);
        return NextResponse.json(
            blog, {
            status: 200
        }
        )
    }
    catch (e) {
        return NextResponse.json(
            {
                error: "Failed to fetch blog", e
            },
            {
                status: 500
            }
        );
    }

}

export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<updateBlog | { error: string }>> {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json(
            {
                error: "Invalid blog ID"
            },
            {
                status: 400
            }
        );
    }

    try {
        const body: updateBlog = await request.json();

        await connectDB();

        const BlogUpdata: updateBlog | null = await Blog.findByIdAndUpdate(
            { _id: params.id },
            {
                title: body.title,
                author: body.author,
                content: body.content,
                tags: body.tags,
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!BlogUpdata) {
            throw new ApiError(404, "Blog not found");
        }

        return NextResponse.json(
            BlogUpdata,
            {
                status: 200
            }
        );
    }
    catch (e) {
        return NextResponse.json(
            {
                error: "Failed to update blog", e
            },
            {
                status: 500
            }
        );
    }


}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json(
            {
                error: "Invalid blog ID"
            },
            {
                status: 400
            }
        );
    }
    
    try{

        await connectDB();
        const deleteBlogPost = await Blog.findByIdAndDelete(params.id);

        if(!deleteBlogPost){
            return NextResponse.json(
                {
                    error: "Blog not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json({
            message: "Blog post deleted successfully"
        },
        {
            status: 200
        });
    }
        catch(e){
            return NextResponse.json(
                {
                    error: "Blog not found" , e
                },
                {
                    status: 404
                }
            )
        }

}
    