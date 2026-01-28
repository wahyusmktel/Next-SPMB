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
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface SekolahData {
    id: string;
    npsn: string;
    nama: string;
    jenjang: "SD" | "SMP" | "SMA";
    dinas: string;
    kabupaten: string;
    status: "aktif" | "nonaktif";
    kuota: number;
    pendaftar: number;
}

// ============================================
// Main Page
// ============================================

export default function SekolahPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [filterJenjang, setFilterJenjang] = useState("all");
    const [selectedSekolah, setSelectedSekolah] = useState<SekolahData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const sekolahList: SekolahData[] = [
        { id: "1", npsn: "20200001", nama: "SDN 1 Sukajadi", jenjang: "SD", dinas: "Dinas Pendidikan Kota Bandung", kabupaten: "Kota Bandung", status: "aktif", kuota: 120, pendaftar: 95 },
        { id: "2", npsn: "20200002", nama: "SMPN 1 Bandung", jenjang: "SMP", dinas: "Dinas Pendidikan Kota Bandung", kabupaten: "Kota Bandung", status: "aktif", kuota: 200, pendaftar: 185 },
        { id: "3", npsn: "20200003", nama: "SMAN 3 Bandung", jenjang: "SMA", dinas: "Dinas Pendidikan Kota Bandung", kabupaten: "Kota Bandung", status: "aktif", kuota: 280, pendaftar: 265 },
        { id: "4", npsn: "20200004", nama: "SDN 2 Cimahi", jenjang: "SD", dinas: "Dinas Pendidikan Kota Cimahi", kabupaten: "Kota Cimahi", status: "aktif", kuota: 90, pendaftar: 72 },
        { id: "5", npsn: "20200005", nama: "SMPN 1 Sumedang", jenjang: "SMP", dinas: "Dinas Pendidikan Kab. Sumedang", kabupaten: "Kab. Sumedang", status: "nonaktif", kuota: 160, pendaftar: 0 },
    ];

    const filteredSekolah = sekolahList.filter((s) => {
        const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.npsn.includes(search);
        const matchJenjang = filterJenjang === "all" || s.jenjang === filterJenjang;
        return matchSearch && matchJenjang;
    });

    if (!isInitialized || isLoading) {
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
                        <Button leftIcon={<Plus className="h-4 w-4" />}>Tambah Sekolah</Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total Sekolah", value: "1,245", color: "bg-blue-500" },
                        { label: "SD", value: "654", color: "bg-green-500" },
                        { label: "SMP", value: "389", color: "bg-purple-500" },
                        { label: "SMA", value: "202", color: "bg-amber-500" },
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
                                onChange={(e) => setFilterJenjang(e.target.value)}
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
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Dinas</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kuota</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSekolah.map((sekolah, index) => (
                                        <motion.tr
                                            key={sekolah.id}
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
                                                        <p className="font-medium text-gray-900">{sekolah.nama}</p>
                                                        <p className="text-xs text-gray-500">NPSN: {sekolah.npsn}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={sekolah.jenjang === "SD" ? "info" : sekolah.jenjang === "SMP" ? "warning" : "success"} size="sm">
                                                    {sekolah.jenjang}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{sekolah.kabupaten}</td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    <span className="font-medium">{sekolah.pendaftar}</span>
                                                    <span className="text-gray-400">/{sekolah.kuota}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={sekolah.status === "aktif" ? "success" : "secondary"} size="sm" dot>
                                                    {sekolah.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
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
        </DashboardLayout>
    );
}
