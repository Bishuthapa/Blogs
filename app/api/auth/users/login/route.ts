import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from '@/validators/loginSchema';
import { ForgetPasswordSchema, ResetPasswordSchema } from "@/validators/forgotPasswordSchema"
import connectDB from "@/core/database/db";
import { User } from "@/core/models/User.model";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/mailer";
import crypto from "crypto";
connectDB();

export async function POST(req: NextRequest) {


    try {
        const body = await req.json();
        const { action } = body;

        if (action === "forgot-password") {
            const result = ForgetPasswordSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json({
                    success: false,
                    error: result.error.flatten().fieldErrors,
                },
                    {
                        status: 400
                    });
            }

            const { email } = result.data;

            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({
                    success: true,
                    message: "If that email exists, a reset link has been sent",
                });
            }

            await sendEmail({
                email: user.email,
                emailType: "reset",
                userId: user._id.toString(),
            });


            return NextResponse.json({
                success: true,
                message: "Password reset email sent successfully",
            });
        }

        if (action === "reset-password") {
            const result = ResetPasswordSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json({
                    success: false,
                    error: result.error.flatten().fieldErrors,
                },
                    {
                        status: 400
                    });
            }

            const { token, password } = result.data;

            const hashedToken = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


            const user = await User.findOne({
                forgetPasswordToken: hashedToken,
                forgetPasswordTokenExpiry: { $gt: Date.now() },
            });

            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid or exprired reset token",
                }, {
                    status: 400
                });
            }

            const hashPassword = await bcryptjs.hash(password, 10);

            user.password = hashPassword;
            user.forgetPasswordToken = undefined;
            user.forgetPasswordTokenExpiry = undefined;
            await user.save();

            return NextResponse.json({
                success: true,
                message: "Password reset successfully",
            });
        }


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