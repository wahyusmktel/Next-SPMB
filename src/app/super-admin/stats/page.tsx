"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Users,
    School,
    Home,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    PieChart,
    Activity,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Chart Component (Placeholder)
// ============================================

function BarChartPlaceholder({ title, height = "h-64" }: { title: string; height?: string }) {
    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("relative", height)}>
                    {/* Bar Chart Placeholder */}
                    <div className="absolute inset-0 flex items-end justify-around gap-2 p-4">
                        {[65, 85, 45, 75, 90, 55, 70, 80, 60, 95, 50, 88].map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${val}%` }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg"
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-gray-400 p-2">
                        {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].map((m) => (
                            <span key={m}>{m}</span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DoughnutChartPlaceholder({ title }: { title: string }) {
    const data = [
        { label: "Zonasi", value: 45, color: "bg-blue-500" },
        { label: "Prestasi", value: 25, color: "bg-amber-500" },
        { label: "Afirmasi", value: 20, color: "bg-pink-500" },
        { label: "Perpindahan", value: 10, color: "bg-green-500" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-8">
                    {/* Doughnut Placeholder */}
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                            <motion.circle
                                cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12"
                                strokeDasharray="251.2" strokeDashoffset="138"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 138 }}
                                transition={{ duration: 1 }}
                                transform="rotate(-90 50 50)"
                            />
                            <motion.circle
                                cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="12"
                                strokeDasharray="251.2" strokeDashoffset="188"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 188 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                transform="rotate(72 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold">100%</p>
                                <p className="text-xs text-gray-400">Total</p>
                            </div>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 space-y-3">
                        {data.map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className={cn("w-3 h-3 rounded-full", item.color)} />
                                <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                                <span className="font-medium">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Page
// ============================================

export default function StatsPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    const stats = [
        { label: "Total Dinas", value: "45", icon: Home, color: "bg-blue-500", change: "+2", trend: "up" },
        { label: "Total Sekolah", value: "1,245", icon: School, color: "bg-purple-500", change: "+18", trend: "up" },
        { label: "Total Pendaftar", value: "45,892", icon: Users, color: "bg-green-500", change: "+1,234", trend: "up" },
        { label: "Tingkat Kelulusan", value: "87.5%", icon: BarChart3, color: "bg-amber-500", change: "-2.1%", trend: "down" },
    ];

    const topDinas = [
        { nama: "Dinas Pendidikan Kota Bandung", pendaftar: 12450, sekolah: 245 },
        { nama: "Dinas Pendidikan Kab. Bandung", pendaftar: 9870, sekolah: 312 },
        { nama: "Dinas Pendidikan Kota Surabaya", pendaftar: 8920, sekolah: 198 },
        { nama: "Dinas Pendidikan Kota Semarang", pendaftar: 7650, sekolah: 176 },
        { nama: "Dinas Pendidikan Kota Yogyakarta", pendaftar: 5230, sekolah: 89 },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-gray-900">Statistik Nasional</h1>
                    <p className="text-gray-500 mt-1">Overview data pendaftaran seluruh Indonesia</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-5 border border-gray-100"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn("p-2.5 rounded-xl text-white", stat.color)}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className={cn("flex items-center gap-1 text-xs font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
                                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <BarChartPlaceholder title="Tren Pendaftaran Bulanan" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <DoughnutChartPlaceholder title="Distribusi Jalur Pendaftaran" />
                    </motion.div>
                </div>

                {/* Top Dinas */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="text-lg">Top 5 Dinas dengan Pendaftar Terbanyak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topDinas.map((dinas, index) => (
                                    <div key={dinas.nama} className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                            index === 0 ? "bg-amber-100 text-amber-600" :
                                                index === 1 ? "bg-gray-100 text-gray-600" :
                                                    index === 2 ? "bg-orange-100 text-orange-600" :
                                                        "bg-gray-50 text-gray-400"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{dinas.nama}</p>
                                            <p className="text-xs text-gray-500">{dinas.sekolah} sekolah</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{dinas.pendaftar.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">pendaftar</p>
                                        </div>
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
