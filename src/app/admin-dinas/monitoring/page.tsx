"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Users,
    School,
    MapPin,
    Award,
    Heart,
    Calendar,
    Download,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Stat Card
// ============================================

function StatCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    color,
}: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ElementType;
    color: string;
}) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className={cn("p-3 rounded-xl", color)}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className={cn("flex items-center gap-1 text-sm", trend === "up" ? "text-green-600" : "text-red-600")}>
                        {trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {change}
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-4">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
            </CardContent>
        </Card>
    );
}

// ============================================
// Chart Placeholder
// ============================================

function ChartCard({ title, children }: { title: string; children?: React.ReactNode }) {
    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children || (
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400">Chart Visualization</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Page
// ============================================

export default function MonitoringPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [periode, setPeriode] = useState("today");

    useEffect(() => {
        initialize();
    }, [initialize]);

    const jalurStats = [
        { nama: "Zonasi", icon: MapPin, jumlah: 1245, persen: 50, color: "bg-blue-100 text-blue-600" },
        { nama: "Prestasi", icon: Award, jumlah: 623, persen: 25, color: "bg-amber-100 text-amber-600" },
        { nama: "Afirmasi", icon: Heart, jumlah: 374, persen: 15, color: "bg-pink-100 text-pink-600" },
        { nama: "Perpindahan", icon: Users, jumlah: 249, persen: 10, color: "bg-green-100 text-green-600" },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-4 gap-4">
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
                        <h1 className="text-2xl font-bold text-gray-900">Statistik & Monitoring</h1>
                        <p className="text-gray-500 mt-1">Pantau perkembangan pendaftaran</p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={periode}
                            onChange={(e) => setPeriode(e.target.value)}
                            options={[
                                { value: "today", label: "Hari Ini" },
                                { value: "week", label: "Minggu Ini" },
                                { value: "month", label: "Bulan Ini" },
                                { value: "all", label: "Semua" },
                            ]}
                        />
                        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                            Export
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                        <StatCard
                            title="Total Pendaftar"
                            value="2,491"
                            change="+12%"
                            trend="up"
                            icon={Users}
                            color="bg-blue-100 text-blue-600"
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <StatCard
                            title="Terverifikasi"
                            value="1,847"
                            change="+8%"
                            trend="up"
                            icon={TrendingUp}
                            color="bg-green-100 text-green-600"
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <StatCard
                            title="Menunggu Verifikasi"
                            value="423"
                            change="-5%"
                            trend="down"
                            icon={Calendar}
                            color="bg-amber-100 text-amber-600"
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <StatCard
                            title="Sekolah Aktif"
                            value="45"
                            change="+2"
                            trend="up"
                            icon={School}
                            color="bg-purple-100 text-purple-600"
                        />
                    </motion.div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <ChartCard title="Tren Pendaftaran Harian">
                            <div className="h-64 flex items-end gap-2 p-4">
                                {[35, 52, 48, 61, 55, 72, 65, 80, 75, 88, 92, 78].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all"
                                            style={{ height: `${h}%` }}
                                        />
                                        <span className="text-[10px] text-gray-400">{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <ChartCard title="Distribusi per Jalur">
                            <div className="space-y-4 p-4">
                                {jalurStats.map((j, index) => (
                                    <div key={j.nama} className="flex items-center gap-4">
                                        <div className={cn("p-2 rounded-lg", j.color)}>
                                            <j.icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{j.nama}</span>
                                                <span className="text-sm text-gray-500">{j.jumlah} ({j.persen}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${j.persen * 2}%` }}
                                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                                    className={cn("h-full rounded-full", j.color.replace("text", "bg").replace("100", "500"))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </motion.div>
                </div>

                {/* Top Schools Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="text-lg">Sekolah dengan Pendaftar Terbanyak</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Rank</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Jenjang</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Pendaftar</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kuota</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { rank: 1, nama: "SMPN 1 Bandung", jenjang: "SMP", pendaftar: 185, kuota: 200 },
                                            { rank: 2, nama: "SMPN 2 Bandung", jenjang: "SMP", pendaftar: 172, kuota: 180 },
                                            { rank: 3, nama: "SDN 1 Sukajadi", jenjang: "SD", pendaftar: 95, kuota: 120 },
                                            { rank: 4, nama: "SDN 2 Sukasari", jenjang: "SD", pendaftar: 88, kuota: 100 },
                                            { rank: 5, nama: "SDN 3 Coblong", jenjang: "SD", pendaftar: 67, kuota: 90 },
                                        ].map((s) => (
                                            <tr key={s.rank} className="border-b last:border-0">
                                                <td className="py-3 px-4">
                                                    <span className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                                        s.rank === 1 ? "bg-amber-100 text-amber-600" :
                                                            s.rank === 2 ? "bg-gray-200 text-gray-600" :
                                                                s.rank === 3 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                                                    )}>
                                                        {s.rank}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-900">{s.nama}</td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={s.jenjang === "SD" ? "info" : "warning"} size="sm">{s.jenjang}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">{s.pendaftar}</td>
                                                <td className="py-3 px-4 text-gray-600">{s.kuota}</td>
                                                <td className="py-3 px-4">
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${(s.pendaftar / s.kuota) * 100}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
