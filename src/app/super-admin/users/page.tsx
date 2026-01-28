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
import { api } from "@/lib/api";
import { useToastStore } from "@/lib/toast-store";

// ============================================
// Types
// ============================================

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "super_admin" | "admin_dinas" | "admin_sekolah" | "siswa";
    dinas_id?: string;
    sekolah_id?: string;
    is_active: boolean;
    created_at: string;
    last_login_at?: string;
}

// ============================================
// User Form Modal
// ============================================

function UserFormModal({
    isOpen,
    onClose,
    user,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    user?: UserData | null;
    onSuccess: () => void;
}) {
    const { success, error } = useToastStore();
    const [isLoading, setIsLoading] = useState(false);
    const [dinasList, setDinasList] = useState<any[]>([]);
    const [sekolahList, setSekolahList] = useState<any[]>([]);

    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        phone: "",
        role: "admin_dinas",
        dinas_id: "",
        sekolah_id: "",
        password: "",
        is_active: true
    });

    useEffect(() => {
        const fetchInstansi = async () => {
            try {
                const [dinasRes, sekolahRes] = await Promise.all([
                    api.get<any[]>("/dinas/"),
                    api.get<any[]>("/sekolah/"),
                ]);
                setDinasList(dinasRes);
                setSekolahList(sekolahRes);
            } catch (err) {
                console.error("Failed to fetch instansi list", err);
            }
        };

        if (isOpen) {
            fetchInstansi();
        }
    }, [isOpen]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                dinas_id: user.dinas_id || "",
                sekolah_id: user.sekolah_id || "",
                is_active: user.is_active
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "admin_dinas",
                dinas_id: "",
                sekolah_id: "",
                password: "",
                is_active: true
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (user) {
                await api.put(`/users/${user.id}`, formData);
                success("Pengguna berhasil diperbarui!");
            } else {
                await api.post("/users/", formData);
                success("Pengguna baru berhasil ditambahkan!");
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            error(err.message || "Gagal menyimpan data pengguna");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit Pengguna" : "Tambah Pengguna"} size="md">
            <div className="space-y-4">
                <Input
                    label="Nama Lengkap"
                    placeholder="Nama pengguna"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                    label="No. Telepon"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Select
                    label="Role"
                    value={formData.role}
                    onChange={(val) => setFormData({ ...formData, role: val, dinas_id: "", sekolah_id: "" })}
                    options={[
                        { value: "super_admin", label: "Super Admin" },
                        { value: "admin_dinas", label: "Admin Dinas" },
                        { value: "admin_sekolah", label: "Admin Sekolah" },
                        { value: "siswa", label: "Siswa" },
                    ]}
                />

                {formData.role === "admin_dinas" && (
                    <Select
                        label="Dinas Terkait"
                        value={formData.dinas_id}
                        onChange={(val) => setFormData({ ...formData, dinas_id: val })}
                        options={dinasList.map(d => ({ value: d.id, label: d.name }))}
                    />
                )}

                {formData.role === "admin_sekolah" && (
                    <Select
                        label="Sekolah Terkait"
                        value={formData.sekolah_id}
                        onChange={(val) => setFormData({ ...formData, sekolah_id: val })}
                        options={sekolahList.map(s => ({ value: s.id, label: s.name }))}
                    />
                )}
                {!user && (
                    <>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Minimal 8 karakter"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </>
                )}
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Akun Aktif</label>
                </div>
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>Batal</Button>
                    <Button className="flex-1" onClick={handleSubmit} isLoading={isLoading}>Simpan</Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Page
// ============================================

export default function UsersPage() {
    const { initialize, isInitialized } = useDataStore();
    const { success, error } = useToastStore();
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [usersList, setUsersList] = useState<UserData[]>([]);
    const [dinasList, setDinasList] = useState<any[]>([]);
    const [sekolahList, setSekolahList] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const fetchData = async () => {
        setIsDataLoading(true);
        try {
            const [usersRes, statsRes, dinasRes, sekolahRes] = await Promise.all([
                api.get<UserData[]>("/users/"),
                api.get<any>("/stats/summary"),
                api.get<any[]>("/dinas/"),
                api.get<any[]>("/sekolah/"),
            ]);
            setUsersList(usersRes);
            setStats(statsRes);
            setDinasList(dinasRes);
            setSekolahList(sekolahRes);
        } catch (err: any) {
            console.error("Failed to fetch users:", err);
            error("Gagal mengambil data pengguna");
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        initialize().then(() => {
            fetchData();
        });
    }, [initialize]);

    const getInstansiName = (user: UserData) => {
        if (user.role === "admin_dinas") {
            return dinasList.find(d => d.id === user.dinas_id)?.name || "Dinas tidak terpilih";
        }
        if (user.role === "admin_sekolah") {
            return sekolahList.find(s => s.id === user.sekolah_id)?.name || "Sekolah tidak terpilih";
        }
        if (user.role === "super_admin") return "Seluruh Sistem";
        return "-";
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
        try {
            await api.delete(`/users/${id}`);
            success("Pengguna berhasil dihapus!");
            fetchData();
        } catch (err: any) {
            error(err.message || "Gagal menghapus pengguna");
        }
    };

    const filteredUsers = usersList.filter((u) => {
        const matchSearch = String(u.name || "").toLowerCase().includes(search.toLowerCase()) ||
            String(u.email || "").toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "all" || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const roleColors = {
        super_admin: "bg-red-100 text-red-600",
        admin_dinas: "bg-blue-100 text-blue-600",
        admin_sekolah: "bg-green-100 text-green-600",
        siswa: "bg-gray-100 text-gray-600",
    };

    const roleLabels = {
        super_admin: "Super Admin",
        admin_dinas: "Admin Dinas",
        admin_sekolah: "Admin Sekolah",
        siswa: "Siswa",
    };

    if (!isInitialized || isDataLoading) {
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
                        { label: "Total", value: stats?.total_users || 0, color: "bg-gray-500" },
                        { label: "Super Admin", value: stats?.roles?.super_admin || 0, color: "bg-red-500" },
                        { label: "Admin Dinas", value: stats?.roles?.admin_dinas || 0, color: "bg-blue-500" },
                        { label: "Admin Sekolah", value: stats?.roles?.admin_sekolah || 0, color: "bg-green-500" },
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
                                onChange={(val) => setFilterRole(val)}
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
                                    {filteredUsers.map((u, index) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-sm">
                                                        {u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{u.name}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium", roleColors[u.role as keyof typeof roleColors])}>
                                                    <Shield className="h-3 w-3" />
                                                    {roleLabels[u.role as keyof typeof roleLabels]}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{getInstansiName(u)}</span>
                                                    <span className="text-xs text-gray-400">{u.phone || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={u.is_active ? "success" : "secondary"} size="sm" dot>
                                                    {u.is_active ? "Aktif" : "Nonaktif"}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(u); setIsFormOpen(true); }}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>
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

            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                user={selectedUser}
                onSuccess={fetchData}
            />
        </DashboardLayout>
    );
}
