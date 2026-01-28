"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    School,
    Users,
    BarChart3,
    TrendingUp,
    Download,
    Settings,
    Search,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { StatsCardSkeleton, TableSkeleton } from "@/components/skeletons";
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
// Dinas Table
// ============================================

function DinasTableCard() {
    const dinasData = [
        { id: 1, name: "Dinas Pendidikan Kab. Bandung", sekolah: 45, pendaftar: 1250, progress: 72 },
        { id: 2, name: "Dinas Pendidikan Kab. Bogor", sekolah: 52, pendaftar: 1480, progress: 68 },
        { id: 3, name: "Dinas Pendidikan Kab. Bekasi", sekolah: 38, pendaftar: 980, progress: 54 },
        { id: 4, name: "Dinas Pendidikan Kab. Cirebon", sekolah: 41, pendaftar: 1120, progress: 61 },
        { id: 5, name: "Dinas Pendidikan Kab. Garut", sekolah: 35, pendaftar: 890, progress: 48 },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Dinas Pendidikan</CardTitle>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari dinas..."
                            className="h-9 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        Filter
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b">
                                <th className="pb-3 font-medium">Dinas</th>
                                <th className="pb-3 font-medium">Sekolah</th>
                                <th className="pb-3 font-medium">Pendaftar</th>
                                <th className="pb-3 font-medium">Progress</th>
                                <th className="pb-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {dinasData.map((dinas) => (
                                <tr key={dinas.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="font-medium text-gray-900">{dinas.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <School className="h-4 w-4 text-gray-400" />
                                            <span>{dinas.sekolah}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span>{formatNumber(dinas.pendaftar)}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        dinas.progress >= 70 ? "bg-green-500" : dinas.progress >= 50 ? "bg-amber-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${dinas.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{dinas.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <Link href={`/super-admin/dinas/${dinas.id}`}>
                                            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                                                Detail
                                            </Button>
                                        </Link>
                                    </td>
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
// System Alerts
// ============================================

function SystemAlertsCard() {
    const alerts = [
        { id: 1, message: "3 sekolah belum mengatur kuota jalur zonasi", type: "warning" },
        { id: 2, message: "Pendaftaran jalur prestasi akan ditutup dalam 5 hari", type: "info" },
        { id: 3, message: "2 admin dinas belum melakukan konfigurasi jadwal", type: "warning" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Peringatan Sistem</CardTitle>
                    <Badge variant="warning" size="sm">{alerts.length}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl",
                                alert.type === "warning" ? "bg-amber-50" : "bg-blue-50"
                            )}
                        >
                            <AlertCircle
                                className={cn(
                                    "h-5 w-5 flex-shrink-0 mt-0.5",
                                    alert.type === "warning" ? "text-amber-500" : "text-blue-500"
                                )}
                            />
                            <p className="text-sm text-gray-700">{alert.message}</p>
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
        { icon: Settings, label: "Pengaturan Global", href: "/super-admin/settings" },
        { icon: Download, label: "Export Semua Data", href: "/super-admin/reports" },
        { icon: Users, label: "Kelola Admin", href: "/super-admin/users" },
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
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
// Main Dashboard Page
// ============================================

export default function SuperAdminDashboard() {
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
                    <TableSkeleton rows={5} columns={5} />
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
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard Super Admin
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Monitoring seluruh sistem SPMB
                        </p>
                    </div>
                    <Button rightIcon={<Download className="h-4 w-4" />}>
                        Export Laporan
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatsCard
                        title="Total Dinas"
                        value={5}
                        icon={Building2}
                        color="primary"
                    />
                    <StatsCard
                        title="Total Sekolah"
                        value={211}
                        icon={School}
                        description="126 SD • 85 SMP"
                        color="secondary"
                    />
                    <StatsCard
                        title="Total Pendaftar"
                        value={5720}
                        icon={Users}
                        trend={{ value: 12, isUp: true }}
                        color="success"
                    />
                    <StatsCard
                        title="Rata-rata Progress"
                        value="61%"
                        icon={BarChart3}
                        color="warning"
                    />
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <DinasTableCard />
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <SystemAlertsCard />
                        <QuickActionsCard />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
