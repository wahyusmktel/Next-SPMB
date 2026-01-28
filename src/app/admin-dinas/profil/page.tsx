"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Shield,
    Edit,
    Save,
    Upload,
    Calendar,
    Building,
    MapPin,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";

// ============================================
// Main Page
// ============================================

export default function ProfilPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                        <p className="text-gray-500 mt-1">Informasi akun Admin Dinas</p>
                    </div>
                    <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        leftIcon={isEditing ? undefined : <Edit className="h-4 w-4" />}
                    >
                        {isEditing ? "Batal" : "Edit Profil"}
                    </Button>
                </motion.div>

                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card variant="elevated">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0 text-center">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl mx-auto">
                                        {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "AD"}
                                    </div>
                                    {isEditing && (
                                        <Button variant="outline" size="sm" className="mt-3">
                                            <Upload className="h-4 w-4 mr-2" /> Ganti Foto
                                        </Button>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{user?.name || "Admin Dinas"}</h2>
                                            <p className="text-gray-500">{user?.email || "admin@dinas.go.id"}</p>
                                        </div>
                                        <Badge variant="info" size="lg">
                                            <Shield className="h-4 w-4 mr-1" />
                                            Admin Dinas
                                        </Badge>
                                    </div>

                                    {/* Dinas Info */}
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-4">
                                        <div className="flex items-center gap-3">
                                            <Building className="h-6 w-6 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-blue-900">Dinas Pendidikan Kota Bandung</p>
                                                <p className="text-sm text-blue-600">Jl. Ahmad Yani No. 239, Bandung</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Email</p>
                                                <p className="text-sm font-medium">{user?.email || "admin@dinas.go.id"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Telepon</p>
                                                <p className="text-sm font-medium">{user?.phone || "022-1234567"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Wilayah</p>
                                                <p className="text-sm font-medium">Kota Bandung, Jawa Barat</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Terdaftar Sejak</p>
                                                <p className="text-sm font-medium">1 Januari 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Edit Form */}
                {isEditing && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg">Edit Informasi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Nama Lengkap" defaultValue={user?.name || "Admin Dinas"} />
                                    <Input label="Email" type="email" defaultValue={user?.email || "admin@dinas.go.id"} disabled />
                                    <Input label="No. Telepon" defaultValue={user?.phone || "022-1234567"} />
                                    <Input label="Jabatan" defaultValue="Administrator Dinas" />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
                                    <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => setIsEditing(false)}>
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Activity */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="text-lg">Aktivitas Terakhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { action: "Login ke sistem", time: "Hari ini, 09:30", icon: User },
                                    { action: "Memverifikasi sekolah baru", time: "Kemarin, 14:20", icon: Building },
                                    { action: "Membalas tiket bantuan", time: "2 hari lalu", icon: Mail },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg">
                                            <item.icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.action}</p>
                                            <p className="text-xs text-gray-500">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
