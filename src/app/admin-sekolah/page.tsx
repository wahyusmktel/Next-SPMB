"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    Clock,
    XCircle,
    FileText,
    TrendingUp,
    MapPin,
    Award,
    AlertCircle,
    ChevronRight,
    Download,
    Plus,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { StatsCardSkeleton, TableSkeleton, ChartSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";
import Link from "next/link";

// ============================================
// Stats Card Component
// ============================================

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    description?: string;
    trend?: { value: number; isUp: boolean };
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
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Card variant="elevated" className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{title}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {typeof value === "number" ? formatNumber(value) : value}
                            </p>
                            {description && (
                                <p className="text-sm text-gray-500 mt-1">{description}</p>
                            )}
                            {trend && (
                                <p
                                    className={cn(
                                        "text-xs mt-2 flex items-center gap-1",
                                        trend.isUp ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    <TrendingUp className={cn("h-3 w-3", !trend.isUp && "rotate-180")} />
                                    {trend.value}% dari kemarin
                                </p>
                            )}
                        </div>
                        <div className={cn("p-3 rounded-xl", colorClasses[color])}>
                            <Icon className="h-6 w-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ============================================
// Registration by Path Chart
// ============================================

function RegistrationByPathCard() {
    const paths = [
        { name: "Zonasi", value: 75, max: 150, color: "bg-primary" },
        { name: "Prestasi", value: 23, max: 50, color: "bg-secondary" },
        { name: "Afirmasi", value: 12, max: 30, color: "bg-amber-500" },
        { name: "Perpindahan", value: 8, max: 20, color: "bg-purple-500" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Pendaftar per Jalur</CardTitle>
                <Link href="/admin-sekolah/pendaftar">
                    <Button variant="ghost" size="sm">
                        Detail
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-4">
                    {paths.map((path) => (
                        <div key={path.name}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{path.name}</span>
                                <span className="text-sm text-gray-500">
                                    {path.value}/{path.max}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(path.value / path.max) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={cn("h-full rounded-full", path.color)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Recent Registrations Table
// ============================================

function RecentRegistrationsCard() {
    const registrations = [
        {
            id: 1,
            name: "Ahmad Pratama",
            nisn: "1234567890",
            jalur: "Zonasi",
            status: "pending",
            date: "28 Jan 2026",
        },
        {
            id: 2,
            name: "Siti Nurhaliza",
            nisn: "0987654321",
            jalur: "Prestasi",
            status: "verified",
            date: "28 Jan 2026",
        },
        {
            id: 3,
            name: "Budi Santoso",
            nisn: "1122334455",
            jalur: "Zonasi",
            status: "pending",
            date: "27 Jan 2026",
        },
        {
            id: 4,
            name: "Dewi Lestari",
            nisn: "5544332211",
            jalur: "Afirmasi",
            status: "rejected",
            date: "27 Jan 2026",
        },
        {
            id: 5,
            name: "Eko Prasetyo",
            nisn: "6677889900",
            jalur: "Zonasi",
            status: "verified",
            date: "26 Jan 2026",
        },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Pendaftaran Terbaru</CardTitle>
                <Link href="/admin-sekolah/pendaftar">
                    <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                        Lihat Semua
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b">
                                <th className="pb-3 font-medium">Nama</th>
                                <th className="pb-3 font-medium">NISN</th>
                                <th className="pb-3 font-medium">Jalur</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {registrations.map((reg) => (
                                <tr key={reg.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3">
                                        <span className="font-medium text-gray-900">{reg.name}</span>
                                    </td>
                                    <td className="py-3 text-gray-500">{reg.nisn}</td>
                                    <td className="py-3">
                                        <Badge variant="outline" size="sm">{reg.jalur}</Badge>
                                    </td>
                                    <td className="py-3">
                                        <Badge
                                            variant={
                                                reg.status === "verified"
                                                    ? "verified"
                                                    : reg.status === "rejected"
                                                        ? "rejected"
                                                        : "pending"
                                            }
                                            size="sm"
                                            dot
                                        >
                                            {reg.status === "verified"
                                                ? "Terverifikasi"
                                                : reg.status === "rejected"
                                                    ? "Ditolak"
                                                    : "Menunggu"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-gray-500">{reg.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Pending Verifications Card
// ============================================

function PendingVerificationsCard() {
    const pendingItems = [
        { id: 1, name: "Ahmad Pratama", docs: 4, time: "2 jam lalu" },
        { id: 2, name: "Rina Wati", docs: 3, time: "3 jam lalu" },
        { id: 3, name: "Joko Widodo", docs: 5, time: "5 jam lalu" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Menunggu Verifikasi</CardTitle>
                    <Badge variant="warning" size="sm">{pendingItems.length}</Badge>
                </div>
                <Link href="/admin-sekolah/verifikasi">
                    <Button size="sm">
                        Verifikasi
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {pendingItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-amber-50 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.docs} berkas • {item.time}</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Quick Actions
// ============================================

function QuickActionsCard() {
    const actions = [
        { icon: Plus, label: "Tambah Pengumuman", href: "/admin-sekolah/pengumuman/new", color: "bg-primary/10 text-primary" },
        { icon: Download, label: "Export Data", href: "/admin-sekolah/reports", color: "bg-green-100 text-green-600" },
        { icon: MapPin, label: "Atur Zonasi", href: "/admin-sekolah/kuota", color: "bg-amber-100 text-amber-600" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    {actions.map((action) => (
                        <Link key={action.label} href={action.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className={cn("p-2 rounded-lg", action.color)}>
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-700">{action.label}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Recent Tickets
// ============================================

function RecentTicketsCard() {
    const tickets = [
        { id: 1, subject: "Berkas tidak bisa diupload", priority: "high", time: "1 jam lalu" },
        { id: 2, subject: "Pertanyaan jalur zonasi", priority: "medium", time: "3 jam lalu" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Tiket Terbaru</CardTitle>
                <Link href="/admin-sekolah/tickets">
                    <Button variant="ghost" size="sm">
                        Kelola
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                {tickets.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        Tidak ada tiket baru
                    </p>
                ) : (
                    <div className="space-y-3">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                                <div
                                    className={cn(
                                        "p-2 rounded-lg",
                                        ticket.priority === "high" ? "bg-red-100" : "bg-amber-100"
                                    )}
                                >
                                    <AlertCircle
                                        className={cn(
                                            "h-4 w-4",
                                            ticket.priority === "high" ? "text-red-600" : "text-amber-600"
                                        )}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{ticket.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Dashboard Page
// ============================================

export default function AdminSekolahDashboard() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

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
                        <div className="lg:col-span-2">
                            <TableSkeleton rows={5} columns={5} />
                        </div>
                        <ChartSkeleton />
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
                        Dashboard Admin Sekolah
                    </h1>
                    <p className="text-gray-500 mt-1">
                        SMPN 1 Sukajadi • Tahun Ajaran 2026/2027
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatsCard
                        title="Total Pendaftar"
                        value={118}
                        icon={Users}
                        trend={{ value: 12, isUp: true }}
                        color="primary"
                    />
                    <StatsCard
                        title="Terverifikasi"
                        value={85}
                        icon={UserCheck}
                        description="72% dari total"
                        color="success"
                    />
                    <StatsCard
                        title="Menunggu Verifikasi"
                        value={28}
                        icon={Clock}
                        color="warning"
                    />
                    <StatsCard
                        title="Ditolak"
                        value={5}
                        icon={XCircle}
                        color="error"
                    />
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <RecentRegistrationsCard />
                        <RegistrationByPathCard />
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <PendingVerificationsCard />
                        <QuickActionsCard />
                        <RecentTicketsCard />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
