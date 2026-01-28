"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    User,
    Bell,
    Lock,
    Shield,
    Mail,
    Smartphone,
    Save,
    Eye,
    EyeOff,
    School,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Tab Component
// ============================================

function SettingsTab({
    tabs,
    activeTab,
    onTabChange,
}: {
    tabs: { id: string; label: string; icon: React.ElementType }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                        activeTab === tab.id
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ============================================
// Main Page
// ============================================

export default function SettingsPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profil");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const tabs = [
        { id: "profil", label: "Profil", icon: User },
        { id: "keamanan", label: "Keamanan", icon: Lock },
        { id: "notifikasi", label: "Notifikasi", icon: Bell },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <CardSkeleton lines={6} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
                    <p className="text-gray-500 mt-1">Kelola pengaturan akun Anda</p>
                </motion.div>

                {/* Tabs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <SettingsTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                </motion.div>

                {/* Tab Content */}
                {activeTab === "profil" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Informasi Profil
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
                                        {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "AS"}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{user?.name || "Admin Sekolah"}</h4>
                                        <p className="text-sm text-gray-500">{user?.email || "admin@sekolah.edu.id"}</p>
                                        <Badge variant="success" size="sm" className="mt-1">Admin Sekolah</Badge>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4">
                                    <div className="flex items-center gap-3">
                                        <School className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-gray-900">SDN 1 Sukajadi</p>
                                            <p className="text-xs text-gray-500">NPSN: 20200001</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Nama Lengkap" defaultValue={user?.name || "Admin Sekolah"} />
                                    <Input label="Email" type="email" defaultValue={user?.email || "admin@sekolah.edu.id"} />
                                    <Input label="No. Telepon" defaultValue={user?.phone || "081234567890"} />
                                    <Input label="Jabatan" defaultValue="Admin SPMB" />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {activeTab === "keamanan" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-primary" />
                                    Ubah Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Password Lama"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password lama"
                                />
                                <Input
                                    label="Password Baru"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimal 8 karakter"
                                />
                                <Input
                                    label="Konfirmasi Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ulangi password baru"
                                />

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        {showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    </button>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Lock className="h-4 w-4" />}>
                                        Perbarui Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Keamanan Tambahan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">Autentikasi 2 Faktor</p>
                                            <p className="text-sm text-gray-500">Tingkatkan keamanan dengan 2FA</p>
                                        </div>
                                        <Badge variant="secondary">Tidak Aktif</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">Riwayat Login</p>
                                            <p className="text-sm text-gray-500">Login terakhir: Hari ini, 09:30</p>
                                        </div>
                                        <Button variant="outline" size="sm">Lihat Riwayat</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {activeTab === "notifikasi" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                    Preferensi Notifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { label: "Pendaftar Baru", desc: "Notifikasi ketika ada pendaftar baru", icon: User, checked: true },
                                        { label: "Notifikasi Email", desc: "Terima notifikasi via email", icon: Mail, checked: true },
                                        { label: "Notifikasi Push", desc: "Terima notifikasi browser", icon: Bell, checked: false },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg">
                                                    <item.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>
                                        Simpan Preferensi
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
