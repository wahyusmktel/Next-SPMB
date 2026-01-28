"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    School,
    Search,
    Plus,
    Eye,
    Edit,
    MapPin,
    Users,
    Download,
    Filter,
    Trash2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useToastStore } from "@/lib/toast-store";
import type { DinasData } from "../dinas/page";

// ============================================
// Types
// ============================================

export interface SekolahData {
    id: string;
    dinas_id: string;
    npsn: string;
    name: string;
    jenjang: string;
    alamat: string;
    kelurahan: string;
    kecamatan: string;
    telepon: string;
    email: string;
    website?: string;
    lat?: number;
    lng?: number;
    logo?: string;
    kepala_sekolah: string;
    nip_kepala_sekolah: string;
    ketua_spmb: string;
    akreditasi?: string;
    status: string;
    created_at: string;
}

// ============================================
// Detail Modal
// ============================================

function SekolahDetailModal({
    isOpen,
    onClose,
    sekolah,
    dinasName,
}: {
    isOpen: boolean;
    onClose: () => void;
    sekolah: SekolahData | null;
    dinasName: string;
}) {
    if (!sekolah) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Sekolah" size="lg">
            <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                        {sekolah.logo ? (
                            <img src={sekolah.logo} alt={sekolah.name} className="w-full h-full object-cover" />
                        ) : (
                            <School className="h-8 w-8 text-primary" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{sekolah.name}</h3>
                        <p className="text-sm text-gray-500">NPSN: {sekolah.npsn} • {sekolah.jenjang}</p>
                        <Badge variant="outline" size="sm" className="mt-1">
                            {dinasName}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium">{sekolah.email}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Telepon</p>
                        <p className="text-sm font-medium">{sekolah.telepon}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                        <p className="text-xs text-gray-400">Alamat</p>
                        <p className="text-sm font-medium">{sekolah.alamat}</p>
                        <p className="text-xs text-gray-500">{sekolah.kelurahan}, {sekolah.kecamatan}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Kepala Sekolah</p>
                        <p className="text-sm font-medium">{sekolah.kepala_sekolah}</p>
                        <p className="text-xs text-gray-500">NIP: {sekolah.nip_kepala_sekolah}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Ketua SPMB</p>
                        <p className="text-sm font-medium">{sekolah.ketua_spmb}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Akreditasi / Status</p>
                        <p className="text-sm font-medium">{sekolah.akreditasi || "-"} / {sekolah.status}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Website</p>
                        <p className="text-sm font-medium">{sekolah.website || "-"}</p>
                    </div>
                </div>

                <Button variant="outline" onClick={onClose} className="w-full">
                    Tutup
                </Button>
            </div>
        </Modal>
    );
}

// ============================================
// Form Modal
// ============================================

function SekolahFormModal({
    isOpen,
    onClose,
    sekolah,
    dinasList,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    sekolah?: SekolahData | null;
    dinasList: DinasData[];
    onSuccess: () => void;
}) {
    const { success, error } = useToastStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        dinas_id: "",
        npsn: "",
        name: "",
        jenjang: "SD",
        alamat: "",
        kelurahan: "",
        kecamatan: "",
        telepon: "",
        email: "",
        website: "",
        kepala_sekolah: "",
        nip_kepala_sekolah: "",
        ketua_spmb: "",
        akreditasi: "A",
        status: "Negeri"
    });

    useEffect(() => {
        if (sekolah) {
            setFormData({
                dinas_id: sekolah.dinas_id,
                npsn: sekolah.npsn,
                name: sekolah.name,
                jenjang: sekolah.jenjang,
                alamat: sekolah.alamat,
                kelurahan: sekolah.kelurahan,
                kecamatan: sekolah.kecamatan,
                telepon: sekolah.telepon,
                email: sekolah.email,
                website: sekolah.website || "",
                kepala_sekolah: sekolah.kepala_sekolah,
                nip_kepala_sekolah: sekolah.nip_kepala_sekolah,
                ketua_spmb: sekolah.ketua_spmb,
                akreditasi: sekolah.akreditasi || "A",
                status: sekolah.status
            });
        } else {
            setFormData({
                dinas_id: dinasList[0]?.id || "",
                npsn: "",
                name: "",
                jenjang: "SD",
                alamat: "",
                kelurahan: "",
                kecamatan: "",
                telepon: "",
                email: "",
                website: "",
                kepala_sekolah: "",
                nip_kepala_sekolah: "",
                ketua_spmb: "",
                akreditasi: "A",
                status: "Negeri"
            });
        }
    }, [sekolah, isOpen, dinasList]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (sekolah) {
                await api.put(`/sekolah/${sekolah.id}`, formData);
                success("Data sekolah berhasil diperbarui!");
            } else {
                await api.post("/sekolah/", formData);
                success("Sekolah baru berhasil ditambahkan!");
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            error(err.message || "Gagal menyimpan data sekolah");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={sekolah ? "Edit Sekolah" : "Tambah Sekolah"} size="xl">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Dinas Pendidikan"
                        value={formData.dinas_id}
                        onChange={(val) => setFormData({ ...formData, dinas_id: val })}
                        options={dinasList.map(d => ({ value: d.id, label: d.name }))}
                    />
                    <Select
                        label="Jenjang"
                        value={formData.jenjang}
                        onChange={(val) => setFormData({ ...formData, jenjang: val })}
                        options={[
                            { value: "SD", label: "SD" },
                            { value: "SMP", label: "SMP" },
                            { value: "SMA", label: "SMA" },
                        ]}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="NPSN"
                        placeholder="202xxxxx"
                        value={formData.npsn}
                        onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                    />
                    <Input
                        label="Nama Sekolah"
                        placeholder="SDN 1..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        label="Kelurahan"
                        placeholder="Kelurahan..."
                        value={formData.kelurahan}
                        onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                    />
                    <Input
                        label="Kecamatan"
                        placeholder="Kecamatan..."
                        value={formData.kecamatan}
                        onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="school@edu.id"
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
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Kepala Sekolah"
                        placeholder="Nama Lengkap"
                        value={formData.kepala_sekolah}
                        onChange={(e) => setFormData({ ...formData, kepala_sekolah: e.target.value })}
                    />
                    <Input
                        label="NIP Kepala Sekolah"
                        placeholder="xxxxxxxxxxxxxxxxxx"
                        value={formData.nip_kepala_sekolah}
                        onChange={(e) => setFormData({ ...formData, nip_kepala_sekolah: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Ketua SPMB"
                        placeholder="Nama Lengkap"
                        value={formData.ketua_spmb}
                        onChange={(e) => setFormData({ ...formData, ketua_spmb: e.target.value })}
                    />
                    <Select
                        label="Akreditasi"
                        value={formData.akreditasi}
                        onChange={(val) => setFormData({ ...formData, akreditasi: val })}
                        options={[
                            { value: "A", label: "Akreditasi A" },
                            { value: "B", label: "Akreditasi B" },
                            { value: "C", label: "Akreditasi C" },
                            { value: "Belum", label: "Belum Terakreditasi" },
                        ]}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Status"
                        value={formData.status}
                        onChange={(val) => setFormData({ ...formData, status: val })}
                        options={[
                            { value: "Negeri", label: "Negeri" },
                            { value: "Swasta", label: "Swasta" },
                        ]}
                    />
                    <Input
                        label="Website"
                        placeholder="https://..."
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </div>

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

export default function SekolahPage() {
    const { initialize, isInitialized } = useDataStore();
    const { success, error } = useToastStore();
    const [search, setSearch] = useState("");
    const [filterJenjang, setFilterJenjang] = useState("all");
    const [sekolahList, setSekolahList] = useState<SekolahData[]>([]);
    const [dinasList, setDinasList] = useState<DinasData[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [selectedSekolah, setSelectedSekolah] = useState<SekolahData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchData = async () => {
        setIsDataLoading(true);
        try {
            const [sekolahRes, dinasRes, statsRes] = await Promise.all([
                api.get<SekolahData[]>("/sekolah/"),
                api.get<DinasData[]>("/dinas/"),
                api.get<any>("/stats/summary"),
            ]);
            setSekolahList(sekolahRes);
            setDinasList(dinasRes);
            setStats(statsRes);
        } catch (err: any) {
            console.error("Failed to fetch data:", err);
            error("Gagal mengambil data sistem");
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
        if (!confirm("Apakah Anda yakin ingin menghapus sekolah ini? Semua data pendaftaran terkait akan ikut terhapus.")) return;
        try {
            await api.delete(`/sekolah/${id}`);
            success("Sekolah berhasil dihapus!");
            fetchData();
        } catch (err: any) {
            error(err.message || "Gagal menghapus sekolah");
        }
    };

    const getDinasName = (id: string) => {
        return dinasList.find(d => d.id === id)?.name || "Dinas tidak ditemukan";
    };

    const filteredSekolah = sekolahList.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.npsn.includes(search);
        const matchJenjang = filterJenjang === "all" || s.jenjang === filterJenjang;
        return matchSearch && matchJenjang;
    });

    if (!isInitialized || isDataLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <CardSkeleton lines={2} />
                    <TableSkeleton rows={5} columns={6} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Data Sekolah</h1>
                        <p className="text-gray-500 mt-1">Kelola semua sekolah di sistem</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
                        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedSekolah(null); setIsFormOpen(true); }}>Tambah Sekolah</Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total Sekolah", value: stats?.total_sekolah || 0, color: "bg-blue-500" },
                        { label: "SD", value: stats?.role_counts?.SD || 0, color: "bg-green-500" },
                        { label: "SMP", value: stats?.role_counts?.SMP || 0, color: "bg-purple-500" },
                        { label: "SMA/SMK", value: (stats?.role_counts?.SMA || 0) + (stats?.role_counts?.SMK || 0), color: "bg-amber-500" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 border border-gray-100"
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3", stat.color)}>
                                <School className="h-5 w-5" />
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
                                    placeholder="Cari nama atau NPSN..."
                                    leftIcon={<Search className="h-4 w-4" />}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={filterJenjang}
                                onChange={(val) => setFilterJenjang(val)}
                                options={[
                                    { value: "all", label: "Semua Jenjang" },
                                    { value: "SD", label: "SD" },
                                    { value: "SMP", label: "SMP" },
                                    { value: "SMA", label: "SMA" },
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
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Jenjang</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Dinas (Jurisdikasi)</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSekolah.map((s, index) => (
                                        <motion.tr
                                            key={s.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <School className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{s.name}</p>
                                                        <p className="text-xs text-gray-500">NPSN: {s.npsn}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={s.jenjang === "SD" ? "info" : s.jenjang === "SMP" ? "warning" : "success"} size="sm">
                                                    {s.jenjang}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{getDinasName(s.dinas_id)}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant="outline" size="sm">
                                                    {s.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedSekolah(s); setIsDetailOpen(true); }}>
                                                        <Eye className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedSekolah(s); setIsFormOpen(true); }}>
                                                        <Edit className="h-4 w-4 text-amber-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
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

            <SekolahDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                sekolah={selectedSekolah}
                dinasName={selectedSekolah ? getDinasName(selectedSekolah.dinas_id) : ""}
            />
            <SekolahFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                sekolah={selectedSekolah}
                dinasList={dinasList}
                onSuccess={fetchData}
            />
        </DashboardLayout>
    );
}
