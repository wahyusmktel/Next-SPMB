"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MapPin,
    Calendar,
    ChevronRight,
    Bell,
    Download,
    School,
    User,
    Phone,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { StatsCardSkeleton, CardSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";
import { formatDate, getStatusLabel, cn } from "@/lib/utils";
import Link from "next/link";

// ============================================
// Stats Card Component
// ============================================

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    trend?: string;
    color: "primary" | "secondary" | "success" | "warning" | "error";
}

function StatsCard({ title, value, icon: Icon, description, trend, color }: StatsCardProps) {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        success: "bg-green-100 text-green-600",
        warning: "bg-amber-100 text-amber-600",
        error: "bg-red-100 text-red-600",
    };

    return (
        <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                        {description && (
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                        )}
                        {trend && (
                            <p className="text-xs text-green-600 mt-2">
                                {trend}
                            </p>
                        )}
                    </div>
                    <div className={cn("p-3 rounded-xl", colorClasses[color])}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Registration Status Card
// ============================================

function RegistrationStatusCard() {
    const status = "terverifikasi"; // This would come from actual data

    const statusConfig = {
        draft: {
            icon: FileText,
            color: "bg-gray-100 text-gray-600",
            title: "Belum Lengkap",
            description: "Lengkapi formulir pendaftaran Anda",
            action: "Lengkapi Formulir",
            href: "/siswa/formulir",
        },
        submitted: {
            icon: Clock,
            color: "bg-blue-100 text-blue-600",
            title: "Menunggu Verifikasi",
            description: "Berkas pendaftaran sedang diverifikasi oleh sekolah",
            action: "Lihat Status",
            href: "/siswa/status",
        },
        terverifikasi: {
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            title: "Terverifikasi",
            description: "Pendaftaran Anda sudah diverifikasi. Tunggu pengumuman hasil seleksi.",
            action: "Lihat Detail",
            href: "/siswa/status",
        },
        diterima: {
            icon: CheckCircle2,
            color: "bg-emerald-100 text-emerald-600",
            title: "Selamat! Anda Diterima",
            description: "Segera lakukan daftar ulang sebelum batas waktu",
            action: "Daftar Ulang",
            href: "/siswa/daftar-ulang",
        },
        ditolak: {
            icon: XCircle,
            color: "bg-red-100 text-red-600",
            title: "Pendaftaran Ditolak",
            description: "Mohon maaf, pendaftaran Anda tidak dapat diproses",
            action: "Lihat Alasan",
            href: "/siswa/status",
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const StatusIcon = config.icon;

    return (
        <Card variant="elevated" className="overflow-hidden">
            <div className={cn("h-2", config.color.replace("bg-", "bg-").replace("-100", "-500"))} />
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", config.color)}>
                        <StatusIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{config.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                        <Link href={config.href} className="inline-block mt-4">
                            <Button size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                                {config.action}
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Timeline Component
// ============================================

function TimelineCard() {
    const timeline = [
        { date: "15 Jan 2026", event: "Pendaftaran dibuka", status: "done" },
        { date: "20 Jan 2026", event: "Akun dibuat", status: "done" },
        { date: "25 Jan 2026", event: "Formulir dilengkapi", status: "done" },
        { date: "26 Jan 2026", event: "Berkas diverifikasi", status: "done" },
        { date: "15 Mar 2026", event: "Pengumuman hasil", status: "upcoming" },
        { date: "20 Mar 2026", event: "Daftar ulang", status: "upcoming" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Riwayat Pendaftaran</CardTitle>
                <Link href="/siswa/status">
                    <Button variant="ghost" size="sm">
                        Lihat Semua
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-4">
                    {timeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-3 h-3 rounded-full",
                                        item.status === "done" ? "bg-green-500" : "bg-gray-300"
                                    )}
                                />
                                {index < timeline.length - 1 && (
                                    <div
                                        className={cn(
                                            "w-0.5 flex-1 mt-1",
                                            item.status === "done" ? "bg-green-200" : "bg-gray-200"
                                        )}
                                    />
                                )}
                            </div>
                            <div className="pb-4">
                                <p className="text-xs text-gray-400">{item.date}</p>
                                <p
                                    className={cn(
                                        "text-sm font-medium",
                                        item.status === "done" ? "text-gray-900" : "text-gray-400"
                                    )}
                                >
                                    {item.event}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// School Info Card
// ============================================

function SchoolInfoCard() {
    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Sekolah Tujuan</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <School className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">SMPN 1 Sukajadi</h4>
                        <p className="text-sm text-gray-500 mt-1">
                            Jl. Sukajadi No. 123, Bandung
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                1.2 km
                            </div>
                            <Badge variant="success" size="sm">Jalur Zonasi</Badge>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Kepala Sekolah</p>
                        <p className="text-sm font-medium">Drs. Ahmad Wijaya, M.Pd</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Kontak</p>
                        <p className="text-sm font-medium">022-1234567</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Documents Card
// ============================================

function DocumentsCard() {
    const documents = [
        { name: "Kartu Keluarga", status: "verified" },
        { name: "Akta Kelahiran", status: "verified" },
        { name: "Ijazah SD", status: "pending" },
        { name: "Pas Foto 3x4", status: "verified" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Berkas Pendaftaran</CardTitle>
                <Link href="/siswa/formulir">
                    <Button variant="ghost" size="sm">
                        Kelola
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.name}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                            </div>
                            <Badge
                                variant={doc.status === "verified" ? "verified" : "pending"}
                                size="sm"
                            >
                                {doc.status === "verified" ? "Terverifikasi" : "Menunggu"}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Announcements Card
// ============================================

function AnnouncementsCard() {
    const announcements = [
        {
            id: "1",
            title: "Jadwal Pengumuman Hasil Seleksi",
            date: "27 Jan 2026",
            type: "info",
        },
        {
            id: "2",
            title: "Perubahan Jadwal Daftar Ulang",
            date: "26 Jan 2026",
            type: "warning",
        },
        {
            id: "3",
            title: "Tips Persiapan Daftar Ulang",
            date: "25 Jan 2026",
            type: "info",
        },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Pengumuman</CardTitle>
                <Link href="/siswa/pengumuman">
                    <Button variant="ghost" size="sm">
                        Lihat Semua
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {announcements.map((ann) => (
                        <Link
                            key={ann.id}
                            href={`/siswa/pengumuman/${ann.id}`}
                            className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        "p-2 rounded-lg mt-0.5",
                                        ann.type === "warning" ? "bg-amber-100" : "bg-blue-100"
                                    )}
                                >
                                    {ann.type === "warning" ? (
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                    ) : (
                                        <Bell className="h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{ann.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{ann.date}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Quick Actions
// ============================================

function QuickActions() {
    const actions = [
        { icon: FileText, label: "Unduh Formulir", href: "#", color: "primary" },
        { icon: Download, label: "Cetak Kartu", href: "#", color: "secondary" },
        { icon: Phone, label: "Hubungi Sekolah", href: "#", color: "tertiary" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3">
                    {actions.map((action) => (
                        <motion.button
                            key={action.label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
                        >
                            <action.icon className="h-6 w-6 mx-auto text-gray-600" />
                            <p className="text-xs font-medium text-gray-600 mt-2">{action.label}</p>
                        </motion.button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Dashboard Page
// ============================================

export default function SiswaDashboard() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Show skeleton while loading
    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
                        <div className="h-4 w-72 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <StatsCardSkeleton key={i} />
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <CardSkeleton lines={4} />
                            <CardSkeleton lines={4} />
                        </div>
                        <div className="space-y-6">
                            <CardSkeleton lines={5} />
                            <CardSkeleton lines={4} />
                        </div>
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
                    <h1 className="text-2xl font-bold text-gray-900">
                        Selamat Datang, {user?.name?.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Berikut status pendaftaran SPMB Anda
                    </p>
                </motion.div>

                {/* Registration Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <RegistrationStatusCard />
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatsCard
                        title="Nomor Pendaftaran"
                        value="SPMB-2026-A1B2C"
                        icon={FileText}
                        color="primary"
                    />
                    <StatsCard
                        title="Jalur Pendaftaran"
                        value="Zonasi"
                        icon={MapPin}
                        color="secondary"
                    />
                    <StatsCard
                        title="Jarak ke Sekolah"
                        value="1.2 km"
                        icon={School}
                        color="success"
                    />
                    <StatsCard
                        title="Status Berkas"
                        value="3/4"
                        icon={CheckCircle2}
                        description="Terverifikasi"
                        color="warning"
                    />
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <SchoolInfoCard />
                        <DocumentsCard />
                        <QuickActions />
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <TimelineCard />
                        <AnnouncementsCard />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
