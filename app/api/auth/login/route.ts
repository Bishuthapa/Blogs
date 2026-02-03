import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from '@/validators/loginSchema';
import connectDB from "@/lib/db";
import { User } from "@/core/models/User.model";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

await connectDB();

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        const result = LoginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error.flatten().fieldErrors,
                },
                {
                    status: 400
                }
            )
        }

        const { email, password } = result.data;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password"
            },
                {
                    status: 401
                })
        }

        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json({
                success: false,
                message: "Invalid password"
            },
                {
                    status: 401
                })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not configure");
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        const response = NextResponse.json(
            {
                success: true,
                message: "User logged in successfully",
                data: {
                    username: user.username,
                    email: user.email,
                }
            },
            {
                status: 200
            }
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        })

        return response;

    }
    catch (error: unknown) {
        console.error("Login error", error);
        return NextResponse.json({
            success: false,
            message: "An error occure during login",
        },
            {
                status: 500
            });
    }
}
