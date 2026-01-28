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
    Palette,
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
        { id: "tampilan", label: "Tampilan", icon: Palette },
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
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
                    <p className="text-gray-500 mt-1">Kelola pengaturan akun dan preferensi Anda</p>
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
                                        {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "SW"}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{user?.name || "Siswa Demo"}</h4>
                                        <p className="text-sm text-gray-500">{user?.email || "siswa@demo.com"}</p>
                                        <Badge variant="warning" size="sm" className="mt-1">Calon Siswa</Badge>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Nama Lengkap" defaultValue={user?.name || "Siswa Demo"} />
                                    <Input label="Email" type="email" defaultValue={user?.email || "siswa@demo.com"} />
                                    <Input label="No. Telepon" defaultValue={user?.phone || "081234567890"} />
                                    <Input label="NISN" defaultValue="0012345678" disabled />
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
                                    Keamanan Akun
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">Email Terverifikasi</p>
                                            <p className="text-sm text-gray-500">{user?.email || "siswa@demo.com"}</p>
                                        </div>
                                        <Badge variant="success">Terverifikasi</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">Login Terakhir</p>
                                            <p className="text-sm text-gray-500">Hari ini, 09:30 WIB</p>
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
                                        { label: "Status Pendaftaran", desc: "Notifikasi update status pendaftaran", icon: User, checked: true },
                                        { label: "Pengumuman", desc: "Notifikasi pengumuman dari sekolah", icon: Bell, checked: true },
                                        { label: "Notifikasi Email", desc: "Terima notifikasi via email", icon: Mail, checked: true },
                                        { label: "Notifikasi SMS", desc: "Terima notifikasi via SMS", icon: Smartphone, checked: false },
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

                {activeTab === "tampilan" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-primary" />
                                    Tampilan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">Mode Gelap</p>
                                            <p className="text-sm text-gray-500">Gunakan tema gelap</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">Ukuran Font</p>
                                            <p className="text-sm text-gray-500">Sesuaikan ukuran teks</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {["S", "M", "L"].map((size) => (
                                                <button
                                                    key={size}
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg font-medium text-sm",
                                                        size === "M" ? "bg-primary text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
