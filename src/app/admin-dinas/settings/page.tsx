"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Save,
    Upload,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Globe,
    Image,
    Clock,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";

// ============================================
// Settings Page
// ============================================

export default function SettingsPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        initialize();
    }, [initialize]);

    const tabs = [
        { id: "general", label: "Umum" },
        { id: "jadwal", label: "Jadwal SPMB" },
        { id: "notifikasi", label: "Notifikasi" },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <CardSkeleton lines={8} />
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
                    <p className="text-gray-500 mt-1">Konfigurasi sistem SPMB</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
                                    ? "bg-primary text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* General Settings */}
                {activeTab === "general" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    Informasi Dinas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Nama Dinas" defaultValue="Dinas Pendidikan Kota Bandung" />
                                    <Input label="Kabupaten/Kota" defaultValue="Kota Bandung" />
                                    <Input label="Provinsi" defaultValue="Jawa Barat" />
                                    <Input label="Alamat" defaultValue="Jl. Jendral Sudirman No. 123" />
                                    <Input label="Telepon" leftIcon={<Phone className="h-4 w-4" />} defaultValue="022-1234567" />
                                    <Input label="Email" leftIcon={<Mail className="h-4 w-4" />} defaultValue="dinas@bandung.go.id" />
                                    <Input label="Website" leftIcon={<Globe className="h-4 w-4" />} defaultValue="https://disdik.bandung.go.id" />
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Logo & Tanda Tangan</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                            <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Logo Dinas</p>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                <Upload className="h-4 w-4 mr-2" /> Upload
                                            </Button>
                                        </div>
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                            <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Tanda Tangan Digital</p>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                <Upload className="h-4 w-4 mr-2" /> Upload
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>Simpan Perubahan</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Jadwal SPMB */}
                {activeTab === "jadwal" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Jadwal SPMB 2026/2027
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input type="date" label="Mulai Pendaftaran" defaultValue="2026-01-15" />
                                    <Input type="date" label="Akhir Pendaftaran" defaultValue="2026-02-28" />
                                    <Input type="date" label="Tanggal Seleksi" defaultValue="2026-03-10" />
                                    <Input type="date" label="Tanggal Pengumuman" defaultValue="2026-03-15" />
                                    <Input type="date" label="Mulai Daftar Ulang" defaultValue="2026-03-16" />
                                    <Input type="date" label="Akhir Daftar Ulang" defaultValue="2026-03-25" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>Simpan Jadwal</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Notifikasi */}
                {activeTab === "notifikasi" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    Pengaturan Notifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { label: "Email konfirmasi pendaftaran", enabled: true },
                                    { label: "Notifikasi verifikasi berkas", enabled: true },
                                    { label: "Pengumuman hasil seleksi", enabled: true },
                                    { label: "Reminder daftar ulang", enabled: true },
                                    { label: "WhatsApp notifikasi", enabled: false },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-900">{item.label}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>Simpan Pengaturan</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
