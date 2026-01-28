"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users,
    MapPin,
    Award,
    Heart,
    Save,
    Plus,
    Edit,
    Trash2,
    Map,
    Settings,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface QuotaData {
    id: string;
    jalur: string;
    type: "zonasi" | "prestasi" | "afirmasi" | "perpindahan";
    kuota: number;
    terisi: number;
    radiusZonasi?: number;
}

// ============================================
// Quota Card
// ============================================

function QuotaCard({
    quota,
    onEdit,
}: {
    quota: QuotaData;
    onEdit: () => void;
}) {
    const iconMap = {
        zonasi: MapPin,
        prestasi: Award,
        afirmasi: Heart,
        perpindahan: Users,
    };
    const colorMap = {
        zonasi: "bg-blue-100 text-blue-600",
        prestasi: "bg-amber-100 text-amber-600",
        afirmasi: "bg-pink-100 text-pink-600",
        perpindahan: "bg-green-100 text-green-600",
    };

    const Icon = iconMap[quota.type];
    const persen = Math.round((quota.terisi / quota.kuota) * 100);

    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-xl", colorMap[quota.type])}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{quota.jalur}</h4>
                            {quota.radiusZonasi && (
                                <p className="text-xs text-gray-500">Radius: {quota.radiusZonasi} km</p>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{quota.terisi}</p>
                            <p className="text-sm text-gray-500">dari {quota.kuota} kuota</p>
                        </div>
                        <Badge
                            variant={persen >= 90 ? "destructive" : persen >= 70 ? "warning" : "success"}
                            size="sm"
                        >
                            {persen}%
                        </Badge>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${persen}%` }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                "h-full rounded-full",
                                persen >= 90 ? "bg-red-500" : persen >= 70 ? "bg-amber-500" : "bg-green-500"
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Edit Quota Modal
// ============================================

function EditQuotaModal({
    isOpen,
    onClose,
    quota,
}: {
    isOpen: boolean;
    onClose: () => void;
    quota: QuotaData | null;
}) {
    if (!quota) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Kuota ${quota.jalur}`}>
            <div className="space-y-4">
                <Input type="number" label="Jumlah Kuota" defaultValue={quota.kuota.toString()} />
                {quota.type === "zonasi" && (
                    <Input type="number" label="Radius Zonasi (km)" defaultValue={quota.radiusZonasi?.toString()} />
                )}
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button className="flex-1" leftIcon={<Save className="h-4 w-4" />}>
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Page
// ============================================

export default function KuotaZonasiPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [selectedQuota, setSelectedQuota] = useState<QuotaData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const quotaList: QuotaData[] = [
        { id: "1", jalur: "Jalur Zonasi", type: "zonasi", kuota: 60, terisi: 48, radiusZonasi: 3 },
        { id: "2", jalur: "Jalur Prestasi", type: "prestasi", kuota: 30, terisi: 28 },
        { id: "3", jalur: "Jalur Afirmasi", type: "afirmasi", kuota: 18, terisi: 12 },
        { id: "4", jalur: "Jalur Perpindahan", type: "perpindahan", kuota: 12, terisi: 7 },
    ];

    const totalKuota = quotaList.reduce((acc, q) => acc + q.kuota, 0);
    const totalTerisi = quotaList.reduce((acc, q) => acc + q.terisi, 0);

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => <CardSkeleton key={i} lines={4} />)}
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
                        <h1 className="text-2xl font-bold text-gray-900">Kuota & Zonasi</h1>
                        <p className="text-gray-500 mt-1">Kelola kuota pendaftaran dan radius zonasi</p>
                    </div>
                    <Link href="/admin-sekolah/zonasi">
                        <Button variant="outline" leftIcon={<Map className="h-4 w-4" />}>
                            Lihat Peta Zonasi
                        </Button>
                    </Link>
                </motion.div>

                {/* Summary Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Kuota Tahun Ajaran 2026/2027</h3>
                                    <p className="text-gray-500">SDN 1 Sukajadi</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-primary">{totalKuota}</p>
                                        <p className="text-sm text-gray-500">Total Kuota</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-green-600">{totalTerisi}</p>
                                        <p className="text-sm text-gray-500">Terisi</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-amber-600">{totalKuota - totalTerisi}</p>
                                        <p className="text-sm text-gray-500">Tersisa</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(totalTerisi / totalKuota) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quota Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    {quotaList.map((quota, index) => (
                        <motion.div
                            key={quota.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <QuotaCard
                                quota={quota}
                                onEdit={() => { setSelectedQuota(quota); setIsModalOpen(true); }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Zonasi Settings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                Pengaturan Zonasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input type="number" label="Radius Zonasi Primer (km)" defaultValue="3" />
                                <Input type="number" label="Radius Zonasi Sekunder (km)" defaultValue="5" />
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <h4 className="font-medium text-blue-900 mb-2">Koordinat Sekolah</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-600">Latitude:</span>
                                        <span className="font-mono ml-2">-6.888100</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Longitude:</span>
                                        <span className="font-mono ml-2">107.602400</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button leftIcon={<Save className="h-4 w-4" />}>Simpan Pengaturan</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <EditQuotaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                quota={selectedQuota}
            />
        </DashboardLayout>
    );
}
