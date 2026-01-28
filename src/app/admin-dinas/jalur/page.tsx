"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Route,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    MapPin,
    Award,
    Users,
    Heart,
    GripVertical,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface JalurData {
    id: string;
    nama: string;
    type: "zonasi" | "prestasi" | "afirmasi" | "perpindahan";
    kuotaPersen: number;
    description: string;
    isActive: boolean;
    persyaratan: string[];
}

// ============================================
// Jalur Card
// ============================================

function JalurCard({
    jalur,
    onEdit,
    onDelete,
}: {
    jalur: JalurData;
    onEdit: () => void;
    onDelete: () => void;
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

    const Icon = iconMap[jalur.type];

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-xl", colorMap[jalur.type])}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{jalur.nama}</h4>
                            <p className="text-xs text-gray-500 capitalize">{jalur.type}</p>
                        </div>
                    </div>
                    <Badge variant={jalur.isActive ? "success" : "secondary"} size="sm" dot>
                        {jalur.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4">{jalur.description}</p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Kuota</span>
                    <span className="text-lg font-bold text-primary">{jalur.kuotaPersen}%</span>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// Jalur Form Modal
// ============================================

function JalurModal({
    isOpen,
    onClose,
    jalur,
}: {
    isOpen: boolean;
    onClose: () => void;
    jalur?: JalurData | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={jalur ? "Edit Jalur" : "Tambah Jalur"} size="md">
            <div className="space-y-4">
                <Input label="Nama Jalur" placeholder="Masukkan nama jalur" defaultValue={jalur?.nama} />
                <Select
                    label="Tipe Jalur"
                    defaultValue={jalur?.type || "zonasi"}
                    options={[
                        { value: "zonasi", label: "Zonasi" },
                        { value: "prestasi", label: "Prestasi" },
                        { value: "afirmasi", label: "Afirmasi" },
                        { value: "perpindahan", label: "Perpindahan Ortu" },
                    ]}
                />
                <Input type="number" label="Kuota (%)" placeholder="0-100" defaultValue={jalur?.kuotaPersen?.toString()} />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Deskripsi jalur pendaftaran..."
                        defaultValue={jalur?.description}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" defaultChecked={jalur?.isActive ?? true} className="rounded border-gray-300" />
                    <label htmlFor="isActive" className="text-sm text-gray-700">Aktifkan jalur ini</label>
                </div>
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

export default function JalurPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJalur, setSelectedJalur] = useState<JalurData | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const jalurList: JalurData[] = [
        {
            id: "1",
            nama: "Jalur Zonasi",
            type: "zonasi",
            kuotaPersen: 50,
            description: "Jalur pendaftaran berdasarkan jarak tempat tinggal ke sekolah. Prioritas diberikan kepada calon siswa yang berdomisili lebih dekat dengan sekolah.",
            isActive: true,
            persyaratan: ["KK", "Akta Lahir", "Ijazah"],
        },
        {
            id: "2",
            nama: "Jalur Prestasi",
            type: "prestasi",
            kuotaPersen: 25,
            description: "Jalur pendaftaran untuk siswa berprestasi di bidang akademik maupun non-akademik dengan bukti sertifikat/piagam.",
            isActive: true,
            persyaratan: ["KK", "Akta Lahir", "Ijazah", "Sertifikat Prestasi"],
        },
        {
            id: "3",
            nama: "Jalur Afirmasi",
            type: "afirmasi",
            kuotaPersen: 15,
            description: "Jalur khusus untuk siswa dari keluarga kurang mampu dengan bukti SKTM atau penerima bantuan sosial.",
            isActive: true,
            persyaratan: ["KK", "Akta Lahir", "Ijazah", "SKTM/KIP"],
        },
        {
            id: "4",
            nama: "Jalur Perpindahan Orang Tua",
            type: "perpindahan",
            kuotaPersen: 10,
            description: "Jalur untuk siswa yang orang tuanya pindah tugas ke wilayah ini dengan bukti surat tugas/mutasi.",
            isActive: true,
            persyaratan: ["KK", "Akta Lahir", "Ijazah", "Surat Tugas"],
        },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <CardSkeleton key={i} lines={4} />
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Jalur Pendaftaran</h1>
                        <p className="text-gray-500 mt-1">Kelola jalur dan kuota pendaftaran</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedJalur(null); setIsModalOpen(true); }}>
                        Tambah Jalur
                    </Button>
                </motion.div>

                {/* Total Kuota Info */}
                <Card variant="elevated">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Route className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Alokasi Kuota</p>
                                    <p className="text-xl font-bold text-gray-900">100%</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {jalurList.map((j) => (
                                    <div key={j.id} className="text-center px-3">
                                        <p className="text-lg font-bold text-primary">{j.kuotaPersen}%</p>
                                        <p className="text-xs text-gray-500 capitalize">{j.type}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Jalur Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    {jalurList.map((jalur, index) => (
                        <motion.div
                            key={jalur.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <JalurCard
                                jalur={jalur}
                                onEdit={() => { setSelectedJalur(jalur); setIsModalOpen(true); }}
                                onDelete={() => { }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            <JalurModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jalur={selectedJalur}
            />
        </DashboardLayout>
    );
}
