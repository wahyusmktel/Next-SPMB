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
    Send,
    User,
    Phone,
    Mail,
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
    email: string;
    phone: string;
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Tiket #${ticket.nomor}`} size="lg">
            <div className="space-y-4">
                {/* Sender Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {ticket.pengirim.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">{ticket.pengirim}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{ticket.email}</span>
                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{ticket.phone}</span>
                            </div>
                        </div>
                        <Badge
                            variant={ticket.prioritas === "high" ? "destructive" : ticket.prioritas === "medium" ? "warning" : "secondary"}
                        >
                            {ticket.prioritas}
                        </Badge>
                    </div>
                </div>

                {/* Message */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{ticket.subjek}</h4>
                    <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                        {ticket.pesan}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{ticket.createdAt}</p>
                </div>

                {/* Reply */}
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

export default function TiketPage() {
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
            nomor: "TKT-001",
            pengirim: "Ibu Siti Aminah",
            email: "siti.aminah@gmail.com",
            phone: "081234567890",
            subjek: "Kendala Upload Berkas Akta",
            pesan: "Selamat pagi, saya mengalami kendala saat upload berkas akta kelahiran. File terus gagal diupload. Mohon bantuannya.",
            status: "open",
            prioritas: "high",
            createdAt: "Hari ini, 09:30",
        },
        {
            id: "2",
            nomor: "TKT-002",
            pengirim: "Bapak Ahmad Hidayat",
            email: "ahmad.h@gmail.com",
            phone: "081234567891",
            subjek: "Pertanyaan Radius Zonasi",
            pesan: "Mohon informasi apakah alamat di Jl. Sukamaju masuk dalam radius zonasi sekolah ini?",
            status: "in_progress",
            prioritas: "medium",
            createdAt: "Kemarin, 14:20",
        },
        {
            id: "3",
            nomor: "TKT-003",
            pengirim: "Ibu Dewi Lestari",
            email: "dewi.l@gmail.com",
            phone: "081234567892",
            subjek: "Koreksi Data Pendaftaran",
            pesan: "Saya ingin mengajukan koreksi tanggal lahir anak yang salah input saat pendaftaran.",
            status: "resolved",
            prioritas: "medium",
            createdAt: "2 hari lalu",
        },
        {
            id: "4",
            nomor: "TKT-004",
            pengirim: "Bapak Eko Prasetyo",
            email: "eko.p@gmail.com",
            phone: "081234567893",
            subjek: "Informasi Jadwal Daftar Ulang",
            pesan: "Kapan jadwal daftar ulang untuk siswa yang sudah diterima?",
            status: "closed",
            prioritas: "low",
            createdAt: "3 hari lalu",
        },
    ];

    const filteredTickets = tickets.filter((t) => {
        const matchSearch = t.subjek.toLowerCase().includes(search.toLowerCase()) || t.pengirim.toLowerCase().includes(search);
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
                    <p className="text-gray-500 mt-1">Kelola pertanyaan dan keluhan pendaftar</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total", value: "28", status: "all", color: "bg-gray-500" },
                        { label: "Terbuka", value: "8", status: "open", color: "bg-blue-500" },
                        { label: "Diproses", value: "5", status: "in_progress", color: "bg-amber-500" },
                        { label: "Selesai", value: "15", status: "resolved", color: "bg-green-500" },
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
