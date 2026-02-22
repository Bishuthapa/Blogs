import { User } from "@/core/models/User.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { SendEmailParams } from "@/types";
import { IUser } from "@/types";
const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN!,
  })
);

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams) => {
  try {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    
    const updateFields: Partial<IUser> = {};
    if (emailType === "verify") {
      updateFields.verifyToken = hashedToken;
      updateFields.verifyTokenExpiry = Date.now() + 3600000;
    } else {
      updateFields.forgetPasswordToken = hashedToken;
      updateFields.forgetPasswordTokenExpiry = Date.now() + 3600000;
    }

    // Wait for DB update before sending email
    await User.updateOne({ _id: userId }, { $set: updateFields });

    // 2️⃣ Construct the link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const link =
      emailType === "verify"
        ? `${baseUrl}/verify-email?token=${rawToken}`
        : `${baseUrl}/reset-password?token=${rawToken}`;

    // 3️⃣ Send email
    await transport.sendMail({
      from: { address: "hello@bishesh0.com.np", name: "Auth Team" },
      to: email,
      subject: emailType === "verify" ? "Verify your email" : "Reset your password",
      html: `
        <p>Click below to ${emailType === "verify" ? "verify your email" : "reset your password"}:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("Email sent with token:", rawToken);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
};







// import { User } from "@/core/models/User.model";
// import crypto from "crypto"
// import nodemailer from "nodemailer"
// //import bcryptjs from "bcryptjs";
// import { SendEmailParams } from "@/types"

// // export const sendEmail = async ({
// //     email,
// //     emailType,
// //     userId,

// // }: SendEmailParams) => {}


// export const sendEmail = async({
//     email, emailType, userId
// }: SendEmailParams) => {
//     try{
        
//         const rawToken = crypto.randomBytes(32).toString("hex");
        

//         const hashedToken = crypto
//                     .createHash("sha256")
//                     .update(rawToken)
//                     .digest("hex");

//         if(emailType === "verify"){
//         await User.findByIdAndUpdate(userId, { $set: {
//             verifyToken: hashedToken,
//             verifyTokenExpiry: Date.now() + 3600000,
            
//         }})
//     }
//     else {
//         await User.findByIdAndUpdate(userId , { $set: {
//             forgetPasswordToken: hashedToken,
//             forgetPasswordTokenExpiry: Date.now() + 3600000,
//         }
//         })
//     }

//       if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
//             throw new Error("MAILTRAP_USER or MAILTRAP_PASS is not defined");
//         }

//         const transport = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: process.env.MAILTRAP_USER!,
//                 pass: process.env.MAILTRAP_PASS!,
//             },
//         });


//         const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//         const link =
//             emailType === "verify"
//                 ? `${baseUrl}/verify-email?token=${rawToken}`
//                 : `${baseUrl}/reset-password?token=${rawToken}`;

//         // 6️⃣ Send email
//         const info = await transport.sendMail({
//             from: '"Auth Team" <no-reply@yourapp.com>',
//             to: email,
//             subject:
//                 emailType === "verify"
//                     ? "Verify your email"
//                     : "Reset your password",
//             html: `
//             <p>Click the link below to ${emailType === "verify" ? "verify your email" : "reset your password"
//                 }:</p>
//         <a href="${link}">${link}</a>
//         <p>This link expires in 1 hour.</p>
//       `,
//         });

//         console.log("Email sent:", info.messageId);
//         return {success: true};
        
        

//     }catch(error){
//         console.error("Email error:", error);
//     }
// }


