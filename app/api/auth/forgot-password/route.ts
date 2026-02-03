import { NextRequest, NextResponse } from "next/server";
import { ForgetPasswordSchema } from "@/validators/forgotPasswordSchema";
import connectDB from "@/lib/db";
import { User } from "@/core/models/User.model";
import { sendEmail } from "@/utils/mailer";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
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
    catch (error: unknown) {
        console.error("Forgot password error", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred during forgot password",
        },
            {
                status: 500
            });
    }
}
