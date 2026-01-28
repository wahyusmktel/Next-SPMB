"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email dan password harus diisi");
            return;
        }

        const success = await login(email, password);
        if (success) {
            // Redirect based on role
            const user = useAuthStore.getState().user;
            if (user) {
                switch (user.role) {
                    case "super_admin":
                        router.push("/super-admin");
                        break;
                    case "admin_dinas":
                        router.push("/admin-dinas");
                        break;
                    case "admin_sekolah":
                        router.push("/admin-sekolah");
                        break;
                    case "siswa":
                        router.push("/siswa");
                        break;
                    default:
                        router.push("/");
                }
            }
        } else {
            setError("Email atau password salah");
        }
    };

    // Demo accounts for testing
    const demoAccounts = [
        { role: "Super Admin", email: "super.admin@edu.id" },
        { role: "Admin Dinas", email: "admin.bandung@edu.id" },
        { role: "Admin Sekolah", email: "admin.sdn1.sukajadi@edu.id" },
        { role: "Siswa", email: "ahmad.pratama@gmail.com" },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-xl text-primary">SPMB</span>
                            <span className="block text-xs text-gray-500">
                                Penerimaan Murid Baru
                            </span>
                        </div>
                    </Link>

                    {/* Header */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Selamat Datang Kembali
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="h-5 w-5" />}
                            error={error && !email ? "Email harus diisi" : undefined}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-gray-600">Ingat saya</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Lupa password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                            Masuk
                        </Button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>

                    {/* Demo Accounts */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-medium text-gray-500 mb-3">
                            Demo Accounts (Password: password123)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.email}
                                    type="button"
                                    onClick={() => {
                                        setEmail(account.email);
                                        setPassword("password123");
                                    }}
                                    className="p-2 text-left text-xs bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                                >
                                    <span className="font-medium text-gray-900">{account.role}</span>
                                    <span className="block text-gray-500 truncate">{account.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary to-secondary items-center justify-center p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-lg text-center text-white"
                >
                    {/* Floating Elements */}
                    <div className="relative mb-8">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-8xl"
                        >
                            🎓
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0], x: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-4 -right-4 text-4xl"
                        >
                            ⭐
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -10, 0], x: [0, -10, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity }}
                            className="absolute -bottom-4 -left-4 text-4xl"
                        >
                            📚
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4">
                        Sistem Penerimaan Murid Baru
                    </h2>
                    <p className="text-white/80 text-lg">
                        Platform pendaftaran online yang mudah, cepat, dan transparan untuk
                        jenjang SD dan SMP di bawah naungan Dinas Pendidikan.
                    </p>

                    {/* Features */}
                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[
                            { icon: "📱", text: "100% Online" },
                            { icon: "⚡", text: "Proses Cepat" },
                            { icon: "🔒", text: "Data Aman" },
                        ].map((feature) => (
                            <div
                                key={feature.text}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                            >
                                <div className="text-3xl mb-2">{feature.icon}</div>
                                <div className="text-sm font-medium">{feature.text}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
