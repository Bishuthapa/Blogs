"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            console.log("Resetting password with token:", token);
            
            const res = await axios.post("/api/auth/users/login", {
                action: "reset-password",
                token,
                password,
                confirmPassword,
            });

            console.log("Reset response:", res.data);
            
            toast.success(res.data.message || "Password reset successfully!");
            
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            console.error("Reset password error:", error);
            
            if (axios.isAxiosError(error)) {
                console.error("Error response:", error.response?.data);
                toast.error(error.response?.data?.message || "Reset failed");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-gray-400 rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
                    <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
                    <Link 
                        href="/forgot-password"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="max-w-md w-full bg-gray-500 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-center mb-4">Reset Password</h1>
                <p className="text-white text-center mb-8">
                    Enter your new password
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            minLength={8}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link 
                        href="/login"
                        className="text-sm text-white hover:text-white hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}