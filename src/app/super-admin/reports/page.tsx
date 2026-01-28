"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileSpreadsheet,
    Download,
    Calendar,
    Filter,
    FileText,
    Eye,
    Printer,
    BarChart3,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface ReportData {
    id: string;
    nama: string;
    jenis: "harian" | "mingguan" | "bulanan" | "tahunan";
    kategori: string;
    tanggal: string;
    status: "tersedia" | "diproses";
    ukuran: string;
}

// ============================================
// Report Card
// ============================================

function ReportCard({ report }: { report: ReportData }) {
    const jenisColors = {
        harian: "bg-blue-100 text-blue-600",
        mingguan: "bg-green-100 text-green-600",
        bulanan: "bg-purple-100 text-purple-600",
        tahunan: "bg-amber-100 text-amber-600",
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{report.nama}</h4>
                        <p className="text-xs text-gray-500 mt-1">{report.kategori}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className={jenisColors[report.jenis]} size="sm">
                                {report.jenis}
                            </Badge>
                            <span className="text-xs text-gray-400">{report.tanggal}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {report.status === "tersedia" ? (
                            <>
                                <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="px-2 py-1 text-xs bg-amber-100 text-amber-600 rounded-lg animate-pulse">
                                Proses...
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Page
// ============================================

export default function ReportsPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [filterJenis, setFilterJenis] = useState("all");
    const [filterKategori, setFilterKategori] = useState("all");

    useEffect(() => {
        initialize();
    }, [initialize]);

    const reports: ReportData[] = [
        { id: "1", nama: "Laporan Pendaftaran Harian", jenis: "harian", kategori: "Pendaftaran", tanggal: "28 Jan 2026", status: "tersedia", ukuran: "2.4 MB" },
        { id: "2", nama: "Statistik Mingguan Nasional", jenis: "mingguan", kategori: "Statistik", tanggal: "27 Jan 2026", status: "tersedia", ukuran: "5.1 MB" },
        { id: "3", nama: "Rekapitulasi Bulanan Januari", jenis: "bulanan", kategori: "Pendaftaran", tanggal: "25 Jan 2026", status: "tersedia", ukuran: "12.8 MB" },
        { id: "4", nama: "Laporan Dinas per Provinsi", jenis: "bulanan", kategori: "Dinas", tanggal: "20 Jan 2026", status: "tersedia", ukuran: "8.3 MB" },
        { id: "5", nama: "Analisis Tren Pendaftaran", jenis: "tahunan", kategori: "Analisis", tanggal: "15 Jan 2026", status: "diproses", ukuran: "-" },
        { id: "6", nama: "Laporan Sekolah Aktif", jenis: "mingguan", kategori: "Sekolah", tanggal: "24 Jan 2026", status: "tersedia", ukuran: "4.2 MB" },
    ];

    const filteredReports = reports.filter((r) => {
        const matchJenis = filterJenis === "all" || r.jenis === filterJenis;
        const matchKategori = filterKategori === "all" || r.kategori === filterKategori;
        return matchJenis && matchKategori;
    });

    const quickReports = [
        { label: "Laporan Hari Ini", icon: Calendar, color: "bg-blue-500" },
        { label: "Statistik Minggu Ini", icon: BarChart3, color: "bg-green-500" },
        { label: "Rekap Bulan Ini", icon: FileSpreadsheet, color: "bg-purple-500" },
        { label: "Cetak Semua", icon: Printer, color: "bg-amber-500" },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <CardSkeleton lines={2} />
                    <div className="grid md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => <CardSkeleton key={i} lines={3} />)}
                    </div>
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
                        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
                        <p className="text-gray-500 mt-1">Kelola dan unduh laporan sistem</p>
                    </div>
                    <Button leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
                        Buat Laporan Baru
                    </Button>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4">
                    {quickReports.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3", item.color)}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select
                                label="Jenis Laporan"
                                value={filterJenis}
                                onChange={(e) => setFilterJenis(e.target.value)}
                                options={[
                                    { value: "all", label: "Semua Jenis" },
                                    { value: "harian", label: "Harian" },
                                    { value: "mingguan", label: "Mingguan" },
                                    { value: "bulanan", label: "Bulanan" },
                                    { value: "tahunan", label: "Tahunan" },
                                ]}
                            />
                            <Select
                                label="Kategori"
                                value={filterKategori}
                                onChange={(e) => setFilterKategori(e.target.value)}
                                options={[
                                    { value: "all", label: "Semua Kategori" },
                                    { value: "Pendaftaran", label: "Pendaftaran" },
                                    { value: "Statistik", label: "Statistik" },
                                    { value: "Dinas", label: "Dinas" },
                                    { value: "Sekolah", label: "Sekolah" },
                                    { value: "Analisis", label: "Analisis" },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Reports Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredReports.map((report, index) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ReportCard report={report} />
                        </motion.div>
                    ))}
                </div>

                {/* Recent Downloads */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="text-lg">Riwayat Download</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { nama: "Laporan Pendaftaran Harian", waktu: "10 menit lalu", size: "2.4 MB" },
                                    { nama: "Statistik Mingguan Nasional", waktu: "1 jam lalu", size: "5.1 MB" },
                                    { nama: "Rekapitulasi Bulanan Januari", waktu: "2 jam lalu", size: "12.8 MB" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Download className="h-4 w-4 text-green-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.nama}</p>
                                            <p className="text-xs text-gray-400">{item.waktu}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.size}</span>
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
