"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    FileSpreadsheet,
    Printer,
    Calendar,
    Filter,
    BarChart3,
    Users,
    School,
    TrendingUp,
    ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";

// ============================================
// Report Card Component
// ============================================

interface ReportCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    formats: string[];
    onGenerate: (format: string) => void;
}

function ReportCard({ title, description, icon: Icon, color, formats, onGenerate }: ReportCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", color)}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    {formats.map((format) => (
                        <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            onClick={() => onGenerate(format)}
                            leftIcon={
                                format === "PDF" ? (
                                    <FileText className="h-4 w-4 text-red-500" />
                                ) : (
                                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                                )
                            }
                        >
                            {format}
                        </Button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// Quick Stats
// ============================================

function QuickStats() {
    const stats = [
        { label: "Total Pendaftar", value: 118, icon: Users, color: "text-primary", change: "+12" },
        { label: "Terverifikasi", value: 85, icon: FileText, color: "text-green-600", change: "+5" },
        { label: "Diterima", value: 72, icon: TrendingUp, color: "text-blue-600", change: "+3" },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} variant="elevated">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className={cn("text-2xl font-bold", stat.color)}>
                                    {formatNumber(stat.value)}
                                </p>
                            </div>
                            <div className={cn("p-2 rounded-lg bg-gray-100", stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                            {stat.change} hari ini
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ============================================
// Recent Exports
// ============================================

function RecentExports() {
    const exports = [
        { name: "Rekap Pendaftar Januari 2026", format: "Excel", date: "28 Jan 2026", size: "125 KB" },
        { name: "Daftar Siswa Diterima", format: "PDF", date: "27 Jan 2026", size: "89 KB" },
        { name: "Statistik per Jalur", format: "PDF", date: "25 Jan 2026", size: "156 KB" },
        { name: "Data Verifikasi Berkas", format: "Excel", date: "24 Jan 2026", size: "234 KB" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Riwayat Export</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {exports.map((exp, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                {exp.format === "PDF" ? (
                                    <FileText className="h-5 w-5 text-red-500" />
                                ) : (
                                    <FileSpreadsheet className="h-5 w-5 text-green-500" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{exp.name}</p>
                                    <p className="text-xs text-gray-400">{exp.date} • {exp.size}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// PDF Preview Modal
// ============================================

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

function PreviewModal({ isOpen, onClose, title }: PreviewModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${title}`} size="xl">
            <div className="space-y-4">
                {/* Mock PDF Preview */}
                <div className="bg-gray-100 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Preview dokumen akan ditampilkan di sini</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Tutup
                    </Button>
                    <Button className="flex-1" leftIcon={<Printer className="h-4 w-4" />}>
                        Cetak
                    </Button>
                    <Button className="flex-1" leftIcon={<Download className="h-4 w-4" />}>
                        Unduh
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Reports Page
// ============================================

export default function ReportsPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [filterPeriod, setFilterPeriod] = useState("this_month");

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleGenerateReport = (title: string, format: string) => {
        if (format === "PDF") {
            setPreviewTitle(title);
            setPreviewOpen(true);
        } else {
            // Download Excel directly
            console.log("Download Excel:", title);
        }
    };

    const reports = [
        {
            title: "Rekap Pendaftar",
            description: "Daftar lengkap semua pendaftar dengan status verifikasi",
            icon: Users,
            color: "bg-primary/10 text-primary",
            formats: ["PDF", "Excel"],
        },
        {
            title: "Statistik per Jalur",
            description: "Breakdown pendaftar berdasarkan jalur pendaftaran",
            icon: BarChart3,
            color: "bg-secondary/10 text-secondary",
            formats: ["PDF", "Excel"],
        },
        {
            title: "Daftar Siswa Diterima",
            description: "Daftar siswa yang diterima beserta peringkat",
            icon: TrendingUp,
            color: "bg-green-100 text-green-600",
            formats: ["PDF", "Excel"],
        },
        {
            title: "Bukti Pendaftaran",
            description: "Cetak bukti pendaftaran untuk siswa",
            icon: FileText,
            color: "bg-amber-100 text-amber-600",
            formats: ["PDF"],
        },
        {
            title: "Laporan Verifikasi",
            description: "Status verifikasi berkas semua pendaftar",
            icon: FileText,
            color: "bg-purple-100 text-purple-600",
            formats: ["PDF", "Excel"],
        },
        {
            title: "Statistik Zonasi",
            description: "Analisis jarak dan distribusi geografis pendaftar",
            icon: School,
            color: "bg-blue-100 text-blue-600",
            formats: ["PDF"],
        },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="grid md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <CardSkeleton key={i} lines={3} />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Laporan & Export</h1>
                        <p className="text-gray-500 mt-1">
                            Generate dan unduh laporan dalam berbagai format
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            placeholder="Periode"
                            options={[
                                { value: "today", label: "Hari Ini" },
                                { value: "this_week", label: "Minggu Ini" },
                                { value: "this_month", label: "Bulan Ini" },
                                { value: "all", label: "Semua" },
                            ]}
                            value={filterPeriod}
                            onChange={setFilterPeriod}
                            className="w-48"
                        />
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <QuickStats />
                </motion.div>

                {/* Reports Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Laporan Tersedia</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map((report) => (
                            <ReportCard
                                key={report.title}
                                {...report}
                                onGenerate={(format) => handleGenerateReport(report.title, format)}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Recent Exports */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <RecentExports />
                </motion.div>
            </div>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={previewTitle}
            />
        </DashboardLayout>
    );
}
