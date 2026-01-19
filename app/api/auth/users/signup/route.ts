import { NextRequest , NextResponse } from "next/server";
import connectDB from "@/core/database/db"
import { User } from "@/core/models/User.model"
import { SignupSchema } from "@/validators/signupSchema";
import { Jwt } from "jsonwebtoken";
import bcryptjs from "bcryptjs";



connectDB();

export async function POST(req : NextRequest){
    try{

        const body = await req.json();
        const result = SignupSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json({
                success: false,
                error: result.error.flatten().fieldErrors,
            },
        {
            status: 400
        })
        }

        const { username, email, password } = result.data;

        const existingUser = await User.findOne({ 
            $or : [{email}, {username}]
        });

        if(existingUser){
            return NextResponse.json({
                success: false,
                message: existingUser.email === email ? "Email is already registered" : "Username already taken"
            },
        {
            status: 409
        })
        }

    }
    catch(error : unknown){
        console.error("SignUp error", error);
        return NextResponse.json({
            success: false,
            message: "An error occure durign signup",
        },
    {
        status: 500
    });
    }
}


