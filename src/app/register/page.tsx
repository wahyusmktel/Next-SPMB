"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    GraduationCap,
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { useDataStore } from "@/lib/store";
import { generateId } from "@/lib/uuid";

export default function RegisterPage() {
    const router = useRouter();
    const { initialize, sekolah, addUser, addSiswa, getUserByEmail } = useDataStore();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        // Step 1 - Account
        email: "",
        password: "",
        confirmPassword: "",
        // Step 2 - Personal
        namaLengkap: "",
        nisn: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "",
        phone: "",
        // Step 3 - School Selection
        jenjang: "",
        sekolahId: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize data if not already
    React.useEffect(() => {
        initialize();
    }, [initialize]);

    const updateForm = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = "Email harus diisi";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Format email tidak valid";
        else if (getUserByEmail(formData.email))
            newErrors.email = "Email sudah terdaftar";
        if (!formData.password) newErrors.password = "Password harus diisi";
        else if (formData.password.length < 8)
            newErrors.password = "Password minimal 8 karakter";
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Konfirmasi password harus diisi";
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Password tidak sama";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.namaLengkap) newErrors.namaLengkap = "Nama lengkap harus diisi";
        if (!formData.nisn) newErrors.nisn = "NISN harus diisi";
        else if (!/^\d{10}$/.test(formData.nisn))
            newErrors.nisn = "NISN harus 10 digit angka";
        if (!formData.tempatLahir) newErrors.tempatLahir = "Tempat lahir harus diisi";
        if (!formData.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir harus diisi";
        if (!formData.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin harus dipilih";
        if (!formData.phone) newErrors.phone = "Nomor telepon harus diisi";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.jenjang) newErrors.jenjang = "Jenjang harus dipilih";
        if (!formData.sekolahId) newErrors.sekolahId = "Sekolah harus dipilih";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep3()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const now = new Date();
        const userId = generateId();
        const siswaId = generateId();

        // Create new user account
        const newUser = {
            id: userId,
            email: formData.email,
            name: formData.namaLengkap,
            role: "siswa" as const,
            phone: formData.phone,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        };

        // Create siswa record
        const newSiswa = {
            id: siswaId,
            userId: userId,
            nisn: formData.nisn,
            nik: "",
            namaLengkap: formData.namaLengkap,
            tempatLahir: formData.tempatLahir,
            tanggalLahir: new Date(formData.tanggalLahir),
            jenisKelamin: formData.jenisKelamin as "L" | "P",
            agama: "Islam" as const,
            alamat: "",
            rt: "",
            rw: "",
            kelurahan: "",
            kecamatan: "",
            kabupaten: "",
            provinsi: "",
            kodePos: "",
            email: formData.email,
            telepon: formData.phone,
            createdAt: now,
            updatedAt: now,
        };

        // Save to store
        addUser(newUser);
        addSiswa(newSiswa);

        setIsLoading(false);
        setIsSuccess(true);
    };

    // Filter schools by jenjang
    const filteredSekolah = sekolah.filter(
        (s) => s.jenjang === formData.jenjang
    );

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                    >
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Pendaftaran Berhasil!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Akun Anda telah berhasil dibuat. Gunakan kredensial berikut untuk login:
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                        <div className="mb-2">
                            <span className="text-sm text-gray-500">Email:</span>
                            <p className="font-medium text-gray-900">{formData.email}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Password:</span>
                            <p className="font-medium text-gray-900">password123</p>
                        </div>
                        <p className="text-xs text-amber-600 mt-3">
                            * Password default untuk login adalah <strong>password123</strong>
                        </p>
                    </div>
                    <Link href="/login">
                        <Button size="lg" className="w-full">
                            Masuk ke Akun
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
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

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= s
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`flex-1 h-1 rounded-full transition-all ${step > s ? "bg-primary" : "bg-gray-100"
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="mb-8">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Buat Akun Baru
                                </h1>
                                <p className="text-gray-500 mb-6">
                                    Langkah 1: Informasi akun untuk login
                                </p>

                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        label="Email"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={(e) => updateForm("email", e.target.value)}
                                        leftIcon={<Mail className="h-5 w-5" />}
                                        error={errors.email}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        label="Password"
                                        placeholder="Minimal 8 karakter"
                                        value={formData.password}
                                        onChange={(e) => updateForm("password", e.target.value)}
                                        leftIcon={<Lock className="h-5 w-5" />}
                                        error={errors.password}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        label="Konfirmasi Password"
                                        placeholder="Ketik ulang password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateForm("confirmPassword", e.target.value)}
                                        leftIcon={<Lock className="h-5 w-5" />}
                                        error={errors.confirmPassword}
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Data Diri Siswa
                                </h1>
                                <p className="text-gray-500 mb-6">
                                    Langkah 2: Informasi data diri calon siswa
                                </p>

                                <div className="space-y-4">
                                    <Input
                                        label="Nama Lengkap"
                                        placeholder="Sesuai akta kelahiran"
                                        value={formData.namaLengkap}
                                        onChange={(e) => updateForm("namaLengkap", e.target.value)}
                                        leftIcon={<User className="h-5 w-5" />}
                                        error={errors.namaLengkap}
                                        required
                                    />
                                    <Input
                                        label="NISN"
                                        placeholder="10 digit angka"
                                        value={formData.nisn}
                                        onChange={(e) => updateForm("nisn", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        error={errors.nisn}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Tempat Lahir"
                                            placeholder="Kota/Kabupaten"
                                            value={formData.tempatLahir}
                                            onChange={(e) => updateForm("tempatLahir", e.target.value)}
                                            error={errors.tempatLahir}
                                            required
                                        />
                                        <Input
                                            type="date"
                                            label="Tanggal Lahir"
                                            value={formData.tanggalLahir}
                                            onChange={(e) => updateForm("tanggalLahir", e.target.value)}
                                            error={errors.tanggalLahir}
                                            required
                                        />
                                    </div>
                                    <Select
                                        label="Jenis Kelamin"
                                        placeholder="Pilih jenis kelamin"
                                        options={[
                                            { value: "L", label: "Laki-laki" },
                                            { value: "P", label: "Perempuan" },
                                        ]}
                                        value={formData.jenisKelamin}
                                        onChange={(value) => updateForm("jenisKelamin", value)}
                                        error={errors.jenisKelamin}
                                    />
                                    <Input
                                        label="Nomor Telepon/WhatsApp"
                                        placeholder="08xxxxxxxxxx"
                                        value={formData.phone}
                                        onChange={(e) => updateForm("phone", e.target.value)}
                                        leftIcon={<Phone className="h-5 w-5" />}
                                        error={errors.phone}
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Pilih Sekolah Tujuan
                                </h1>
                                <p className="text-gray-500 mb-6">
                                    Langkah 3: Tentukan jenjang dan sekolah tujuan
                                </p>

                                <div className="space-y-6">
                                    {/* Jenjang Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Jenjang Sekolah <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { value: "SD", label: "Sekolah Dasar", icon: "🏫" },
                                                { value: "SMP", label: "Sekolah Menengah", icon: "🎒" },
                                            ].map((option) => (
                                                <motion.button
                                                    key={option.value}
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        updateForm("jenjang", option.value);
                                                        updateForm("sekolahId", "");
                                                    }}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.jenjang === option.value
                                                        ? "border-primary bg-primary/5"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-2">{option.icon}</div>
                                                    <div className="font-semibold text-gray-900">
                                                        {option.value}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {option.label}
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                        {errors.jenjang && (
                                            <p className="mt-1 text-xs text-red-500">{errors.jenjang}</p>
                                        )}
                                    </div>

                                    {/* School Selection */}
                                    {formData.jenjang && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Select
                                                label="Pilih Sekolah"
                                                placeholder="Cari dan pilih sekolah..."
                                                searchable
                                                options={filteredSekolah.map((s) => ({
                                                    value: s.id,
                                                    label: `${s.name} - ${s.kecamatan}`,
                                                }))}
                                                value={formData.sekolahId}
                                                onChange={(value) => updateForm("sekolahId", value)}
                                                error={errors.sekolahId}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Terms */}
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-sm text-amber-800">
                                            <strong>Perhatian:</strong> Pastikan data yang Anda masukkan
                                            sudah benar. Data yang salah dapat menyebabkan pendaftaran
                                            ditolak.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                leftIcon={<ArrowLeft className="h-5 w-5" />}
                            >
                                Kembali
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                className="flex-1"
                                onClick={handleNext}
                                rightIcon={<ArrowRight className="h-5 w-5" />}
                            >
                                Lanjutkan
                            </Button>
                        ) : (
                            <Button
                                className="flex-1"
                                onClick={handleSubmit}
                                isLoading={isLoading}
                                rightIcon={<CheckCircle2 className="h-5 w-5" />}
                            >
                                Daftar Sekarang
                            </Button>
                        )}
                    </div>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary via-secondary to-primary items-center justify-center p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-lg text-center text-white"
                >
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-8xl mb-8"
                    >
                        ✏️
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-4">
                        Mulai Perjalanan Pendidikan
                    </h2>
                    <p className="text-white/80 text-lg mb-12">
                        Daftarkan putra/putri Anda ke sekolah terbaik di wilayah Anda
                        dengan proses yang mudah dan transparan.
                    </p>

                    {/* Steps Preview */}
                    <div className="space-y-4 text-left">
                        {[
                            { step: 1, title: "Buat Akun", desc: "Email dan password untuk login" },
                            { step: 2, title: "Data Diri", desc: "Informasi calon siswa" },
                            { step: 3, title: "Pilih Sekolah", desc: "Jenjang dan sekolah tujuan" },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${step === item.step
                                    ? "bg-white/20"
                                    : step > item.step
                                        ? "bg-white/10"
                                        : "opacity-50"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= item.step ? "bg-white text-primary" : "bg-white/30"
                                        }`}
                                >
                                    {step > item.step ? "✓" : item.step}
                                </div>
                                <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-white/70">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
