import { Blog } from "@/core/models/Blog.model"
import {  NextResponse } from "next/server"
import { IBlog, creatBlog } from "@/types";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/db";

export async function GET(): Promise<NextResponse<IBlog[] | {error: unknown}>> {

    try{

    await connectDB();

    const blogs = await Blog.find({});
    return NextResponse.json(blogs, {
        status: 200
    });
}
catch(e){
    return NextResponse.json({error: e},
        {
            status: 500
        }
    )

}

}

export async function POST(request: Request) : Promise<NextResponse<IBlog | {error: string}>> {

    try{

        const body : creatBlog = await request.json();

        if(!body.title && !body.author && !body.content){
            return NextResponse.json(
                {error: `Title, content, author are required`},
                {
                    status: 400
                }
            );
        }

        await connectDB();
        const result: IBlog = await Blog.create({
            _id : new ObjectId(),
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
    catch(e){
        return NextResponse.json({error: "error", e},
            {
                status: 500
            }
        )

    }
}
