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
            <p>This is login page</p>
        </>
    )
}