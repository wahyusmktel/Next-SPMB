"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Medal,
    Award,
    MapPin,
    User,
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Info,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Select } from "@/components/ui";
import { TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface RankingEntry {
    rank: number;
    id: string;
    name: string;
    nisn: string;
    jalur: string;
    distance: number;
    score?: number;
    status: "diterima" | "cadangan" | "tidak_diterima";
}

// ============================================
// Rank Badge
// ============================================

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg">
                <Medal className="h-5 w-5 text-white" />
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Award className="h-5 w-5 text-white" />
            </div>
        );
    }
    return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="font-bold text-gray-500">{rank}</span>
        </div>
    );
}

// ============================================
// Top 3 Cards
// ============================================

function TopThreeCards({ entries }: { entries: RankingEntry[] }) {
    const top3 = entries.slice(0, 3);

    const gradients = [
        "from-yellow-400 via-amber-500 to-orange-500",
        "from-gray-300 via-gray-400 to-gray-500",
        "from-orange-300 via-orange-400 to-orange-500",
    ];

    // Reorder for display: 2nd, 1st, 3rd
    const displayOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

    return (
        <div className="flex items-end justify-center gap-4">
            {displayOrder.map((entry, displayIndex) => {
                const actualRank = entry.rank;
                const isFirst = actualRank === 1;

                return (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: displayIndex * 0.1 }}
                        className={cn(
                            "relative",
                            isFirst ? "z-10" : "z-0"
                        )}
                    >
                        <div
                            className={cn(
                                "rounded-2xl p-6 text-center",
                                isFirst ? "bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-200" : "bg-white border border-gray-100",
                                isFirst ? "w-44" : "w-36"
                            )}
                        >
                            {/* Rank Badge */}
                            <div className={cn(
                                "absolute -top-5 left-1/2 -translate-x-1/2",
                                isFirst ? "scale-125" : ""
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br",
                                    gradients[actualRank - 1]
                                )}>
                                    {actualRank === 1 ? (
                                        <Trophy className="h-5 w-5 text-white" />
                                    ) : actualRank === 2 ? (
                                        <Medal className="h-5 w-5 text-white" />
                                    ) : (
                                        <Award className="h-5 w-5 text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Avatar */}
                            <div className={cn(
                                "mx-auto rounded-full bg-primary/10 flex items-center justify-center mt-4 mb-3",
                                isFirst ? "w-16 h-16" : "w-12 h-12"
                            )}>
                                <User className={cn(
                                    "text-primary",
                                    isFirst ? "h-8 w-8" : "h-6 w-6"
                                )} />
                            </div>

                            {/* Name */}
                            <h4 className={cn(
                                "font-semibold text-gray-900 truncate",
                                isFirst ? "text-base" : "text-sm"
                            )}>
                                {entry.name}
                            </h4>

                            {/* Distance */}
                            <div className="flex items-center justify-center gap-1 mt-2 text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span className="text-xs">{entry.distance} km</span>
                            </div>

                            {/* Status */}
                            <div className="mt-3">
                                <Badge variant="success" size="sm">Diterima</Badge>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ============================================
// Ranking Table
// ============================================

function RankingTable({ entries }: { entries: RankingEntry[] }) {
    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Peringkat Lengkap</CardTitle>
                <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                    Export
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Peringkat</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Nama</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">NISN</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jalur</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jarak</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <motion.tr
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "border-b last:border-0",
                                        entry.status === "diterima" ? "bg-green-50/50" :
                                            entry.status === "cadangan" ? "bg-amber-50/50" : ""
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <RankBadge rank={entry.rank} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium text-gray-900">{entry.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{entry.nisn}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" size="sm">{entry.jalur}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            <span>{entry.distance} km</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                entry.status === "diterima" ? "success" :
                                                    entry.status === "cadangan" ? "warning" : "secondary"
                                            }
                                            size="sm"
                                        >
                                            {entry.status === "diterima" ? "Diterima" :
                                                entry.status === "cadangan" ? "Cadangan" : "Tidak Diterima"}
                                        </Badge>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <p className="text-sm text-gray-500">
                        Menampilkan 1-10 dari 118 pendaftar
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm">1</span>
                        <span className="px-3 py-1 text-gray-500 text-sm">2</span>
                        <span className="px-3 py-1 text-gray-500 text-sm">3</span>
                        <Button variant="outline" size="sm">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Ranking Page
// ============================================

export default function RankingPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [filterJalur, setFilterJalur] = useState("all");

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const rankings: RankingEntry[] = [
        { rank: 1, id: "1", name: "Budi Santoso", nisn: "1122334455", jalur: "Zonasi", distance: 0.3, status: "diterima" },
        { rank: 2, id: "2", name: "Ahmad Pratama", nisn: "1234567890", jalur: "Zonasi", distance: 0.5, status: "diterima" },
        { rank: 3, id: "3", name: "Siti Nurhaliza", nisn: "0987654321", jalur: "Zonasi", distance: 0.8, status: "diterima" },
        { rank: 4, id: "4", name: "Dewi Lestari", nisn: "5544332211", jalur: "Zonasi", distance: 1.0, status: "diterima" },
        { rank: 5, id: "5", name: "Eko Prasetyo", nisn: "6677889900", jalur: "Zonasi", distance: 1.2, status: "diterima" },
        { rank: 6, id: "6", name: "Rina Wati", nisn: "1122112211", jalur: "Zonasi", distance: 1.5, status: "diterima" },
        { rank: 7, id: "7", name: "Joko Widodo", nisn: "3344334433", jalur: "Zonasi", distance: 1.8, status: "cadangan" },
        { rank: 8, id: "8", name: "Ani Kusuma", nisn: "5566556655", jalur: "Zonasi", distance: 2.0, status: "cadangan" },
        { rank: 9, id: "9", name: "Rudi Hartono", nisn: "7788778877", jalur: "Zonasi", distance: 2.3, status: "tidak_diterima" },
        { rank: 10, id: "10", name: "Maya Sari", nisn: "9900990099", jalur: "Zonasi", distance: 2.5, status: "tidak_diterima" },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <TableSkeleton rows={10} columns={6} />
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
                            Peringkat Pendaftar
                        </h1>
                        <p className="text-gray-500 mt-1">
                            SMPN 1 Sukajadi • Tahun Ajaran 2026/2027
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            placeholder="Jalur"
                            options={[
                                { value: "all", label: "Semua Jalur" },
                                { value: "zonasi", label: "Zonasi" },
                                { value: "prestasi", label: "Prestasi" },
                                { value: "afirmasi", label: "Afirmasi" },
                                { value: "perpindahan", label: "Perpindahan" },
                            ]}
                            value={filterJalur}
                            onChange={setFilterJalur}
                            className="w-48"
                        />
                        <Button leftIcon={<Download className="h-4 w-4" />}>
                            Export
                        </Button>
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
                >
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <strong>Jalur Zonasi:</strong> Peringkat berdasarkan jarak terdekat dari rumah ke sekolah.
                        Kuota tersedia: <strong>150</strong> siswa. Cadangan: <strong>15</strong> siswa.
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: "Total Pendaftar", value: 118, icon: User, color: "text-gray-900" },
                        { label: "Diterima", value: 85, icon: Trophy, color: "text-green-600" },
                        { label: "Cadangan", value: 15, icon: Medal, color: "text-amber-600" },
                        { label: "Tidak Diterima", value: 18, icon: TrendingUp, color: "text-red-600" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2">
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                            <p className={cn("text-2xl font-bold mt-1", stat.color)}>
                                {formatNumber(stat.value)}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Top 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card variant="elevated" className="overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4">
                            <h3 className="font-semibold text-center">🏆 Peringkat Teratas</h3>
                        </div>
                        <CardContent className="py-10">
                            <TopThreeCards entries={rankings} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Full Ranking Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <RankingTable entries={rankings} />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
