"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Home,
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Users,
    School,
    BarChart3,
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

export interface DinasData {
    id: string;
    name: string;
    kabupaten: string;
    provinsi: string;
    email: string;
    telepon: string;
    alamat: string;
    kepala_dinas: string;
    nip_kepala_dinas: string;
    website?: string;
    created_at: string;
}

// ============================================
// Dinas Detail Modal
// ============================================

function DinasDetailModal({
    isOpen,
    onClose,
    dinas,
}: {
    isOpen,
    onClose: () => void;
    dinas: DinasData | null;
}) {
    if (!dinas) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Dinas Pendidikan" size="lg">
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Home className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{dinas.name}</h3>
                        <p className="text-sm text-gray-500">{dinas.kabupaten}, {dinas.provinsi}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium">{dinas.email}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Telepon</p>
                        <p className="text-sm font-medium">{dinas.telepon}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                        <p className="text-xs text-gray-400">Alamat</p>
                        <p className="text-sm font-medium">{dinas.alamat}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Kepala Dinas</p>
                        <p className="text-sm font-medium">{dinas.kepala_dinas}</p>
                        <p className="text-xs text-gray-500">NIP: {dinas.nip_kepala_dinas}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Website</p>
                        <p className="text-sm font-medium">{dinas.website || "-"}</p>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Tutup
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Add/Edit Modal
// ============================================

function DinasFormModal({
    isOpen,
    onClose,
    dinas,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    dinas?: DinasData | null;
    onSuccess: () => void;
}) {
    const { success, error } = useToastStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: "",
        kabupaten: "",
        provinsi: "",
        alamat: "",
        telepon: "",
        email: "",
        kepala_dinas: "",
        nip_kepala_dinas: "",
        website: ""
    });

    useEffect(() => {
        if (dinas) {
            setFormData({
                name: dinas.name,
                kabupaten: dinas.kabupaten,
                provinsi: dinas.provinsi,
                alamat: dinas.alamat,
                telepon: dinas.telepon,
                email: dinas.email,
                kepala_dinas: dinas.kepala_dinas,
                nip_kepala_dinas: dinas.nip_kepala_dinas,
                website: dinas.website || ""
            });
        } else {
            setFormData({
                name: "",
                kabupaten: "",
                provinsi: "",
                alamat: "",
                telepon: "",
                email: "",
                kepala_dinas: "",
                nip_kepala_dinas: "",
                website: ""
            });
        }
    }, [dinas, isOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (dinas) {
                await api.put(`/dinas/${dinas.id}`, formData);
                success("Dinas berhasil diperbarui!");
            } else {
                await api.post("/dinas/", formData);
                success("Dinas baru berhasil ditambahkan!");
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            error(err.message || "Gagal menyimpan data dinas");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={dinas ? "Edit Dinas" : "Tambah Dinas"} size="md">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <Input
                    label="Nama Dinas"
                    placeholder="Dinas Pendidikan..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Kabupaten/Kota"
                        placeholder="Kota Bandung"
                        value={formData.kabupaten}
                        onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                    />
                    <Input
                        label="Provinsi"
                        placeholder="Jawa Barat"
                        value={formData.provinsi}
                        onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    />
                </div>
                <Input
                    label="Alamat"
                    placeholder="Jl. Merdeka No. 1"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="dinas@edu.id"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                        label="Telepon"
                        placeholder="022-xxxxxxx"
                        value={formData.telepon}
                        onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    />
                </div>
                <Input
                    label="Kepala Dinas"
                    placeholder="Nama Lengkap"
                    value={formData.kepala_dinas}
                    onChange={(e) => setFormData({ ...formData, kepala_dinas: e.target.value })}
                />
                <Input
                    label="NIP Kepala Dinas"
                    placeholder="xxxxxxxxxxxxxxxxxx"
                    value={formData.nip_kepala_dinas}
                    onChange={(e) => setFormData({ ...formData, nip_kepala_dinas: e.target.value })}
                />
                <Input
                    label="Website"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
                <div className="flex gap-2 pt-4 sticky bottom-0 bg-white">
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

export default function DinasPage() {
    const { initialize, isInitialized } = useDataStore();
    const { success, error } = useToastStore();
    const [search, setSearch] = useState("");
    const [dinasList, setDinasList] = useState<DinasData[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [selectedDinas, setSelectedDinas] = useState<DinasData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchData = async () => {
        setIsDataLoading(true);
        try {
            const [dinasRes, statsRes] = await Promise.all([
                api.get<DinasData[]>("/dinas/"),
                api.get<any>("/stats/summary"),
            ]);
            setDinasList(dinasRes);
            setStats(statsRes);
        } catch (err: any) {
            console.error("Failed to fetch dinas:", err);
            error("Gagal mengambil data dinas");
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        initialize().then(() => {
            fetchData();
        });
    }, [initialize]);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus dinas ini? Semua data terkait mungkin akan terpengaruh.")) return;
        try {
            await api.delete(`/dinas/${id}`);
            success("Dinas berhasil dihapus!");
            fetchData();
        } catch (err: any) {
            error(err.message || "Gagal menghapus dinas");
        }
    };

    const filteredDinas = dinasList.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) || d.kabupaten.toLowerCase().includes(search.toLowerCase())
    );

    if (!isInitialized || isDataLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <CardSkeleton lines={2} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Dinas Pendidikan</h1>
                        <p className="text-gray-500 mt-1">Kelola data dinas pendidikan</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedDinas(null); setIsFormOpen(true); }}>
                        Tambah Dinas
                    </Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total Dinas", value: stats?.total_dinas || 0, color: "bg-blue-500", icon: Home },
                        { label: "Aktif", value: stats?.active_dinas || 0, color: "bg-green-500", icon: Home },
                        { label: "Total Sekolah", value: stats?.total_sekolah || 0, color: "bg-purple-500", icon: School },
                        { label: "Total Siswa", value: stats?.total_siswa || 0, color: "bg-amber-500", icon: Users },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 border border-gray-100"
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3", stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="py-4">
                        <Input
                            placeholder="Cari dinas..."
                            leftIcon={<Search className="h-4 w-4" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Dinas</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Telepon</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDinas.map((d, index) => (
                                        <motion.tr
                                            key={d.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Home className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{d.name}</p>
                                                        <p className="text-xs text-gray-500">{d.provinsi}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{d.kabupaten}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{d.email}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{d.telepon}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedDinas(d); setIsDetailOpen(true); }}>
                                                        <Eye className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedDinas(d); setIsFormOpen(true); }}>
                                                        <Edit className="h-4 w-4 text-amber-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)}>
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

            <DinasDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} dinas={selectedDinas} />
            <DinasFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                dinas={selectedDinas}
                onSuccess={fetchData}
            />
        </DashboardLayout>
    );
}
