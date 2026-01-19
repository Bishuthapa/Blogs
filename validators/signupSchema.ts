import {  z } from "zod"

export const SignupSchema = z.object(
    {
        username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(26, "Username must not exceed 26 characters"),
        email: z.string().email("Invalid email"),
        password : z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password == data.confirmPassword, {
        message : "Password do not match",
        path: ['confirmPassword']
    })