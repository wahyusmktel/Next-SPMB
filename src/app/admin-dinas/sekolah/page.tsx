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
    Filter,
    Download,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface SchoolData {
    id: string;
    npsn: string;
    nama: string;
    jenjang: "SD" | "SMP";
    alamat: string;
    kecamatan: string;
    status: "aktif" | "nonaktif";
    kuota: number;
    pendaftar: number;
}

// ============================================
// School Detail Modal
// ============================================

function SchoolDetailModal({
    isOpen,
    onClose,
    school,
}: {
    isOpen: boolean;
    onClose: () => void;
    school: SchoolData | null;
}) {
    if (!school) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Sekolah" size="lg">
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <School className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{school.nama}</h3>
                        <p className="text-sm text-gray-500">NPSN: {school.npsn}</p>
                        <Badge variant={school.jenjang === "SD" ? "info" : "warning"} size="sm" className="mt-1">
                            {school.jenjang}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Alamat</p>
                        <p className="text-sm font-medium">{school.alamat}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Kecamatan</p>
                        <p className="text-sm font-medium">{school.kecamatan}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Kuota</p>
                        <p className="text-sm font-medium">{school.kuota} Siswa</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Pendaftar</p>
                        <p className="text-sm font-medium">{school.pendaftar} Siswa</p>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Tutup
                    </Button>
                    <Button className="flex-1" leftIcon={<Edit className="h-4 w-4" />}>
                        Edit Sekolah
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Page
// ============================================

export default function SekolahPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [filterJenjang, setFilterJenjang] = useState("all");
    const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const schools: SchoolData[] = [
        { id: "1", npsn: "20200001", nama: "SDN 1 Sukajadi", jenjang: "SD", alamat: "Jl. Sukajadi No. 1", kecamatan: "Sukajadi", status: "aktif", kuota: 120, pendaftar: 95 },
        { id: "2", npsn: "20200002", nama: "SDN 2 Sukasari", jenjang: "SD", alamat: "Jl. Sukasari No. 15", kecamatan: "Sukasari", status: "aktif", kuota: 100, pendaftar: 88 },
        { id: "3", npsn: "20200003", nama: "SMPN 1 Bandung", jenjang: "SMP", alamat: "Jl. Merdeka No. 10", kecamatan: "Sumur Bandung", status: "aktif", kuota: 200, pendaftar: 185 },
        { id: "4", npsn: "20200004", nama: "SMPN 2 Bandung", jenjang: "SMP", alamat: "Jl. Asia Afrika No. 25", kecamatan: "Regol", status: "aktif", kuota: 180, pendaftar: 172 },
        { id: "5", npsn: "20200005", nama: "SDN 3 Coblong", jenjang: "SD", alamat: "Jl. Dipatiukur No. 35", kecamatan: "Coblong", status: "aktif", kuota: 90, pendaftar: 67 },
    ];

    const filteredSchools = schools.filter((s) => {
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
                        <p className="text-gray-500 mt-1">Kelola data sekolah di wilayah Anda</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />}>Tambah Sekolah</Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Sekolah", value: "45", color: "bg-blue-500" },
                        { label: "SD", value: "28", color: "bg-green-500" },
                        { label: "SMP", value: "17", color: "bg-purple-500" },
                        { label: "Total Kuota", value: "5,240", color: "bg-amber-500" },
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
                                ]}
                            />
                            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                                Export
                            </Button>
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
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">NPSN</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Jenjang</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kecamatan</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kuota</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchools.map((school, index) => (
                                        <motion.tr
                                            key={school.id}
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
                                                        <p className="font-medium text-gray-900">{school.nama}</p>
                                                        <p className="text-xs text-gray-500">{school.alamat}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{school.npsn}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={school.jenjang === "SD" ? "info" : "warning"} size="sm">
                                                    {school.jenjang}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{school.kecamatan}</td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    <span className="font-medium">{school.pendaftar}</span>
                                                    <span className="text-gray-400">/{school.kuota}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedSchool(school);
                                                        setIsDetailOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <SchoolDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                school={selectedSchool}
            />
        </DashboardLayout>
    );
}
