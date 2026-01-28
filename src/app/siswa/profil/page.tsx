"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Camera,
    Save,
    X,
    Shield,
    Key,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Profile Info Section
// ============================================

function ProfileInfo() {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) return null;

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Informasi Profil</CardTitle>
                <Button
                    variant={isEditing ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    leftIcon={isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                >
                    {isEditing ? "Batal" : "Edit"}
                </Button>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                                <Camera className="h-4 w-4 text-gray-600" />
                            </button>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-gray-500">{user.email}</p>
                        <Badge variant="success" size="sm" className="mt-2" dot>
                            Akun Aktif
                        </Badge>
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <Input label="Nama Lengkap" defaultValue={user.name} />
                        <Input label="Email" type="email" defaultValue={user.email} />
                        <Input label="No. Telepon" type="tel" defaultValue="08123456789" />
                        <Input label="Alamat" defaultValue="Jl. Sukajadi No. 123, Bandung" />
                        <div className="flex gap-2 pt-2">
                            <Button onClick={() => setIsEditing(false)} className="flex-1">
                                <Save className="h-4 w-4 mr-2" />
                                Simpan
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">No. Telepon</p>
                                <p className="text-sm font-medium text-gray-900">08123456789</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Alamat</p>
                                <p className="text-sm font-medium text-gray-900">Jl. Sukajadi No. 123, Bandung</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Bergabung Sejak</p>
                                <p className="text-sm font-medium text-gray-900">15 Januari 2026</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================
// Security Section
// ============================================

function SecuritySection() {
    const [isChangePassword, setIsChangePassword] = useState(false);

    return (
        <>
            <Card variant="elevated">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Keamanan Akun
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">Password</p>
                                <p className="text-xs text-gray-400">Terakhir diubah: 15 Jan 2026</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsChangePassword(true)}>
                            Ubah
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-green-900">Verifikasi Email</p>
                                <p className="text-xs text-green-700">Email Anda sudah terverifikasi</p>
                            </div>
                        </div>
                        <Badge variant="success" size="sm">Aktif</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Modal */}
            <Modal
                isOpen={isChangePassword}
                onClose={() => setIsChangePassword(false)}
                title="Ubah Password"
            >
                <div className="space-y-4">
                    <Input label="Password Lama" type="password" placeholder="Masukkan password lama" />
                    <Input label="Password Baru" type="password" placeholder="Masukkan password baru" />
                    <Input label="Konfirmasi Password" type="password" placeholder="Konfirmasi password baru" />
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" onClick={() => setIsChangePassword(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button className="flex-1">Simpan</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

// ============================================
// Main Profile Page
// ============================================

export default function ProfilPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <CardSkeleton lines={6} />
                    <CardSkeleton lines={4} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-2xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola informasi akun Anda
                    </p>
                </motion.div>

                {/* Profile Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ProfileInfo />
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <SecuritySection />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
