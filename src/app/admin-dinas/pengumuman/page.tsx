"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Megaphone,
    Plus,
    Edit,
    Trash2,
    Eye,
    Send,
    Calendar,
    Search,
    Filter,
    Info,
    AlertTriangle,
    Bell,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface Announcement {
    id: string;
    judul: string;
    isi: string;
    tipe: "info" | "warning" | "urgent";
    status: "draft" | "published" | "scheduled";
    publishedAt?: string;
    views: number;
}

// ============================================
// Announcement Modal
// ============================================

function AnnouncementModal({
    isOpen,
    onClose,
    announcement,
}: {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={announcement ? "Edit Pengumuman" : "Buat Pengumuman"} size="lg">
            <div className="space-y-4">
                <Input label="Judul" placeholder="Judul pengumuman" defaultValue={announcement?.judul} />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Isi Pengumuman</label>
                    <textarea
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Tulis isi pengumuman..."
                        defaultValue={announcement?.isi}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Tipe"
                        defaultValue={announcement?.tipe || "info"}
                        options={[
                            { value: "info", label: "Informasi" },
                            { value: "warning", label: "Peringatan" },
                            { value: "urgent", label: "Penting" },
                        ]}
                    />
                    <Select
                        label="Status"
                        defaultValue={announcement?.status || "draft"}
                        options={[
                            { value: "draft", label: "Draft" },
                            { value: "published", label: "Publikasikan" },
                            { value: "scheduled", label: "Jadwalkan" },
                        ]}
                    />
                </div>
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button className="flex-1" leftIcon={<Send className="h-4 w-4" />}>
                        {announcement ? "Simpan" : "Publikasikan"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Announcement Card
// ============================================

function AnnouncementCard({
    announcement,
    onEdit,
    onDelete,
}: {
    announcement: Announcement;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const tipeConfig = {
        info: { icon: Info, color: "bg-blue-100 text-blue-600", label: "Informasi" },
        warning: { icon: AlertTriangle, color: "bg-amber-100 text-amber-600", label: "Peringatan" },
        urgent: { icon: Bell, color: "bg-red-100 text-red-600", label: "Penting" },
    };

    const statusConfig = {
        draft: { color: "secondary", label: "Draft" },
        published: { color: "success", label: "Dipublikasikan" },
        scheduled: { color: "info", label: "Terjadwal" },
    };

    const config = tipeConfig[announcement.tipe];
    const Icon = config.icon;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-2 rounded-lg", config.color)}>
                            <Icon className="h-4 w-4" />
                        </div>
                        <Badge variant={statusConfig[announcement.status].color as "success" | "secondary" | "info"} size="sm">
                            {statusConfig[announcement.status].label}
                        </Badge>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button onClick={onDelete} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                    </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{announcement.judul}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{announcement.isi}</p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {announcement.publishedAt || "Belum dipublikasikan"}
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {announcement.views} views
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// Main Page
// ============================================

export default function PengumumanPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [filterTipe, setFilterTipe] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const announcements: Announcement[] = [
        {
            id: "1",
            judul: "Pendaftaran SPMB 2026/2027 Dibuka",
            isi: "Kami informasikan bahwa pendaftaran Seleksi Penerimaan Murid Baru untuk tahun ajaran 2026/2027 telah resmi dibuka. Pendaftaran dapat dilakukan secara online.",
            tipe: "info",
            status: "published",
            publishedAt: "15 Jan 2026",
            views: 1250,
        },
        {
            id: "2",
            judul: "Perpanjangan Waktu Upload Berkas",
            isi: "Mengingat banyaknya kendala teknis yang dialami pendaftar, kami memperpanjang batas waktu upload berkas hingga tanggal 15 Februari 2026.",
            tipe: "warning",
            status: "published",
            publishedAt: "28 Jan 2026",
            views: 856,
        },
        {
            id: "3",
            judul: "PENTING: Perubahan Jadwal Seleksi",
            isi: "Jadwal seleksi SPMB dipindahkan dari tanggal 10 Maret ke tanggal 15 Maret 2026. Harap semua pihak dapat menyesuaikan.",
            tipe: "urgent",
            status: "published",
            publishedAt: "1 Feb 2026",
            views: 2341,
        },
        {
            id: "4",
            judul: "Sosialisasi SPMB Online",
            isi: "Akan diadakan sosialisasi SPMB secara online pada tanggal 5 Februari 2026 pukul 10.00 WIB melalui Zoom Meeting.",
            tipe: "info",
            status: "scheduled",
            views: 0,
        },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <CardSkeleton key={i} lines={4} />)}
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
                        <h1 className="text-2xl font-bold text-gray-900">Pengumuman</h1>
                        <p className="text-gray-500 mt-1">Kelola pengumuman SPMB</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedAnnouncement(null); setIsModalOpen(true); }}>
                        Buat Pengumuman
                    </Button>
                </motion.div>

                {/* Filters */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari pengumuman..."
                                    leftIcon={<Search className="h-4 w-4" />}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={filterTipe}
                                onChange={(e) => setFilterTipe(e.target.value)}
                                options={[
                                    { value: "all", label: "Semua Tipe" },
                                    { value: "info", label: "Informasi" },
                                    { value: "warning", label: "Peringatan" },
                                    { value: "urgent", label: "Penting" },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {announcements.map((announcement, index) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <AnnouncementCard
                                announcement={announcement}
                                onEdit={() => { setSelectedAnnouncement(announcement); setIsModalOpen(true); }}
                                onDelete={() => { }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                announcement={selectedAnnouncement}
            />
        </DashboardLayout>
    );
}
