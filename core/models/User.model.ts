import { Schema, model, models } from "mongoose";
import { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            maxlength: [25, "Username cannot exceed 25 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        isVerified: {
            type: Boolean,
            default: false
        },
        isAdmine: {
            type: Boolean,
            default: false
        },
        forgetPasswordToken: String,
        forgetPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date
    },
    {
        timestamps: true
    },
)


export const User = models.User || model<IUser>("User", UserSchema);