"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    Mail,
    Phone,
    School,
    Shield,
    MoreHorizontal,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface AdminUser {
    id: string;
    nama: string;
    email: string;
    phone: string;
    sekolah: string;
    status: "aktif" | "nonaktif";
    lastLogin: string;
}

// ============================================
// User Form Modal
// ============================================

function UserModal({
    isOpen,
    onClose,
    user,
}: {
    isOpen: boolean;
    onClose: () => void;
    user?: AdminUser | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit Admin" : "Tambah Admin"} size="md">
            <div className="space-y-4">
                <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" defaultValue={user?.nama} />
                <Input label="Email" type="email" placeholder="email@sekolah.edu.id" defaultValue={user?.email} />
                <Input label="No. Telepon" type="tel" placeholder="08xxxxxxxxxx" defaultValue={user?.phone} />
                <Select
                    label="Sekolah"
                    defaultValue=""
                    options={[
                        { value: "", label: "Pilih Sekolah" },
                        { value: "sdn1", label: "SDN 1 Sukajadi" },
                        { value: "sdn2", label: "SDN 2 Sukasari" },
                        { value: "smpn1", label: "SMPN 1 Bandung" },
                        { value: "smpn2", label: "SMPN 2 Bandung" },
                    ]}
                />
                {!user && (
                    <>
                        <Input label="Password" type="password" placeholder="Minimal 8 karakter" />
                        <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" />
                    </>
                )}
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" defaultChecked={user?.status === "aktif" ?? true} className="rounded border-gray-300" />
                    <label htmlFor="isActive" className="text-sm text-gray-700">Aktifkan akun</label>
                </div>
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button className="flex-1">
                        {user ? "Simpan Perubahan" : "Tambah Admin"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Page
// ============================================

export default function UsersPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const users: AdminUser[] = [
        { id: "1", nama: "Budi Santoso", email: "budi@sdn1sukajadi.edu.id", phone: "081234567890", sekolah: "SDN 1 Sukajadi", status: "aktif", lastLogin: "2 jam lalu" },
        { id: "2", nama: "Siti Rahayu", email: "siti@sdn2sukasari.edu.id", phone: "081234567891", sekolah: "SDN 2 Sukasari", status: "aktif", lastLogin: "5 jam lalu" },
        { id: "3", nama: "Ahmad Hidayat", email: "ahmad@smpn1bdg.edu.id", phone: "081234567892", sekolah: "SMPN 1 Bandung", status: "aktif", lastLogin: "1 hari lalu" },
        { id: "4", nama: "Dewi Lestari", email: "dewi@smpn2bdg.edu.id", phone: "081234567893", sekolah: "SMPN 2 Bandung", status: "nonaktif", lastLogin: "1 minggu lalu" },
        { id: "5", nama: "Eko Prasetyo", email: "eko@sdn3coblong.edu.id", phone: "081234567894", sekolah: "SDN 3 Coblong", status: "aktif", lastLogin: "3 jam lalu" },
    ];

    const filteredUsers = users.filter((u) => {
        const matchSearch = u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
        const matchStatus = filterStatus === "all" || u.status === filterStatus;
        return matchSearch && matchStatus;
    });

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <TableSkeleton rows={5} columns={5} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Admin Sekolah</h1>
                        <p className="text-gray-500 mt-1">Kelola akun admin sekolah</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}>
                        Tambah Admin
                    </Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Admin", value: "45", color: "bg-blue-500" },
                        { label: "Aktif", value: "38", color: "bg-green-500" },
                        { label: "Nonaktif", value: "7", color: "bg-gray-400" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 border border-gray-100"
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3", stat.color)}>
                                <Users className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari nama atau email..."
                                    leftIcon={<Search className="h-4 w-4" />}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                options={[
                                    { value: "all", label: "Semua Status" },
                                    { value: "aktif", label: "Aktif" },
                                    { value: "nonaktif", label: "Nonaktif" },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Admin</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Login Terakhir</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-sm">
                                                        {user.nama.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.nama}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <School className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{user.sekolah}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge
                                                    variant={user.status === "aktif" ? "success" : "secondary"}
                                                    size="sm"
                                                    dot
                                                >
                                                    {user.status === "aktif" ? "Aktif" : "Nonaktif"}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{user.lastLogin}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
            />
        </DashboardLayout>
    );
}
