"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    Shield,
    Mail,
    Phone,
    Home,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface UserData {
    id: string;
    nama: string;
    email: string;
    phone: string;
    role: "super_admin" | "admin_dinas" | "admin_sekolah";
    instansi: string;
    status: "aktif" | "nonaktif";
    lastLogin: string;
}

// ============================================
// User Form Modal
// ============================================

function UserFormModal({
    isOpen,
    onClose,
    user,
}: {
    isOpen: boolean;
    onClose: () => void;
    user?: UserData | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit Pengguna" : "Tambah Pengguna"} size="md">
            <div className="space-y-4">
                <Input label="Nama Lengkap" placeholder="Nama pengguna" defaultValue={user?.nama} />
                <Input label="Email" type="email" placeholder="email@domain.com" defaultValue={user?.email} />
                <Input label="No. Telepon" placeholder="08xxxxxxxxxx" defaultValue={user?.phone} />
                <Select
                    label="Role"
                    value={user?.role || "admin_dinas"}
                    options={[
                        { value: "super_admin", label: "Super Admin" },
                        { value: "admin_dinas", label: "Admin Dinas" },
                        { value: "admin_sekolah", label: "Admin Sekolah" },
                    ]}
                />
                <Input label="Instansi" placeholder="Nama dinas/sekolah" defaultValue={user?.instansi} />
                {!user && (
                    <>
                        <Input label="Password" type="password" placeholder="Minimal 8 karakter" />
                        <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" />
                    </>
                )}
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
                    <Button className="flex-1">Simpan</Button>
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
    const [filterRole, setFilterRole] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const users: UserData[] = [
        { id: "1", nama: "Super Admin", email: "superadmin@spmb.id", phone: "081234567890", role: "super_admin", instansi: "SPMB Pusat", status: "aktif", lastLogin: "1 jam lalu" },
        { id: "2", nama: "Admin Dinas Bandung", email: "dinas@bandung.go.id", phone: "081234567891", role: "admin_dinas", instansi: "Dinas Pendidikan Kota Bandung", status: "aktif", lastLogin: "2 jam lalu" },
        { id: "3", nama: "Admin Dinas Cimahi", email: "dinas@cimahi.go.id", phone: "081234567892", role: "admin_dinas", instansi: "Dinas Pendidikan Kota Cimahi", status: "aktif", lastLogin: "1 hari lalu" },
        { id: "4", nama: "Admin SDN 1 Sukajadi", email: "admin@sdn1sukajadi.edu.id", phone: "081234567893", role: "admin_sekolah", instansi: "SDN 1 Sukajadi", status: "aktif", lastLogin: "3 jam lalu" },
        { id: "5", nama: "Admin SMPN 1 Bandung", email: "admin@smpn1bdg.edu.id", phone: "081234567894", role: "admin_sekolah", instansi: "SMPN 1 Bandung", status: "nonaktif", lastLogin: "1 minggu lalu" },
    ];

    const filteredUsers = users.filter((u) => {
        const matchSearch = u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
        const matchRole = filterRole === "all" || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const roleColors = {
        super_admin: "bg-red-100 text-red-600",
        admin_dinas: "bg-blue-100 text-blue-600",
        admin_sekolah: "bg-green-100 text-green-600",
    };

    const roleLabels = {
        super_admin: "Super Admin",
        admin_dinas: "Admin Dinas",
        admin_sekolah: "Admin Sekolah",
    };

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
                        <h1 className="text-2xl font-bold text-gray-900">Pengguna</h1>
                        <p className="text-gray-500 mt-1">Kelola semua pengguna sistem</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedUser(null); setIsFormOpen(true); }}>
                        Tambah Pengguna
                    </Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total", value: "156", color: "bg-gray-500" },
                        { label: "Super Admin", value: "3", color: "bg-red-500" },
                        { label: "Admin Dinas", value: "45", color: "bg-blue-500" },
                        { label: "Admin Sekolah", value: "108", color: "bg-green-500" },
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
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                options={[
                                    { value: "all", label: "Semua Role" },
                                    { value: "super_admin", label: "Super Admin" },
                                    { value: "admin_dinas", label: "Admin Dinas" },
                                    { value: "admin_sekolah", label: "Admin Sekolah" },
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
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Pengguna</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Instansi</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
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
                                                <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium", roleColors[user.role])}>
                                                    <Shield className="h-3 w-3" />
                                                    {roleLabels[user.role]}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{user.instansi}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={user.status === "aktif" ? "success" : "secondary"} size="sm" dot>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setIsFormOpen(true); }}>
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

            <UserFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} user={selectedUser} />
        </DashboardLayout>
    );
}
