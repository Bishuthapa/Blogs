"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("/api/auth/users/login", {
                action: "forgot-password",
                email
            });
            toast.success(res.data.message);
            setEmail("");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
}