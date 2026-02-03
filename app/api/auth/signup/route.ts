import { NextRequest , NextResponse } from "next/server";
import connectDB from "@/lib/db"
import { User } from "@/core/models/User.model"
import { SignupSchema } from "@/validators/signupSchema";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/mailer"



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

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password , salt);

        const newUser = new User ( {
            username,
            email,
            password : hashedPassword
        })
        
        const saveUser = await newUser.save();
        console.log(saveUser);


        try{
            await sendEmail({
                email,
                emailType : "verify",
                userId : saveUser._id
            })
        }catch(emailError){
            console.error("Email sending failed:", emailError);
        }

        return NextResponse.json({
            success : true,
            message: "Account created! Please check you email to verify.",
            data: {
                username: saveUser.username,
                email: saveUser.email,
            }
        },
    {
        status: 201
    })

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

