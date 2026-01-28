"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    School,
    Users,
    FileText,
    BarChart3,
    TrendingUp,
    Calendar,
    ChevronRight,
    Download,
    Settings,
    Plus,
    Search,
    Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from "@/components/ui";
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
// Schools Table
// ============================================

function SchoolsTableCard() {
    const [searchQuery, setSearchQuery] = useState("");

    const schools = [
        { id: 1, name: "SMPN 1 Sukajadi", jenjang: "SMP", pendaftar: 118, kuota: 250, status: "active" },
        { id: 2, name: "SMPN 2 Coblong", jenjang: "SMP", pendaftar: 95, kuota: 200, status: "active" },
        { id: 3, name: "SDN 1 Pasteur", jenjang: "SD", pendaftar: 78, kuota: 150, status: "active" },
        { id: 4, name: "SDN 3 Cipaganti", jenjang: "SD", pendaftar: 62, kuota: 120, status: "active" },
        { id: 5, name: "SMPN 5 Lengkong", jenjang: "SMP", pendaftar: 145, kuota: 280, status: "active" },
    ];

    const filteredSchools = schools.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card variant="elevated">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg">Sekolah Naungan</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari sekolah..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            />
                        </div>
                        <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
                            Filter
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b">
                                <th className="pb-3 font-medium">Sekolah</th>
                                <th className="pb-3 font-medium">Jenjang</th>
                                <th className="pb-3 font-medium">Pendaftar</th>
                                <th className="pb-3 font-medium">Kuota</th>
                                <th className="pb-3 font-medium">Progress</th>
                                <th className="pb-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredSchools.map((school) => {
                                const progress = Math.round((school.pendaftar / school.kuota) * 100);
                                return (
                                    <tr key={school.id} className="border-b border-gray-50 last:border-0">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                                    <School className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-900">{school.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <Badge variant={school.jenjang === "SD" ? "info" : "success"} size="sm">
                                                {school.jenjang}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-gray-700">{formatNumber(school.pendaftar)}</td>
                                        <td className="py-4 text-gray-500">{formatNumber(school.kuota)}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            progress >= 80 ? "bg-red-500" : progress >= 50 ? "bg-amber-500" : "bg-green-500"
                                                        )}
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <Link href={`/admin-dinas/sekolah/${school.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    Detail
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Registration Chart Placeholder
// ============================================

function RegistrationChartCard() {
    const data = [
        { day: "Sen", value: 45 },
        { day: "Sel", value: 62 },
        { day: "Rab", value: 38 },
        { day: "Kam", value: 75 },
        { day: "Jum", value: 58 },
        { day: "Sab", value: 42 },
        { day: "Min", value: 28 },
    ];

    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Pendaftaran Minggu Ini</CardTitle>
                <select className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary">
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                    <option>Bulan Ini</option>
                </select>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-end gap-2 h-48">
                    {data.map((d, i) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(d.value / maxValue) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg min-h-[20px]"
                            />
                            <span className="text-xs text-gray-500">{d.day}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                        <p className="text-sm text-gray-500">Total Minggu Ini</p>
                        <p className="text-2xl font-bold text-gray-900">348</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Rata-rata/Hari</p>
                        <p className="text-2xl font-bold text-primary">50</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Jalur Distribution
// ============================================

function JalurDistributionCard() {
    const jalur = [
        { name: "Zonasi", value: 520, percentage: 52, color: "bg-primary" },
        { name: "Prestasi", value: 280, percentage: 28, color: "bg-secondary" },
        { name: "Afirmasi", value: 120, percentage: 12, color: "bg-amber-500" },
        { name: "Perpindahan", value: 80, percentage: 8, color: "bg-purple-500" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Distribusi Jalur Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {/* Donut chart visualization */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {jalur.reduce((acc, item, index) => {
                                const offset = acc.offset;
                                const circumference = 2 * Math.PI * 40;
                                const strokeDasharray = (item.percentage / 100) * circumference;

                                acc.elements.push(
                                    <circle
                                        key={item.name}
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke={
                                            index === 0 ? "#296374" :
                                                index === 1 ? "#629FAD" :
                                                    index === 2 ? "#f59e0b" : "#a855f7"
                                        }
                                        strokeWidth="15"
                                        strokeDasharray={`${strokeDasharray} ${circumference}`}
                                        strokeDashoffset={-offset}
                                        className="transition-all duration-1000"
                                    />
                                );
                                acc.offset += strokeDasharray;
                                return acc;
                            }, { offset: 0, elements: [] as JSX.Element[] }).elements}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">1000</p>
                                <p className="text-xs text-gray-500">Total</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                    {jalur.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", item.color)} />
                            <div>
                                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.value} ({item.percentage}%)</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Quick Actions Card
// ============================================

function QuickActionsCard() {
    const actions = [
        { icon: Settings, label: "Konfigurasi", href: "/admin-dinas/settings", color: "bg-primary/10 text-primary" },
        { icon: Calendar, label: "Jadwal SPMB", href: "/admin-dinas/settings/jadwal", color: "bg-green-100 text-green-600" },
        { icon: Download, label: "Export Laporan", href: "/admin-dinas/reports", color: "bg-amber-100 text-amber-600" },
        { icon: Plus, label: "Import Sekolah", href: "/admin-dinas/sekolah/import", color: "bg-purple-100 text-purple-600" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => (
                        <Link key={action.label} href={action.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center"
                            >
                                <div className={cn("w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center", action.color)}>
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">{action.label}</p>
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

export default function AdminDinasDashboard() {
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
                        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
                        <div className="h-4 w-48 bg-gray-100 rounded-lg animate-pulse" />
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard Admin Dinas
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Dinas Pendidikan Kabupaten Bandung • Tahun Ajaran 2026/2027
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
                        title="Total Sekolah"
                        value={45}
                        icon={School}
                        description="25 SD • 20 SMP"
                        color="primary"
                    />
                    <StatsCard
                        title="Total Pendaftar"
                        value={1250}
                        icon={Users}
                        trend={{ value: 15, isUp: true }}
                        color="secondary"
                    />
                    <StatsCard
                        title="Terverifikasi"
                        value={892}
                        icon={FileText}
                        description="71% dari total"
                        color="success"
                    />
                    <StatsCard
                        title="Menunggu"
                        value={358}
                        icon={BarChart3}
                        color="warning"
                    />
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - 2/3 width */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <SchoolsTableCard />
                        <RegistrationChartCard />
                    </motion.div>

                    {/* Right Column - 1/3 width */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <JalurDistributionCard />
                        <QuickActionsCard />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
