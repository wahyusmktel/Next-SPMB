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

// ============================================
// Types
// ============================================

interface DinasData {
    id: string;
    nama: string;
    kabupaten: string;
    provinsi: string;
    email: string;
    telepon: string;
    jumlahSekolah: number;
    jumlahAdmin: number;
    status: "aktif" | "nonaktif";
}

// ============================================
// Dinas Detail Modal
// ============================================

function DinasDetailModal({
    isOpen,
    onClose,
    dinas,
}: {
    isOpen: boolean;
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
                        <h3 className="font-semibold text-gray-900">{dinas.nama}</h3>
                        <p className="text-sm text-gray-500">{dinas.kabupaten}, {dinas.provinsi}</p>
                        <Badge variant={dinas.status === "aktif" ? "success" : "secondary"} size="sm" className="mt-1">
                            {dinas.status}
                        </Badge>
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
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Jumlah Sekolah</p>
                        <p className="text-sm font-medium">{dinas.jumlahSekolah} Sekolah</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Admin Terdaftar</p>
                        <p className="text-sm font-medium">{dinas.jumlahAdmin} Admin</p>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Tutup
                    </Button>
                    <Button className="flex-1" leftIcon={<Edit className="h-4 w-4" />}>
                        Edit Dinas
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
}: {
    isOpen: boolean;
    onClose: () => void;
    dinas?: DinasData | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={dinas ? "Edit Dinas" : "Tambah Dinas"} size="md">
            <div className="space-y-4">
                <Input label="Nama Dinas" placeholder="Dinas Pendidikan..." defaultValue={dinas?.nama} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Kabupaten/Kota" placeholder="Kota Bandung" defaultValue={dinas?.kabupaten} />
                    <Input label="Provinsi" placeholder="Jawa Barat" defaultValue={dinas?.provinsi} />
                </div>
                <Input label="Email" type="email" placeholder="dinas@edu.id" defaultValue={dinas?.email} />
                <Input label="Telepon" placeholder="022-xxxxxxx" defaultValue={dinas?.telepon} />
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

export default function DinasPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [selectedDinas, setSelectedDinas] = useState<DinasData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const dinasList: DinasData[] = [
        { id: "1", nama: "Dinas Pendidikan Kota Bandung", kabupaten: "Kota Bandung", provinsi: "Jawa Barat", email: "disdik@bandung.go.id", telepon: "022-1234567", jumlahSekolah: 245, jumlahAdmin: 12, status: "aktif" },
        { id: "2", nama: "Dinas Pendidikan Kab. Bandung", kabupaten: "Kabupaten Bandung", provinsi: "Jawa Barat", email: "disdik@bandungkab.go.id", telepon: "022-2345678", jumlahSekolah: 312, jumlahAdmin: 15, status: "aktif" },
        { id: "3", nama: "Dinas Pendidikan Kota Cimahi", kabupaten: "Kota Cimahi", provinsi: "Jawa Barat", email: "disdik@cimahi.go.id", telepon: "022-3456789", jumlahSekolah: 89, jumlahAdmin: 5, status: "aktif" },
        { id: "4", nama: "Dinas Pendidikan Kota Sumedang", kabupaten: "Kabupaten Sumedang", provinsi: "Jawa Barat", email: "disdik@sumedang.go.id", telepon: "022-4567890", jumlahSekolah: 156, jumlahAdmin: 8, status: "nonaktif" },
    ];

    const filteredDinas = dinasList.filter((d) =>
        d.nama.toLowerCase().includes(search.toLowerCase()) || d.kabupaten.toLowerCase().includes(search.toLowerCase())
    );

    if (!isInitialized || isLoading) {
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
                        { label: "Total Dinas", value: "45", color: "bg-blue-500", icon: Home },
                        { label: "Aktif", value: "42", color: "bg-green-500", icon: Home },
                        { label: "Total Sekolah", value: "1,245", color: "bg-purple-500", icon: School },
                        { label: "Total Admin", value: "156", color: "bg-amber-500", icon: Users },
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
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDinas.map((dinas, index) => (
                                        <motion.tr
                                            key={dinas.id}
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
                                                        <p className="font-medium text-gray-900">{dinas.nama}</p>
                                                        <p className="text-xs text-gray-500">{dinas.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{dinas.kabupaten}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{dinas.jumlahSekolah}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={dinas.status === "aktif" ? "success" : "secondary"} size="sm" dot>
                                                    {dinas.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedDinas(dinas); setIsDetailOpen(true); }}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedDinas(dinas); setIsFormOpen(true); }}>
                                                        <Edit className="h-4 w-4" />
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
            <DinasFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} dinas={selectedDinas} />
        </DashboardLayout>
    );
}
