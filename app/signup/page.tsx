"use client";
import React from "react";
import { useState } from "react";
import { SignupSchema } from "@/validators/signupSchema";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";



export default function Signup() {

    const router = useRouter();

    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {

        e.preventDefault();

        const result = SignupSchema.safeParse(data);

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }


        setLoading(true);

        try {
            const res = await axios.post("/api/auth/signup", result.data);
            console.log(res.data)

            toast.success("Account created! Check your email to verify email");

            // redirect after success
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)

            }
            toast.error("Signup Failed");
        }
        finally {
            setLoading(false);
        }
    };



    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <form
                    onSubmit={handleSignup}
                    className="w-full max-w-md space-y-4 rounded-xl border p-6 shadow"
                >
                    <h1 className="text-2xl font-bold text-center">Create Account</h1>

                    <input
                        name="username"
                        placeholder="Username"
                        value={data.username}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="confirm password"
                        value={data.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded bg-black py-2 text-white disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </>
    )
}