import { z} from "zod";
export const ForgetPasswordSchema = z.object({
    email : z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword,{
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
