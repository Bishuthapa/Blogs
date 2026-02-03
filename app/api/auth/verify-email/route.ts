import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/core/models/User.model";
import crypto from "crypto";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Token is required",
            }, {
                status: 400
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            verifyToken: hashedToken,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid or expired verification token",
            }, {
                status: 400
            });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Email verified successfully",
        });
    }
    catch (error: unknown) {
        console.error("Verify email error", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred during email verification",
        },
            {
                status: 500
            });
    }
}
