"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Megaphone,
    Calendar,
    Info,
    AlertTriangle,
    ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface Announcement {
    id: string;
    title: string;
    content: string;
    category: "info" | "urgent" | "event";
    publishedAt: string;
}

// ============================================
// Announcement Card
// ============================================

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
    const categoryConfig = {
        info: { label: "Informasi", icon: Info, color: "bg-blue-100 text-blue-600" },
        urgent: { label: "Penting", icon: AlertTriangle, color: "bg-red-100 text-red-600" },
        event: { label: "Acara", icon: Calendar, color: "bg-purple-100 text-purple-600" },
    };

    const config = categoryConfig[announcement.category];
    const Icon = config.icon;

    return (
        <Link href={`/siswa/pengumuman/${announcement.id}`}>
            <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden cursor-pointer"
            >
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className={cn("p-2.5 rounded-xl", config.color)}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                                <Badge variant="outline" size="sm" className="flex-shrink-0">
                                    {config.label}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {announcement.content}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{announcement.publishedAt}</span>
                                <span className="text-xs text-primary hover:underline flex items-center gap-1">
                                    Selengkapnya <ChevronRight className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

// ============================================
// Main Page
// ============================================

export default function PengumumanSiswaPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const announcements: Announcement[] = [
        {
            id: "1",
            title: "Pendaftaran SPMB Tahun Ajaran 2026/2027 Telah Dibuka",
            content: "Kami informasikan bahwa pendaftaran Seleksi Penerimaan Murid Baru (SPMB) untuk tahun ajaran 2026/2027 telah resmi dibuka. Pendaftaran dapat dilakukan secara online melalui sistem SPMB mulai tanggal 15 Januari 2026 hingga 28 Februari 2026.",
            category: "info",
            publishedAt: "15 Januari 2026",
        },
        {
            id: "2",
            title: "PENTING: Batas Waktu Upload Berkas Diperpanjang",
            content: "Mengingat banyaknya kendala teknis yang dialami pendaftar, kami memperpanjang batas waktu upload berkas hingga tanggal 15 Februari 2026. Harap segera melengkapi berkas pendaftaran Anda.",
            category: "urgent",
            publishedAt: "28 Januari 2026",
        },
        {
            id: "3",
            title: "Jadwal Pengumuman Hasil Seleksi",
            content: "Hasil seleksi SPMB akan diumumkan pada tanggal 15 Maret 2026 pukul 10.00 WIB melalui website resmi dan aplikasi SPMB. Pastikan Anda memantau status pendaftaran secara berkala.",
            category: "event",
            publishedAt: "20 Januari 2026",
        },
        {
            id: "4",
            title: "Sosialisasi SPMB untuk Orang Tua",
            content: "Kami mengundang seluruh orang tua/wali calon siswa untuk menghadiri acara sosialisasi SPMB yang akan dilaksanakan pada tanggal 1 Februari 2026 di Aula Dinas Pendidikan.",
            category: "event",
            publishedAt: "18 Januari 2026",
        },
        {
            id: "5",
            title: "Persyaratan Berkas Pendaftaran",
            content: "Pastikan Anda telah menyiapkan seluruh berkas yang diperlukan: Kartu Keluarga, Akta Kelahiran, Ijazah/SKHUN, Pas Foto, dan dokumen pendukung sesuai jalur pendaftaran yang dipilih.",
            category: "info",
            publishedAt: "16 Januari 2026",
        },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="grid gap-4">
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
                >
                    <h1 className="text-2xl font-bold text-gray-900">Pengumuman</h1>
                    <p className="text-gray-500 mt-1">
                        Informasi terbaru terkait pendaftaran
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-2"
                >
                    {["Semua", "Informasi", "Penting", "Acara"].map((tab, index) => (
                        <button
                            key={tab}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                index === 0
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>

                {/* Announcements List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {announcements.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
