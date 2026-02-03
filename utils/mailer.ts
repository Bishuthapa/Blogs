import { User } from "@/core/models/User.model";
import crypto from "crypto"
import nodemailer from "nodemailer"
//import bcryptjs from "bcryptjs";
import { SendEmailParams } from "@/types"

// export const sendEmail = async ({
//     email,
//     emailType,
//     userId,

// }: SendEmailParams) => {}


export const sendEmail = async({
    email, emailType, userId
}: SendEmailParams) => {
    try{
        
        const rawToken = crypto.randomBytes(32).toString("hex");
        

        const hashedToken = crypto
                    .createHash("sha256")
                    .update(rawToken)
                    .digest("hex");

        if(emailType === "verify"){
        await User.findByIdAndUpdate(userId, { $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000,
            
        }})
    }
    else {
        await User.findByIdAndUpdate(userId , { $set: {
            forgetPasswordToken: hashedToken,
            forgetPasswordTokenExpiry: Date.now() + 3600000,
        }
        })
    }

      if (!process.env.MAILTRAP_TOKEN || !process.env.MAILTRAP_PASS) {
            throw new Error("MAILTRAP_API_KEY not defined");
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASS!,
            },
        });


        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const link =
            emailType === "verify"
                ? `${baseUrl}/verify-email?token=${rawToken}`
                : `${baseUrl}/reset-password?token=${rawToken}`;

        // 6️⃣ Send email
        const info = await transport.sendMail({
            from: '"Auth Team" <no-reply@yourapp.com>',
            to: email,
            subject:
                emailType === "verify"
                    ? "Verify your email"
                    : "Reset your password",
            html: `
            <p>Click the link below to ${emailType === "verify" ? "verify your email" : "reset your password"
                }:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 1 hour.</p>
      `,
        });

        console.log("Email sent:", info.messageId);
        return {success: true};
        
        

    }catch(error){
        console.error("Email error:", error);
    }
}

