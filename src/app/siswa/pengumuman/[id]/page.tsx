"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Info,
    AlertTriangle,
    Megaphone,
    Share2,
    Printer,
    ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ============================================
// Types
// ============================================

interface Announcement {
    id: string;
    title: string;
    content: string;
    fullContent: string;
    category: "info" | "urgent" | "event";
    publishedAt: string;
    author: string;
}

// ============================================
// Dummy Data
// ============================================

const announcementsData: Announcement[] = [
    {
        id: "1",
        title: "Jadwal Pengumuman Hasil Seleksi",
        content: "Hasil seleksi SPMB akan diumumkan pada tanggal 15 Maret 2026.",
        fullContent: `Hasil seleksi SPMB akan diumumkan pada tanggal 15 Maret 2026 pukul 10.00 WIB melalui website resmi dan aplikasi SPMB.

Berikut adalah hal-hal yang perlu diperhatikan:

1. **Waktu Pengumuman**
   Pengumuman akan dipublikasikan secara serentak pada tanggal 15 Maret 2026 pukul 10.00 WIB.

2. **Cara Melihat Hasil**
   - Login ke akun SPMB Anda
   - Klik menu "Status Pendaftaran"
   - Hasil seleksi akan ditampilkan di dashboard Anda

3. **Langkah Selanjutnya**
   Bagi yang dinyatakan diterima, harap segera melakukan daftar ulang sesuai jadwal yang telah ditentukan.

4. **Informasi Lebih Lanjut**
   Jika ada pertanyaan, silakan hubungi panitia SPMB melalui menu "Bantuan" di aplikasi atau datang langsung ke sekolah tujuan.

Pastikan Anda memantau status pendaftaran secara berkala dan siapkan dokumen yang diperlukan untuk proses daftar ulang.`,
        category: "event",
        publishedAt: "27 Januari 2026",
        author: "Panitia SPMB",
    },
    {
        id: "2",
        title: "Perubahan Jadwal Daftar Ulang",
        content: "Jadwal daftar ulang mengalami perubahan.",
        fullContent: `Dengan ini kami sampaikan bahwa jadwal daftar ulang mengalami perubahan.

**Jadwal Baru Daftar Ulang:**
- Tanggal: 20 - 25 Maret 2026
- Waktu: 08.00 - 15.00 WIB
- Tempat: Sekolah tujuan masing-masing

**Dokumen yang Harus Dibawa:**
1. Bukti pendaftaran online (dicetak)
2. Kartu Keluarga asli dan fotokopi (2 lembar)
3. Akta Kelahiran asli dan fotokopi (2 lembar)
4. Ijazah/SKHUN asli dan fotokopi (2 lembar)
5. Pas foto 3x4 (4 lembar) dengan latar merah
6. Materai 10.000 (2 buah)

**Catatan Penting:**
- Daftar ulang WAJIB dilakukan oleh orang tua/wali
- Ketidakhadiran pada jadwal daftar ulang akan dianggap mengundurkan diri
- Pastikan semua dokumen lengkap untuk menghindari penolakan

Harap maklum atas perubahan jadwal ini. Terima kasih atas perhatian dan kerjasama Anda.`,
        category: "urgent",
        publishedAt: "26 Januari 2026",
        author: "Dinas Pendidikan",
    },
    {
        id: "3",
        title: "Tips Persiapan Daftar Ulang",
        content: "Panduan lengkap persiapan daftar ulang bagi calon siswa yang diterima.",
        fullContent: `Selamat kepada calon siswa yang telah dinyatakan diterima! Berikut adalah tips persiapan daftar ulang:

**1. Persiapkan Dokumen Lebih Awal**
Jangan menunda untuk menyiapkan dokumen. Pastikan semua dokumen sudah lengkap minimal 3 hari sebelum jadwal daftar ulang.

**2. Periksa Kelengkapan Dokumen**
Checklist dokumen yang diperlukan:
- ☐ Bukti pendaftaran online
- ☐ Kartu Keluarga asli + fotokopi
- ☐ Akta Kelahiran asli + fotokopi
- ☐ Ijazah/SKHUN asli + fotokopi
- ☐ Pas foto terbaru
- ☐ Materai

**3. Datang Lebih Awal**
Disarankan datang 30 menit sebelum jam buka untuk menghindari antrian panjang.

**4. Gunakan Pakaian Rapi**
Meskipun tidak ada aturan khusus, dianjurkan menggunakan pakaian yang rapi dan sopan.

**5. Bawa Alat Tulis**
Siapkan pulpen untuk mengisi formulir tambahan jika diperlukan.

**6. Simpan Bukti Daftar Ulang**
Setelah selesai, pastikan Anda menerima dan menyimpan bukti daftar ulang dengan baik.

Semoga proses daftar ulang berjalan lancar!`,
        category: "info",
        publishedAt: "25 Januari 2026",
        author: "Tim SPMB",
    },
    {
        id: "4",
        title: "Pendaftaran SPMB Tahun Ajaran 2026/2027 Telah Dibuka",
        content: "Kami informasikan bahwa pendaftaran SPMB telah resmi dibuka.",
        fullContent: `Kami informasikan bahwa pendaftaran Seleksi Penerimaan Murid Baru (SPMB) untuk tahun ajaran 2026/2027 telah resmi dibuka.

**Jadwal Pendaftaran:**
- Pembukaan: 15 Januari 2026
- Penutupan: 28 Februari 2026

**Jalur Pendaftaran:**
1. Jalur Zonasi (50% kuota)
2. Jalur Prestasi (25% kuota)
3. Jalur Afirmasi (15% kuota)
4. Jalur Perpindahan (10% kuota)

**Cara Mendaftar:**
1. Buat akun di sistem SPMB
2. Lengkapi data diri dan data orang tua
3. Pilih sekolah tujuan
4. Upload dokumen yang diperlukan
5. Tunggu verifikasi dari sekolah

**Dokumen yang Diperlukan:**
- Kartu Keluarga
- Akta Kelahiran
- Ijazah/SKHUN (untuk SMP)
- Pas foto terbaru
- Dokumen pendukung sesuai jalur

Pendaftaran dapat dilakukan secara online melalui sistem SPMB. Pastikan data yang diinput sudah benar dan lengkap.`,
        category: "info",
        publishedAt: "15 Januari 2026",
        author: "Dinas Pendidikan",
    },
    {
        id: "5",
        title: "PENTING: Batas Waktu Upload Berkas Diperpanjang",
        content: "Batas waktu upload berkas diperpanjang hingga tanggal 15 Februari 2026.",
        fullContent: `Mengingat banyaknya kendala teknis yang dialami pendaftar, kami memperpanjang batas waktu upload berkas.

**Batas Waktu Baru:**
Tanggal 15 Februari 2026 pukul 23.59 WIB

**Alasan Perpanjangan:**
- Banyak laporan gangguan teknis pada server
- Beberapa daerah mengalami gangguan jaringan internet
- Permintaan dari banyak orang tua yang kesulitan mengakses sistem

**Yang Perlu Diperhatikan:**
1. Gunakan jaringan internet yang stabil
2. Ukuran file dokumen maksimal 2MB per file
3. Format file yang diterima: PDF, JPG, PNG
4. Pastikan dokumen terbaca dengan jelas

**Tips Upload Berkas:**
- Scan dokumen dengan resolusi 300 DPI
- Hindari jam sibuk (19.00 - 21.00 WIB)
- Simpan bukti upload sebagai antisipasi

Harap segera melengkapi berkas pendaftaran Anda sebelum batas waktu berakhir.

Terima kasih atas pengertian dan kerjasama Anda.`,
        category: "urgent",
        publishedAt: "28 Januari 2026",
        author: "Tim Teknis SPMB",
    },
];

