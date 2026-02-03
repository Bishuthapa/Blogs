import { NextRequest, NextResponse } from "next/server";
import { ResetPasswordSchema } from "@/validators/forgotPasswordSchema";
import connectDB from "@/lib/db";
import { User } from "@/core/models/User.model";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
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
                message: "Invalid or expired reset token",
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
    catch (error: unknown) {
        console.error("Reset password error", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred during password reset",
        },
            {
                status: 500
            });
    }
}
