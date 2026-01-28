"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Megaphone,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Clock,
    ChevronRight,
    Image,
    Send,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Modal, Input, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface Announcement {
    id: string;
    title: string;
    content: string;
    category: "info" | "urgent" | "event" | "result";
    status: "draft" | "published" | "scheduled";
    publishedAt?: string;
    scheduledAt?: string;
    views: number;
}

// ============================================
// Create/Edit Modal
// ============================================

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement | null;
    onSubmit: (data: Partial<Announcement>) => void;
}

function AnnouncementModal({ isOpen, onClose, announcement, onSubmit }: AnnouncementModalProps) {
    const [title, setTitle] = useState(announcement?.title || "");
    const [content, setContent] = useState(announcement?.content || "");
    const [category, setCategory] = useState(announcement?.category || "info");

    const handleSubmit = () => {
        if (title && content) {
            onSubmit({ title, content, category: category as Announcement["category"] });
            setTitle("");
            setContent("");
            setCategory("info");
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={announcement ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
            size="lg"
        >
            <div className="space-y-4">
                <Input
                    label="Judul Pengumuman"
                    placeholder="Masukkan judul pengumuman"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <Select
                    label="Kategori"
                    placeholder="Pilih kategori"
                    options={[
                        { value: "info", label: "Informasi" },
                        { value: "urgent", label: "Penting/Mendesak" },
                        { value: "event", label: "Acara" },
                        { value: "result", label: "Hasil Seleksi" },
                    ]}
                    value={category}
                    onChange={setCategory}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Isi Pengumuman <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Simple toolbar */}
                        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b">
                            <button className="p-2 hover:bg-gray-100 rounded">
                                <span className="font-bold text-sm">B</span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded">
                                <span className="italic text-sm">I</span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded">
                                <span className="underline text-sm">U</span>
                            </button>
                            <div className="w-px h-6 bg-gray-200 mx-1" />
                            <button className="p-2 hover:bg-gray-100 rounded">
                                <Image className="h-4 w-4" />
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tulis isi pengumuman..."
                            className="w-full h-40 px-4 py-3 focus:outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        disabled={!title || !content}
                    >
                        Simpan Draft
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={!title || !content}
                        leftIcon={<Send className="h-4 w-4" />}
                    >
                        Publikasikan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Announcement Card
// ============================================

interface AnnouncementCardProps {
    announcement: Announcement;
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}

function AnnouncementCard({ announcement, onEdit, onDelete, onView }: AnnouncementCardProps) {
    const categoryConfig = {
        info: { label: "Informasi", color: "bg-blue-100 text-blue-600" },
        urgent: { label: "Penting", color: "bg-red-100 text-red-600" },
        event: { label: "Acara", color: "bg-purple-100 text-purple-600" },
        result: { label: "Hasil", color: "bg-green-100 text-green-600" },
    };

    const statusConfig = {
        draft: { label: "Draft", variant: "secondary" as const },
        published: { label: "Dipublikasikan", variant: "success" as const },
        scheduled: { label: "Terjadwal", variant: "warning" as const },
    };

    const config = categoryConfig[announcement.category];

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", config.color)}>
                        {config.label}
                    </span>
                    <Badge variant={statusConfig[announcement.status].variant} size="sm">
                        {statusConfig[announcement.status].label}
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onView}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{announcement.content}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50/50">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{announcement.publishedAt || announcement.scheduledAt || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{announcement.views} views</span>
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const announcements: Announcement[] = [
        {
            id: "1",
            title: "Pendaftaran SPMB Tahun Ajaran 2026/2027 Telah Dibuka",
            content: "Kami informasikan bahwa pendaftaran Seleksi Penerimaan Murid Baru (SPMB) untuk tahun ajaran 2026/2027 telah resmi dibuka. Pendaftaran dapat dilakukan secara online melalui sistem SPMB...",
            category: "info",
            status: "published",
            publishedAt: "15 Jan 2026",
            views: 1250,
        },
        {
            id: "2",
            title: "PENTING: Batas Waktu Upload Berkas Diperpanjang",
            content: "Mengingat banyaknya kendala teknis yang dialami pendaftar, kami memperpanjang batas waktu upload berkas hingga tanggal 15 Februari 2026...",
            category: "urgent",
            status: "published",
            publishedAt: "28 Jan 2026",
            views: 856,
        },
        {
            id: "3",
            title: "Jadwal Pengumuman Hasil Seleksi",
            content: "Hasil seleksi SPMB akan diumumkan pada tanggal 15 Maret 2026 pukul 10.00 WIB melalui website resmi dan aplikasi SPMB...",
            category: "result",
            status: "scheduled",
            scheduledAt: "15 Mar 2026",
            views: 0,
        },
        {
            id: "4",
            title: "Sosialisasi SPMB untuk Orang Tua",
            content: "Kami mengundang seluruh orang tua/wali calon siswa untuk menghadiri acara sosialisasi SPMB yang akan dilaksanakan...",
            category: "event",
            status: "draft",
            views: 0,
        },
    ];

    const filteredAnnouncements = announcements.filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || a.category === filterCategory;
        const matchesStatus = filterStatus === "all" || a.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleSubmit = (data: Partial<Announcement>) => {
        console.log("Submit:", data);
    };

    const openEditModal = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
    };

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
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
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pengumuman</h1>
                        <p className="text-gray-500 mt-1">
                            Kelola pengumuman untuk siswa dan orang tua
                        </p>
                    </div>
                    <Button
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                            setSelectedAnnouncement(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Buat Pengumuman
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: "Total", value: announcements.length },
                        { label: "Dipublikasikan", value: announcements.filter((a) => a.status === "published").length },
                        { label: "Terjadwal", value: announcements.filter((a) => a.status === "scheduled").length },
                        { label: "Draft", value: announcements.filter((a) => a.status === "draft").length },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="elevated">
                        <CardContent className="py-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari pengumuman..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <Select
                                    placeholder="Kategori"
                                    options={[
                                        { value: "all", label: "Semua Kategori" },
                                        { value: "info", label: "Informasi" },
                                        { value: "urgent", label: "Penting" },
                                        { value: "event", label: "Acara" },
                                        { value: "result", label: "Hasil" },
                                    ]}
                                    value={filterCategory}
                                    onChange={setFilterCategory}
                                    className="w-full md:w-48"
                                />
                                <Select
                                    placeholder="Status"
                                    options={[
                                        { value: "all", label: "Semua Status" },
                                        { value: "published", label: "Dipublikasikan" },
                                        { value: "scheduled", label: "Terjadwal" },
                                        { value: "draft", label: "Draft" },
                                    ]}
                                    value={filterStatus}
                                    onChange={setFilterStatus}
                                    className="w-full md:w-48"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Announcements Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-2 gap-4"
                >
                    {filteredAnnouncements.length === 0 ? (
                        <div className="md:col-span-2">
                            <Card variant="elevated">
                                <CardContent className="py-12 text-center">
                                    <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="font-medium text-gray-900 mb-1">Belum ada pengumuman</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Buat pengumuman pertama Anda
                                    </p>
                                    <Button onClick={() => setIsModalOpen(true)}>
                                        Buat Pengumuman
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        filteredAnnouncements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onEdit={() => openEditModal(announcement)}
                                onDelete={() => console.log("Delete:", announcement.id)}
                                onView={() => console.log("View:", announcement.id)}
                            />
                        ))
                    )}
                </motion.div>
            </div>

            {/* Modal */}
            <AnnouncementModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedAnnouncement(null);
                }}
                announcement={selectedAnnouncement}
                onSubmit={handleSubmit}
            />
        </DashboardLayout>
    );
}
