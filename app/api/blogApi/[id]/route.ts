import { Blog } from "@/core/models/index.model";
import { NextResponse } from "next/server";
import { IBlog, creatBlog } from "@/types";
import { ObjectId } from "mongodb";
import connectDB from "@/core/database/db";

export async function GET(request: Request): Promise<NextResponse<IBlog | {error: string}>> {
    
    const {id} = 
    try{
}