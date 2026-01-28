"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    User,
    MapPin,
    Phone,
    Eye,
    FileText,
    ChevronLeft,
    ChevronRight,
    Download,
    Mail,
    Calendar,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Modal, Select } from "@/components/ui";
import { TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface Pendaftar {
    id: string;
    name: string;
    nisn: string;
    jalur: string;
    jenjang: string;
    status: "pending" | "verified" | "rejected" | "accepted" | "enrolled";
    distance: number;
    submittedAt: string;
    phone: string;
    email: string;
    address: string;
    parentName: string;
    parentPhone: string;
}

// ============================================
// Detail Modal
// ============================================

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    pendaftar: Pendaftar | null;
}

function DetailModal({ isOpen, onClose, pendaftar }: DetailModalProps) {
    if (!pendaftar) return null;

    const statusConfig = {
        pending: { label: "Menunggu", variant: "warning" as const },
        verified: { label: "Terverifikasi", variant: "info" as const },
        rejected: { label: "Ditolak", variant: "destructive" as const },
        accepted: { label: "Diterima", variant: "success" as const },
        enrolled: { label: "Daftar Ulang", variant: "success" as const },
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Pendaftar" size="lg">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{pendaftar.name}</h3>
                            <Badge variant={statusConfig[pendaftar.status].variant} size="sm">
                                {statusConfig[pendaftar.status].label}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">NISN: {pendaftar.nisn}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" size="sm">{pendaftar.jalur}</Badge>
                            <Badge variant={pendaftar.jenjang === "SD" ? "info" : "success"} size="sm">
                                {pendaftar.jenjang}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Informasi Kontak</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{pendaftar.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{pendaftar.email}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span>{pendaftar.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Orang Tua/Wali</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>{pendaftar.parentName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{pendaftar.parentPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-gray-400">Jarak</p>
                            <p className="text-lg font-semibold text-gray-900">{pendaftar.distance} km</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Tanggal Daftar</p>
                            <p className="text-lg font-semibold text-gray-900">{pendaftar.submittedAt}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Jalur</p>
                            <p className="text-lg font-semibold text-gray-900">{pendaftar.jalur}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Tutup
                    </Button>
                    <Button className="flex-1" leftIcon={<FileText className="h-4 w-4" />}>
                        Lihat Berkas
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Pendaftar Page
// ============================================

export default function PendaftarPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterJalur, setFilterJalur] = useState("all");
    const [selectedPendaftar, setSelectedPendaftar] = useState<Pendaftar | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const pendaftarList: Pendaftar[] = [
        {
            id: "1",
            name: "Ahmad Pratama",
            nisn: "1234567890",
            jalur: "Zonasi",
            jenjang: "SMP",
            status: "verified",
            distance: 1.2,
            submittedAt: "28 Jan 2026",
            phone: "08123456789",
            email: "ahmad@email.com",
            address: "Jl. Sukajadi No. 123, Bandung",
            parentName: "Budi Pratama",
            parentPhone: "08198765432",
        },
        {
            id: "2",
            name: "Siti Nurhaliza",
            nisn: "0987654321",
            jalur: "Prestasi",
            jenjang: "SMP",
            status: "accepted",
            distance: 2.5,
            submittedAt: "27 Jan 2026",
            phone: "08198765432",
            email: "siti@email.com",
            address: "Jl. Dago No. 45, Bandung",
            parentName: "Ahmad Nurdin",
            parentPhone: "08134567890",
        },
        {
            id: "3",
            name: "Budi Santoso",
            nisn: "1122334455",
            jalur: "Zonasi",
            jenjang: "SMP",
            status: "pending",
            distance: 0.8,
            submittedAt: "28 Jan 2026",
            phone: "08156789012",
            email: "budi@email.com",
            address: "Jl. Pasteur No. 67, Bandung",
            parentName: "Hadi Santoso",
            parentPhone: "08167890123",
        },
        {
            id: "4",
            name: "Dewi Lestari",
            nisn: "5544332211",
            jalur: "Afirmasi",
            jenjang: "SMP",
            status: "rejected",
            distance: 1.5,
            submittedAt: "26 Jan 2026",
            phone: "08134567890",
            email: "dewi@email.com",
            address: "Jl. Dipatiukur No. 89, Bandung",
            parentName: "Sri Lestari",
            parentPhone: "08145678901",
        },
        {
            id: "5",
            name: "Eko Prasetyo",
            nisn: "6677889900",
            jalur: "Zonasi",
            jenjang: "SD",
            status: "enrolled",
            distance: 3.2,
            submittedAt: "25 Jan 2026",
            phone: "08167890123",
            email: "eko@email.com",
            address: "Jl. Ciumbuleuit No. 12, Bandung",
            parentName: "Joko Prasetyo",
            parentPhone: "08178901234",
        },
    ];

    const filteredList = pendaftarList.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nisn.includes(searchQuery);
        const matchesStatus = filterStatus === "all" || p.status === filterStatus;
        const matchesJalur = filterJalur === "all" || p.jalur === filterJalur;
        return matchesSearch && matchesStatus && matchesJalur;
    });

    const statusConfig = {
        pending: { label: "Menunggu", variant: "warning" as const },
        verified: { label: "Terverifikasi", variant: "info" as const },
        rejected: { label: "Ditolak", variant: "destructive" as const },
        accepted: { label: "Diterima", variant: "success" as const },
        enrolled: { label: "Daftar Ulang", variant: "success" as const },
    };

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <TableSkeleton rows={5} columns={7} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Pendaftar</h1>
                        <p className="text-gray-500 mt-1">
                            Kelola data semua pendaftar
                        </p>
                    </div>
                    <Button leftIcon={<Download className="h-4 w-4" />}>
                        Export Data
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4"
                >
                    {[
                        { label: "Total", value: pendaftarList.length, color: "text-gray-900" },
                        { label: "Menunggu", value: pendaftarList.filter((p) => p.status === "pending").length, color: "text-amber-600" },
                        { label: "Terverifikasi", value: pendaftarList.filter((p) => p.status === "verified").length, color: "text-blue-600" },
                        { label: "Diterima", value: pendaftarList.filter((p) => p.status === "accepted").length, color: "text-green-600" },
                        { label: "Ditolak", value: pendaftarList.filter((p) => p.status === "rejected").length, color: "text-red-600" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
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
                                        placeholder="Cari nama atau NISN..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <Select
                                    placeholder="Status"
                                    options={[
                                        { value: "all", label: "Semua Status" },
                                        { value: "pending", label: "Menunggu" },
                                        { value: "verified", label: "Terverifikasi" },
                                        { value: "accepted", label: "Diterima" },
                                        { value: "rejected", label: "Ditolak" },
                                        { value: "enrolled", label: "Daftar Ulang" },
                                    ]}
                                    value={filterStatus}
                                    onChange={setFilterStatus}
                                    className="w-full md:w-48"
                                />
                                <Select
                                    placeholder="Jalur"
                                    options={[
                                        { value: "all", label: "Semua Jalur" },
                                        { value: "Zonasi", label: "Zonasi" },
                                        { value: "Prestasi", label: "Prestasi" },
                                        { value: "Afirmasi", label: "Afirmasi" },
                                        { value: "Perpindahan", label: "Perpindahan" },
                                    ]}
                                    value={filterJalur}
                                    onChange={setFilterJalur}
                                    className="w-full md:w-48"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card variant="elevated">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Pendaftar</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">NISN</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jenjang</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jalur</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jarak</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Status</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredList.map((pendaftar) => (
                                            <tr key={pendaftar.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900">{pendaftar.name}</span>
                                                            <p className="text-xs text-gray-400">{pendaftar.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{pendaftar.nisn}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={pendaftar.jenjang === "SD" ? "info" : "success"} size="sm">
                                                        {pendaftar.jenjang}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" size="sm">{pendaftar.jalur}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{pendaftar.distance} km</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={statusConfig[pendaftar.status].variant} size="sm" dot>
                                                        {statusConfig[pendaftar.status].label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedPendaftar(pendaftar);
                                                            setIsDetailOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Menampilkan {filteredList.length} dari {pendaftarList.length} pendaftar
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm">1</span>
                                    <Button variant="outline" size="sm">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Detail Modal */}
            <DetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                pendaftar={selectedPendaftar}
            />
        </DashboardLayout>
    );
}
