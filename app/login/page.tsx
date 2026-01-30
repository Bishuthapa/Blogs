"Use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { LoginSchema } from "@/validators/loginSchema";
import { useRouter } from "next/router";

export default function Login() {

    const router = useRouter();


    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();
        const { password, email } = data;
        // Zod validation
        const result = LoginSchema.safeParse(data);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        setLoading(true);


        try {

            const res = await axios({
                method: "post",
                url: "api/users/login",
                data: JSON.stringify(result)
            }).then(() => {
                toast.success("Login successfully");

                setTimeout(() => {
                    router.push("/profile");
                }, 1500);
            });
            console.log(res);


        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                toast.error("Login failed");

            }
        } finally {
            setLoading(false);
        }
        return (
            <>
                <div className="flex min-h-screen items-center justify-center">
                    <form
                        onSubmit={handleLogin}
                        className="w-full max-w-md space-y-4 rounded-xl border p-6 shadow"
                    >
                        <h1 className="text-2xl font-bold text-center">Login Account</h1>

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
                        <button
                            disabled={loading}
                            className="w-full rounded bg-black py-2 text-white disabled:opacity-60"
                        >
                            {loading ? "Loging..." : "Login"}
                        </button>
                    </form>
                </div>
            </>
        )
    }
}