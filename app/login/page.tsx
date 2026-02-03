"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { LoginSchema } from "@/validators/loginSchema";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {

    const router = useRouter();
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Zod validation
        const result = LoginSchema.safeParse(data);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("/api/auth/login", result.data);

            console.log(res.data);
            toast.success("Login successfully");

            setTimeout(() => {
                router.push("/profile")
            }, 1500);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Login failed");
            } else if (error instanceof Error) {
                console.error(error.message);
                toast.error("Login failed");
            }else{
                console.error("Unknown error:", error);
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };
      return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full  rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label> */}
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
    
                        <div>
                            {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label> */}
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
    
                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-end">
                            <Link 
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
    
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
    
                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{" "}
                            <Link 
                                href="/signup"
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
}