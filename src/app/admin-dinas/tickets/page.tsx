"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Ticket,
    Search,
    MessageCircle,
    Clock,
    CheckCircle,
    AlertCircle,
    Filter,
    Send,
    User,
    School,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Modal, Select } from "@/components/ui";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface TicketData {
    id: string;
    nomor: string;
    pengirim: string;
    sekolah: string;
    subjek: string;
    pesan: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    prioritas: "low" | "medium" | "high";
    createdAt: string;
}

// ============================================
// Ticket Detail Modal
// ============================================

function TicketDetailModal({
    isOpen,
    onClose,
    ticket,
}: {
    isOpen: boolean;
    onClose: () => void;
    ticket: TicketData | null;
}) {
    const [reply, setReply] = useState("");

    if (!ticket) return null;

    const statusColors = {
        open: "bg-blue-100 text-blue-600",
        in_progress: "bg-amber-100 text-amber-600",
        resolved: "bg-green-100 text-green-600",
        closed: "bg-gray-100 text-gray-600",
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Tiket #${ticket.nomor}`} size="lg">
            <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-500">Pengirim</p>
                        <p className="font-medium text-gray-900">{ticket.pengirim}</p>
                        <p className="text-xs text-gray-400">{ticket.sekolah}</p>
                    </div>
                    <div className="text-right">
                        <Badge className={statusColors[ticket.status]}>
                            {ticket.status === "open" ? "Terbuka" :
                                ticket.status === "in_progress" ? "Diproses" :
                                    ticket.status === "resolved" ? "Selesai" : "Ditutup"}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{ticket.createdAt}</p>
                    </div>
                </div>

                {/* Subject & Message */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{ticket.subjek}</h4>
                    <p className="text-sm text-gray-600 p-4 bg-gray-50 rounded-xl">{ticket.pesan}</p>
                </div>

                {/* Reply Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Balas Tiket</label>
                    <textarea
                        rows={3}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Tulis balasan..."
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Select
                        defaultValue={ticket.status}
                        options={[
                            { value: "open", label: "Terbuka" },
                            { value: "in_progress", label: "Diproses" },
                            { value: "resolved", label: "Selesai" },
                            { value: "closed", label: "Tutup" },
                        ]}
                    />
                    <Button className="flex-1" leftIcon={<Send className="h-4 w-4" />} disabled={!reply.trim()}>
                        Kirim Balasan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Main Page
// ============================================

export default function TicketsPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const tickets: TicketData[] = [
        {
            id: "1",
            nomor: "TKT-2026-001",
            pengirim: "Budi Santoso",
            sekolah: "SDN 1 Sukajadi",
            subjek: "Kendala Upload Berkas",
            pesan: "Saya mengalami kendala saat upload berkas KK. File terus gagal diupload meskipun sudah sesuai format yang diminta.",
            status: "open",
            prioritas: "high",
            createdAt: "2 jam lalu",
        },
        {
            id: "2",
            nomor: "TKT-2026-002",
            pengirim: "Siti Rahayu",
            sekolah: "SDN 2 Sukasari",
            subjek: "Pertanyaan Kuota Jalur Afirmasi",
            pesan: "Mohon informasi terkait kuota jalur afirmasi untuk tahun ajaran ini. Apakah ada perubahan dari tahun lalu?",
            status: "in_progress",
            prioritas: "medium",
            createdAt: "5 jam lalu",
        },
        {
            id: "3",
            nomor: "TKT-2026-003",
            pengirim: "Ahmad Hidayat",
            sekolah: "SMPN 1 Bandung",
            subjek: "Reset Password Admin",
            pesan: "Admin sekolah kami lupa password. Mohon bantuan untuk reset akun.",
            status: "resolved",
            prioritas: "medium",
            createdAt: "1 hari lalu",
        },
        {
            id: "4",
            nomor: "TKT-2026-004",
            pengirim: "Dewi Lestari",
            sekolah: "SMPN 2 Bandung",
            subjek: "Perubahan Data Sekolah",
            pesan: "Kami ingin mengajukan perubahan data alamat sekolah yang tercantum di sistem.",
            status: "closed",
            prioritas: "low",
            createdAt: "3 hari lalu",
        },
    ];

    const filteredTickets = tickets.filter((t) => {
        const matchSearch = t.subjek.toLowerCase().includes(search.toLowerCase()) || t.nomor.includes(search);
        const matchStatus = filterStatus === "all" || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const statusConfig = {
        open: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-100", label: "Terbuka" },
        in_progress: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100", label: "Diproses" },
        resolved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Selesai" },
        closed: { icon: MessageCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Ditutup" },
    };

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <TableSkeleton rows={5} columns={5} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-gray-900">Tiket Bantuan</h1>
                    <p className="text-gray-500 mt-1">Kelola tiket bantuan dari admin sekolah</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total", value: "45", status: "all", color: "bg-gray-500" },
                        { label: "Terbuka", value: "12", status: "open", color: "bg-blue-500" },
                        { label: "Diproses", value: "8", status: "in_progress", color: "bg-amber-500" },
                        { label: "Selesai", value: "25", status: "resolved", color: "bg-green-500" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setFilterStatus(stat.status)}
                            className={cn(
                                "bg-white rounded-xl p-4 border cursor-pointer transition-all",
                                filterStatus === stat.status ? "border-primary ring-2 ring-primary/20" : "border-gray-100 hover:border-gray-200"
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3", stat.color)}>
                                <Ticket className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari tiket..."
                                    leftIcon={<Search className="h-4 w-4" />}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                options={[
                                    { value: "all", label: "Semua" },
                                    { value: "open", label: "Terbuka" },
                                    { value: "in_progress", label: "Diproses" },
                                    { value: "resolved", label: "Selesai" },
                                    { value: "closed", label: "Ditutup" },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tickets List */}
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {filteredTickets.map((ticket, index) => {
                                const config = statusConfig[ticket.status];
                                const StatusIcon = config.icon;

                                return (
                                    <motion.div
                                        key={ticket.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => { setSelectedTicket(ticket); setIsDetailOpen(true); }}
                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn("p-2 rounded-lg", config.bg)}>
                                                <StatusIcon className={cn("h-5 w-5", config.color)} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-gray-400">{ticket.nomor}</span>
                                                    <Badge
                                                        variant={ticket.prioritas === "high" ? "destructive" : ticket.prioritas === "medium" ? "warning" : "secondary"}
                                                        size="sm"
                                                    >
                                                        {ticket.prioritas}
                                                    </Badge>
                                                </div>
                                                <h4 className="font-medium text-gray-900 truncate">{ticket.subjek}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {ticket.pengirim}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <School className="h-3 w-3" />
                                                        {ticket.sekolah}
                                                    </span>
                                                    <span>{ticket.createdAt}</span>
                                                </div>
                                            </div>
                                            <Badge className={cn(config.bg, config.color)} size="sm">
                                                {config.label}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <TicketDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                ticket={selectedTicket}
            />
        </DashboardLayout>
    );
}
