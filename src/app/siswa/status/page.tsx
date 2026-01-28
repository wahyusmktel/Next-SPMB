"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    MapPin,
    School,
    Calendar,
    Download,
    QrCode,
    Phone,
    AlertCircle,
    ChevronRight,
    Eye,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Modal } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

// ============================================
// Status Timeline
// ============================================

interface TimelineItem {
    date: string;
    time: string;
    title: string;
    description: string;
    status: "done" | "current" | "upcoming";
    icon: React.ElementType;
}

function StatusTimeline() {
    const timeline: TimelineItem[] = [
        {
            date: "15 Jan 2026",
            time: "10:23",
            title: "Pendaftaran Dikirim",
            description: "Formulir pendaftaran berhasil dikirim",
            status: "done",
            icon: FileText,
        },
        {
            date: "16 Jan 2026",
            time: "14:05",
            title: "Verifikasi Berkas",
            description: "Berkas sedang diverifikasi oleh admin sekolah",
            status: "done",
            icon: CheckCircle2,
        },
        {
            date: "18 Jan 2026",
            time: "09:30",
            title: "Berkas Terverifikasi",
            description: "Semua berkas telah diverifikasi dan dinyatakan lengkap",
            status: "done",
            icon: CheckCircle2,
        },
        {
            date: "15 Mar 2026",
            time: "-",
            title: "Pengumuman Hasil",
            description: "Hasil seleksi akan diumumkan pada tanggal ini",
            status: "upcoming",
            icon: Calendar,
        },
        {
            date: "-",
            time: "-",
            title: "Daftar Ulang",
            description: "Konfirmasi penerimaan dan daftar ulang",
            status: "upcoming",
            icon: School,
        },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="relative">
                    {timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4 pb-6 last:pb-0"
                        >
                            {/* Line */}
                            {index < timeline.length - 1 && (
                                <div
                                    className={cn(
                                        "absolute left-[19px] w-0.5 h-[calc(100%-4rem)]",
                                        item.status === "done" ? "bg-green-200" : "bg-gray-200"
                                    )}
                                    style={{ top: `${index * 80 + 48}px` }}
                                />
                            )}

                            {/* Icon */}
                            <div
                                className={cn(
                                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                    item.status === "done"
                                        ? "bg-green-100 text-green-600"
                                        : item.status === "current"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-400"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4
                                            className={cn(
                                                "font-medium",
                                                item.status === "upcoming" ? "text-gray-400" : "text-gray-900"
                                            )}
                                        >
                                            {item.title}
                                        </h4>
                                        <p
                                            className={cn(
                                                "text-sm mt-0.5",
                                                item.status === "upcoming" ? "text-gray-300" : "text-gray-500"
                                            )}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-gray-400">
                                        <p>{item.date}</p>
                                        {item.time !== "-" && <p>{item.time}</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Registration Card
// ============================================

function RegistrationCard() {
    const [showQR, setShowQR] = useState(false);

    return (
        <>
            <Card variant="elevated" className="overflow-hidden">
                {/* Status Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-white">
                            <h3 className="font-semibold text-lg">Pendaftaran Terverifikasi</h3>
                            <p className="text-white/80 text-sm">Menunggu pengumuman hasil seleksi</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Nomor Pendaftaran</p>
                                <p className="text-xl font-bold text-primary mt-1">SPMB-2026-A1B2C3</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">Nama Siswa</p>
                                    <p className="font-medium text-gray-900">Ahmad Pratama</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">NISN</p>
                                    <p className="font-medium text-gray-900">1234567890</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Jalur Pendaftaran</p>
                                    <Badge variant="info" size="sm">Zonasi</Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Jarak</p>
                                    <p className="font-medium text-gray-900">1.2 km</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <School className="h-5 w-5 text-primary" />
                                    <p className="text-xs text-gray-400 uppercase">Sekolah Tujuan</p>
                                </div>
                                <h4 className="font-semibold text-gray-900">SMPN 1 Sukajadi</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Jl. Sukajadi No. 123, Bandung
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    leftIcon={<QrCode className="h-4 w-4" />}
                                    onClick={() => setShowQR(true)}
                                >
                                    Lihat QR
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    leftIcon={<Download className="h-4 w-4" />}
                                >
                                    Unduh Bukti
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* QR Modal */}
            <Modal isOpen={showQR} onClose={() => setShowQR(false)} title="QR Code Pendaftaran">
                <div className="text-center py-6">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Scan QR code ini untuk memverifikasi keaslian pendaftaran
                    </p>
                    <p className="font-mono text-xs text-gray-400 mt-2">SPMB-2026-A1B2C3</p>
                    <Button className="mt-6" leftIcon={<Download className="h-4 w-4" />}>
                        Unduh QR Code
                    </Button>
                </div>
            </Modal>
        </>
    );
}

// ============================================
// Documents Status
// ============================================

function DocumentsStatus() {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

    const documents = [
        { id: "kk", name: "Kartu Keluarga", status: "verified", date: "16 Jan 2026" },
        { id: "akta", name: "Akta Kelahiran", status: "verified", date: "16 Jan 2026" },
        { id: "ijazah", name: "Ijazah SD", status: "verified", date: "17 Jan 2026" },
        { id: "foto", name: "Pas Foto 3x4", status: "verified", date: "16 Jan 2026" },
    ];

    return (
        <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Status Berkas</CardTitle>
                <Badge variant="success" size="sm">
                    {documents.filter((d) => d.status === "verified").length}/{documents.length} Terverifikasi
                </Badge>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                {doc.status === "verified" ? (
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                ) : doc.status === "pending" ? (
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-amber-600" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                                    <p className="text-xs text-gray-400">Diverifikasi: {doc.date}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedDoc(doc.id)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Important Info Card
// ============================================

function ImportantInfoCard() {
    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg">Informasi Penting</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900">Jadwal Pengumuman</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Hasil seleksi akan diumumkan pada <strong>15 Maret 2026</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-amber-900">Perhatian</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                Pastikan nomor WhatsApp aktif untuk menerima notifikasi hasil seleksi
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Kontak Sekolah</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>022-1234567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>Jl. Sukajadi No. 123, Bandung</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Status Page
// ============================================

export default function StatusPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <CardSkeleton lines={6} />
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <CardSkeleton lines={8} />
                        </div>
                        <CardSkeleton lines={5} />
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
                >
                    <h1 className="text-2xl font-bold text-gray-900">Status Pendaftaran</h1>
                    <p className="text-gray-500 mt-1">
                        Detail dan riwayat status pendaftaran Anda
                    </p>
                </motion.div>

                {/* Registration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <RegistrationCard />
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <StatusTimeline />
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <DocumentsStatus />
                        <ImportantInfoCard />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
