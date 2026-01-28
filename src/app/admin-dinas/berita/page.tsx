"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Newspaper,
    Plus,
    Edit,
    Trash2,
    Eye,
    Send,
    Calendar,
    Search,
    Image,
    ExternalLink,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface NewsItem {
    id: string;
    judul: string;
    ringkasan: string;
    gambar?: string;
    status: "draft" | "published";
    publishedAt?: string;
    views: number;
    kategori: string;
}

// ============================================
// News Modal
// ============================================

function NewsModal({
    isOpen,
    onClose,
    news,
}: {
    isOpen: boolean;
    onClose: () => void;
    news?: NewsItem | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={news ? "Edit Berita" : "Buat Berita"} size="lg">
            <div className="space-y-4">
                <Input label="Judul" placeholder="Judul berita" defaultValue={news?.judul} />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Gambar Thumbnail</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Klik untuk upload gambar</p>
                        <Button variant="outline" size="sm">Pilih File</Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ringkasan</label>
                    <textarea
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ringkasan singkat..."
                        defaultValue={news?.ringkasan}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Isi Berita</label>
                    <textarea
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Tulis isi berita..."
                    />
                </div>
                <Select
                    label="Kategori"
                    defaultValue={news?.kategori || "umum"}
                    options={[
                        { value: "umum", label: "Umum" },
                        { value: "pendaftaran", label: "Pendaftaran" },
                        { value: "pengumuman", label: "Pengumuman" },
                        { value: "kegiatan", label: "Kegiatan" },
                    ]}
                />
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Simpan Draft
                    </Button>
                    <Button className="flex-1" leftIcon={<Send className="h-4 w-4" />}>
                        Publikasikan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// News Card
// ============================================

function NewsCard({
    news,
    onEdit,
    onDelete,
}: {
    news: NewsItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
        >
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {news.gambar ? (
                    <img src={news.gambar} alt={news.judul} className="w-full h-full object-cover" />
                ) : (
                    <Newspaper className="h-12 w-12 text-gray-300" />
                )}
            </div>
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" size="sm">{news.kategori}</Badge>
                    <Badge variant={news.status === "published" ? "success" : "secondary"} size="sm">
                        {news.status === "published" ? "Dipublikasikan" : "Draft"}
                    </Badge>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{news.judul}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{news.ringkasan}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {news.publishedAt || "Draft"}
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {news.views} views
                    </div>
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
// Main Page
// ============================================

export default function BeritaPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const newsList: NewsItem[] = [
        {
            id: "1",
            judul: "Dinas Pendidikan Gelar Sosialisasi SPMB 2026",
            ringkasan: "Dinas Pendidikan Kota Bandung mengadakan acara sosialisasi sistem SPMB kepada seluruh kepala sekolah dan panitia pendaftaran.",
            status: "published",
            publishedAt: "20 Jan 2026",
            views: 523,
            kategori: "Kegiatan",
        },
        {
            id: "2",
            judul: "Tips Sukses Mendaftar di Jalur Zonasi",
            ringkasan: "Berikut adalah tips dan trik untuk memaksimalkan peluang diterima melalui jalur zonasi di tahun ajaran 2026/2027.",
            status: "published",
            publishedAt: "18 Jan 2026",
            views: 1245,
            kategori: "Pendaftaran",
        },
        {
            id: "3",
            judul: "Persiapan Dokumen Pendaftaran SPMB",
            ringkasan: "Pastikan Anda telah menyiapkan seluruh dokumen yang diperlukan sebelum melakukan pendaftaran online.",
            status: "published",
            publishedAt: "15 Jan 2026",
            views: 892,
            kategori: "Pendaftaran",
        },
        {
            id: "4",
            judul: "Workshop Penggunaan Sistem SPMB untuk Admin",
            ringkasan: "Workshop intensif untuk admin sekolah dalam mengoperasikan sistem SPMB versi terbaru.",
            status: "draft",
            views: 0,
            kategori: "Kegiatan",
        },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <CardSkeleton key={i} lines={5} />)}
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
                        <h1 className="text-2xl font-bold text-gray-900">Berita</h1>
                        <p className="text-gray-500 mt-1">Kelola berita dan artikel SPMB</p>
                    </div>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelectedNews(null); setIsModalOpen(true); }}>
                        Tulis Berita
                    </Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Berita", value: "24", color: "bg-blue-500" },
                        { label: "Dipublikasikan", value: "18", color: "bg-green-500" },
                        { label: "Total Views", value: "12.5K", color: "bg-purple-500" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 border border-gray-100"
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3", stat.color)}>
                                <Newspaper className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="py-4">
                        <Input
                            placeholder="Cari berita..."
                            leftIcon={<Search className="h-4 w-4" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newsList.map((news, index) => (
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <NewsCard
                                news={news}
                                onEdit={() => { setSelectedNews(news); setIsModalOpen(true); }}
                                onDelete={() => { }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            <NewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                news={selectedNews}
            />
        </DashboardLayout>
    );
}
