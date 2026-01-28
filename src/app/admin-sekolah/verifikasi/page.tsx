"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    FileText,
    ChevronLeft,
    ChevronRight,
    Download,
    User,
    MapPin,
    Phone,
    Calendar,
    Image,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Modal, Input, Select } from "@/components/ui";
import { TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface Registrant {
    id: string;
    name: string;
    nisn: string;
    jalur: string;
    status: "pending" | "verified" | "rejected";
    submittedAt: string;
    phone: string;
    address: string;
    distance: number;
    documents: {
        id: string;
        name: string;
        status: "pending" | "verified" | "rejected";
        url?: string;
    }[];
}

// ============================================
// Verification Modal
// ============================================

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    registrant: Registrant | null;
    onVerify: (id: string, status: "verified" | "rejected", note?: string) => void;
}

function VerificationModal({ isOpen, onClose, registrant, onVerify }: VerificationModalProps) {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [docStatuses, setDocStatuses] = useState<Record<string, "verified" | "rejected" | "pending">>({});

    if (!registrant) return null;

    const handleDocStatus = (docId: string, status: "verified" | "rejected") => {
        setDocStatuses((prev) => ({ ...prev, [docId]: status }));
    };

    const allDocsVerified = registrant.documents.every(
        (doc) => docStatuses[doc.id] === "verified"
    );

    const hasRejectedDocs = registrant.documents.some(
        (doc) => docStatuses[doc.id] === "rejected"
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Verifikasi Pendaftaran"
            size="xl"
        >
            <div className="space-y-6">
                {/* Registrant Info */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{registrant.name}</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <FileText className="h-4 w-4" />
                                NISN: {registrant.nisn}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <MapPin className="h-4 w-4" />
                                Jarak: {registrant.distance} km
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Phone className="h-4 w-4" />
                                {registrant.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {registrant.submittedAt}
                            </div>
                        </div>
                        <div className="mt-2">
                            <Badge variant="info" size="sm">Jalur {registrant.jalur}</Badge>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Verifikasi Berkas</h4>
                    <div className="space-y-3">
                        {registrant.documents.map((doc) => (
                            <div
                                key={doc.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                    docStatuses[doc.id] === "verified"
                                        ? "border-green-500 bg-green-50"
                                        : docStatuses[doc.id] === "rejected"
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Image className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{doc.name}</p>
                                        <button
                                            className="text-xs text-primary hover:underline"
                                            onClick={() => setSelectedDoc(doc.id)}
                                        >
                                            Lihat dokumen
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={docStatuses[doc.id] === "verified" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleDocStatus(doc.id, "verified")}
                                        className={docStatuses[doc.id] === "verified" ? "bg-green-500 hover:bg-green-600" : ""}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={docStatuses[doc.id] === "rejected" ? "destructive" : "outline"}
                                        size="sm"
                                        onClick={() => handleDocStatus(doc.id, "rejected")}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note */}
                {hasRejectedDocs && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan Penolakan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Berikan alasan penolakan berkas..."
                            className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    {hasRejectedDocs ? (
                        <Button
                            variant="destructive"
                            onClick={() => onVerify(registrant.id, "rejected", note)}
                            className="flex-1"
                            disabled={!note.trim()}
                        >
                            Tolak Pendaftaran
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onVerify(registrant.id, "verified")}
                            className="flex-1"
                            disabled={!allDocsVerified}
                        >
                            Terima & Verifikasi
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Verification Page
// ============================================

export default function VerifikasiPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterJalur, setFilterJalur] = useState("all");
    const [selectedRegistrant, setSelectedRegistrant] = useState<Registrant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const registrants: Registrant[] = [
        {
            id: "1",
            name: "Ahmad Pratama",
            nisn: "1234567890",
            jalur: "Zonasi",
            status: "pending",
            submittedAt: "28 Jan 2026, 10:23",
            phone: "08123456789",
            address: "Jl. Sukajadi No. 123",
            distance: 1.2,
            documents: [
                { id: "kk", name: "Kartu Keluarga", status: "pending" },
                { id: "akta", name: "Akta Kelahiran", status: "pending" },
                { id: "ijazah", name: "Ijazah SD", status: "pending" },
                { id: "foto", name: "Pas Foto 3x4", status: "pending" },
            ],
        },
        {
            id: "2",
            name: "Siti Nurhaliza",
            nisn: "0987654321",
            jalur: "Prestasi",
            status: "pending",
            submittedAt: "28 Jan 2026, 09:15",
            phone: "08198765432",
            address: "Jl. Dago No. 45",
            distance: 2.5,
            documents: [
                { id: "kk", name: "Kartu Keluarga", status: "pending" },
                { id: "akta", name: "Akta Kelahiran", status: "pending" },
                { id: "ijazah", name: "Ijazah SD", status: "pending" },
                { id: "foto", name: "Pas Foto 3x4", status: "pending" },
                { id: "prestasi", name: "Sertifikat Prestasi", status: "pending" },
            ],
        },
        {
            id: "3",
            name: "Budi Santoso",
            nisn: "1122334455",
            jalur: "Zonasi",
            status: "verified",
            submittedAt: "27 Jan 2026, 14:30",
            phone: "08156789012",
            address: "Jl. Pasteur No. 67",
            distance: 0.8,
            documents: [
                { id: "kk", name: "Kartu Keluarga", status: "verified" },
                { id: "akta", name: "Akta Kelahiran", status: "verified" },
                { id: "ijazah", name: "Ijazah SD", status: "verified" },
                { id: "foto", name: "Pas Foto 3x4", status: "verified" },
            ],
        },
        {
            id: "4",
            name: "Dewi Lestari",
            nisn: "5544332211",
            jalur: "Afirmasi",
            status: "rejected",
            submittedAt: "27 Jan 2026, 11:45",
            phone: "08134567890",
            address: "Jl. Dipatiukur No. 89",
            distance: 1.5,
            documents: [
                { id: "kk", name: "Kartu Keluarga", status: "verified" },
                { id: "akta", name: "Akta Kelahiran", status: "rejected" },
                { id: "ijazah", name: "Ijazah SD", status: "verified" },
                { id: "foto", name: "Pas Foto 3x4", status: "verified" },
            ],
        },
        {
            id: "5",
            name: "Eko Prasetyo",
            nisn: "6677889900",
            jalur: "Zonasi",
            status: "pending",
            submittedAt: "26 Jan 2026, 16:20",
            phone: "08167890123",
            address: "Jl. Ciumbuleuit No. 12",
            distance: 3.2,
            documents: [
                { id: "kk", name: "Kartu Keluarga", status: "pending" },
                { id: "akta", name: "Akta Kelahiran", status: "pending" },
                { id: "ijazah", name: "Ijazah SD", status: "pending" },
                { id: "foto", name: "Pas Foto 3x4", status: "pending" },
            ],
        },
    ];

    const filteredRegistrants = registrants.filter((r) => {
        const matchesSearch =
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.nisn.includes(searchQuery);
        const matchesStatus = filterStatus === "all" || r.status === filterStatus;
        const matchesJalur = filterJalur === "all" || r.jalur === filterJalur;
        return matchesSearch && matchesStatus && matchesJalur;
    });

    const handleVerify = (id: string, status: "verified" | "rejected", note?: string) => {
        console.log("Verify:", id, status, note);
        setIsModalOpen(false);
        setSelectedRegistrant(null);
    };

    const openVerificationModal = (registrant: Registrant) => {
        setSelectedRegistrant(registrant);
        setIsModalOpen(true);
    };

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <TableSkeleton rows={5} columns={6} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Berkas</h1>
                        <p className="text-gray-500 mt-1">
                            Verifikasi berkas pendaftaran siswa
                        </p>
                    </div>
                    <Button leftIcon={<Download className="h-4 w-4" />}>
                        Export Data
                    </Button>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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
                                        { value: "rejected", label: "Ditolak" },
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

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: "Total", value: registrants.length, color: "text-gray-900" },
                        { label: "Menunggu", value: registrants.filter((r) => r.status === "pending").length, color: "text-amber-600" },
                        { label: "Terverifikasi", value: registrants.filter((r) => r.status === "verified").length, color: "text-green-600" },
                        { label: "Ditolak", value: registrants.filter((r) => r.status === "rejected").length, color: "text-red-600" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                        </div>
                    ))}
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
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jalur</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Jarak</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Status</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Tanggal</th>
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistrants.map((registrant) => (
                                            <tr key={registrant.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{registrant.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{registrant.nisn}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" size="sm">{registrant.jalur}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{registrant.distance} km</td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={
                                                            registrant.status === "verified"
                                                                ? "verified"
                                                                : registrant.status === "rejected"
                                                                    ? "rejected"
                                                                    : "pending"
                                                        }
                                                        size="sm"
                                                        dot
                                                    >
                                                        {registrant.status === "verified"
                                                            ? "Terverifikasi"
                                                            : registrant.status === "rejected"
                                                                ? "Ditolak"
                                                                : "Menunggu"}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-sm">{registrant.submittedAt}</td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openVerificationModal(registrant)}
                                                        leftIcon={<Eye className="h-4 w-4" />}
                                                    >
                                                        {registrant.status === "pending" ? "Verifikasi" : "Detail"}
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
                                    Menampilkan {filteredRegistrants.length} dari {registrants.length} pendaftar
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

            {/* Verification Modal */}
            <VerificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                registrant={selectedRegistrant}
                onVerify={handleVerify}
            />
        </DashboardLayout>
    );
}