// ============================================
// Main Page
// ============================================

export default function PengumumanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (params.id) {
            const found = announcementsData.find((a) => a.id === params.id);
            setAnnouncement(found || null);
        }
    }, [params.id]);

    const categoryConfig = {
        info: { label: "Informasi", icon: Info, color: "bg-blue-100 text-blue-600", borderColor: "border-blue-500" },
        urgent: { label: "Penting", icon: AlertTriangle, color: "bg-red-100 text-red-600", borderColor: "border-red-500" },
        event: { label: "Acara", icon: Calendar, color: "bg-purple-100 text-purple-600", borderColor: "border-purple-500" },
    };

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <CardSkeleton lines={8} />
                </div>
            </DashboardLayout>
        );
    }

    if (!announcement) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        leftIcon={<ArrowLeft className="h-4 w-4" />}
                        onClick={() => router.back()}
                    >
                        Kembali
                    </Button>

                    <Card variant="elevated" className="text-center py-12">
                        <CardContent>
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <Megaphone className="h-10 w-10 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Pengumuman Tidak Ditemukan
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Pengumuman yang Anda cari tidak tersedia atau sudah dihapus.
                            </p>
                            <Link href="/siswa/pengumuman">
                                <Button>
                                    Lihat Semua Pengumuman
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    const config = categoryConfig[announcement.category];
    const CategoryIcon = config.icon;

    // Get related announcements (excluding current)
    const relatedAnnouncements = announcementsData
        .filter((a) => a.id !== announcement.id)
        .slice(0, 3);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button
                        variant="ghost"
                        leftIcon={<ArrowLeft className="h-4 w-4" />}
                        onClick={() => router.back()}
                    >
                        Kembali
                    </Button>
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Article */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <Card variant="elevated" className={cn("overflow-hidden border-t-4", config.borderColor)}>
                            <CardContent className="p-6 md:p-8">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={cn("p-3 rounded-xl", config.color)}>
                                        <CategoryIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <Badge variant="outline" size="sm" className="mb-2">
                                            {config.label}
                                        </Badge>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {announcement.title}
                                        </h1>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{announcement.publishedAt}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Megaphone className="h-4 w-4" />
                                        <span>{announcement.author}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="prose prose-gray max-w-none">
                                    {announcement.fullContent.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="text-gray-600 mb-4 whitespace-pre-line">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<Share2 className="h-4 w-4" />}
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: announcement.title,
                                                    url: window.location.href,
                                                });
                                            }
                                        }}
                                    >
                                        Bagikan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<Printer className="h-4 w-4" />}
                                        onClick={() => window.print()}
                                    >
                                        Cetak
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Related Announcements */}
                        <Card variant="elevated">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Pengumuman Lainnya
                                </h3>
                                <div className="space-y-3">
                                    {relatedAnnouncements.map((related) => {
                                        const relatedConfig = categoryConfig[related.category];
                                        const RelatedIcon = relatedConfig.icon;
                                        return (
                                            <Link
                                                key={related.id}
                                                href={`/siswa/pengumuman/${related.id}`}
                                                className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn("p-2 rounded-lg", relatedConfig.color)}>
                                                        <RelatedIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                            {related.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {related.publishedAt}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <Link href="/siswa/pengumuman" className="block mt-4">
                                    <Button variant="outline" className="w-full">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Quick Help */}
                        <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-secondary/5">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Butuh Bantuan?
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Jika Anda memiliki pertanyaan terkait pengumuman ini, silakan hubungi kami.
                                </p>
                                <Link href="/siswa/tiket">
                                    <Button size="sm" className="w-full">
                                        Hubungi Panitia
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
