"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Send,
    Paperclip,
    User,
    X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Modal, Input, Select } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: "low" | "medium" | "high";
    createdAt: string;
    updatedAt: string;
    messages: {
        id: string;
        sender: "user" | "admin";
        message: string;
        timestamp: string;
    }[];
}

// ============================================
// New Ticket Modal
// ============================================

interface NewTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { subject: string; category: string; message: string }) => void;
}

function NewTicketModal({ isOpen, onClose, onSubmit }: NewTicketModalProps) {
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (subject && category && message) {
            onSubmit({ subject, category, message });
            setSubject("");
            setCategory("");
            setMessage("");
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Buat Tiket Baru" size="lg">
            <div className="space-y-4">
                <Input
                    label="Subjek"
                    placeholder="Ringkasan masalah Anda"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />

                <Select
                    label="Kategori"
                    placeholder="Pilih kategori"
                    options={[
                        { value: "pendaftaran", label: "Masalah Pendaftaran" },
                        { value: "berkas", label: "Upload Berkas" },
                        { value: "teknis", label: "Masalah Teknis" },
                        { value: "informasi", label: "Pertanyaan Informasi" },
                        { value: "lainnya", label: "Lainnya" },
                    ]}
                    value={category}
                    onChange={setCategory}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Jelaskan masalah Anda secara detail..."
                        className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={!subject || !category || !message}
                    >
                        Kirim Tiket
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================
// Ticket Detail Modal
// ============================================

interface TicketDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket | null;
    onSendMessage: (ticketId: string, message: string) => void;
}

function TicketDetailModal({ isOpen, onClose, ticket, onSendMessage }: TicketDetailModalProps) {
    const [newMessage, setNewMessage] = useState("");

    if (!ticket) return null;

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(ticket.id, newMessage);
            setNewMessage("");
        }
    };

    const statusConfig = {
        open: { label: "Terbuka", variant: "info" as const },
        in_progress: { label: "Diproses", variant: "warning" as const },
        resolved: { label: "Selesai", variant: "success" as const },
        closed: { label: "Ditutup", variant: "secondary" as const },
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
            <div className="flex flex-col h-[600px]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{ticket.subject}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant={statusConfig[ticket.status].variant} size="sm" dot>
                                {statusConfig[ticket.status].label}
                            </Badge>
                            <span className="text-xs text-gray-400">#{ticket.id}</span>
                            <span className="text-xs text-gray-400">{ticket.createdAt}</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {ticket.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-3",
                                msg.sender === "user" ? "flex-row-reverse" : ""
                            )}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    msg.sender === "user" ? "bg-primary/10" : "bg-green-100"
                                )}
                            >
                                <User
                                    className={cn(
                                        "h-4 w-4",
                                        msg.sender === "user" ? "text-primary" : "text-green-600"
                                    )}
                                />
                            </div>
                            <div
                                className={cn(
                                    "max-w-[70%] p-3 rounded-xl",
                                    msg.sender === "user"
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                                )}
                            >
                                <p className="text-sm">{msg.message}</p>
                                <p
                                    className={cn(
                                        "text-xs mt-1",
                                        msg.sender === "user" ? "text-white/70" : "text-gray-400"
                                    )}
                                >
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                {ticket.status !== "closed" && (
                    <div className="pt-4 border-t">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Ketik pesan..."
                                    className="w-full h-11 pl-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <Paperclip className="h-5 w-5" />
                                </button>
                            </div>
                            <Button onClick={handleSend} disabled={!newMessage.trim()}>
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

// ============================================
// Ticket Card
// ============================================

interface TicketCardProps {
    ticket: Ticket;
    onClick: () => void;
}

function TicketCard({ ticket, onClick }: TicketCardProps) {
    const statusConfig = {
        open: { label: "Terbuka", color: "bg-blue-100 text-blue-600", icon: AlertCircle },
        in_progress: { label: "Diproses", color: "bg-amber-100 text-amber-600", icon: Clock },
        resolved: { label: "Selesai", color: "bg-green-100 text-green-600", icon: CheckCircle2 },
        closed: { label: "Ditutup", color: "bg-gray-100 text-gray-500", icon: X },
    };

    const priorityConfig = {
        low: { label: "Rendah", color: "text-gray-400" },
        medium: { label: "Sedang", color: "text-amber-500" },
        high: { label: "Tinggi", color: "text-red-500" },
    };

    const config = statusConfig[ticket.status];
    const StatusIcon = config.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className="p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all"
        >
            <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg", config.color)}>
                    <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{ticket.subject}</h4>
                        <span className="text-xs text-gray-400 flex-shrink-0">#{ticket.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" size="sm">{ticket.category}</Badge>
                        <span className={cn("text-xs font-medium", priorityConfig[ticket.priority].color)}>
                            • {priorityConfig[ticket.priority].label}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                            {ticket.messages.length} pesan
                        </span>
                        <span className="text-xs text-gray-400">{ticket.updatedAt}</span>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
            </div>
        </motion.div>
    );
}

// ============================================
// Main Tickets Page
// ============================================

export default function TiketPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const { user } = useAuthStore();
    const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Dummy data
    const tickets: Ticket[] = [
        {
            id: "TKT-001",
            subject: "Tidak bisa upload berkas KK",
            category: "Upload Berkas",
            status: "in_progress",
            priority: "high",
            createdAt: "28 Jan 2026",
            updatedAt: "28 Jan 2026, 14:30",
            messages: [
                {
                    id: "1",
                    sender: "user",
                    message: "Saya sudah mencoba upload berkas KK berkali-kali tapi selalu gagal. File saya berformat PDF dengan ukuran 1.5MB.",
                    timestamp: "28 Jan 2026, 10:23",
                },
                {
                    id: "2",
                    sender: "admin",
                    message: "Terima kasih sudah menghubungi kami. Mohon coba konversi file PDF Anda ke format JPG dan pastikan ukuran tidak melebihi 2MB.",
                    timestamp: "28 Jan 2026, 11:45",
                },
                {
                    id: "3",
                    sender: "user",
                    message: "Baik, saya akan coba. Terima kasih atas bantuannya.",
                    timestamp: "28 Jan 2026, 14:30",
                },
            ],
        },
        {
            id: "TKT-002",
            subject: "Pertanyaan tentang jalur zonasi",
            category: "Pertanyaan Informasi",
            status: "resolved",
            priority: "medium",
            createdAt: "27 Jan 2026",
            updatedAt: "27 Jan 2026, 16:00",
            messages: [
                {
                    id: "1",
                    sender: "user",
                    message: "Bagaimana cara menghitung jarak untuk jalur zonasi? Apakah menggunakan jarak udara atau jarak tempuh?",
                    timestamp: "27 Jan 2026, 09:15",
                },
                {
                    id: "2",
                    sender: "admin",
                    message: "Perhitungan jarak menggunakan jarak udara (straight line distance) dari koordinat rumah ke sekolah yang dituju. Koordinat akan diambil dari alamat yang Anda masukkan saat pendaftaran.",
                    timestamp: "27 Jan 2026, 10:30",
                },
                {
                    id: "3",
                    sender: "user",
                    message: "Terima kasih atas penjelasannya!",
                    timestamp: "27 Jan 2026, 16:00",
                },
            ],
        },
        {
            id: "TKT-003",
            subject: "Website tidak bisa diakses",
            category: "Masalah Teknis",
            status: "open",
            priority: "high",
            createdAt: "28 Jan 2026",
            updatedAt: "28 Jan 2026, 08:00",
            messages: [
                {
                    id: "1",
                    sender: "user",
                    message: "Sejak pagi ini website tidak bisa diakses. Muncul error 503.",
                    timestamp: "28 Jan 2026, 08:00",
                },
            ],
        },
    ];

    const filteredTickets = tickets.filter(
        (t) => filterStatus === "all" || t.status === filterStatus
    );

    const handleCreateTicket = (data: { subject: string; category: string; message: string }) => {
        console.log("Create ticket:", data);
    };

    const handleSendMessage = (ticketId: string, message: string) => {
        console.log("Send message:", ticketId, message);
    };

    const openTicketDetail = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsDetailOpen(true);
    };

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <CardSkeleton key={i} lines={3} />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        in_progress: tickets.filter((t) => t.status === "in_progress").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
    };

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
                        <h1 className="text-2xl font-bold text-gray-900">Pusat Bantuan</h1>
                        <p className="text-gray-500 mt-1">
                            Ajukan pertanyaan atau laporkan masalah
                        </p>
                    </div>
                    <Button
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => setIsNewTicketOpen(true)}
                    >
                        Buat Tiket Baru
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
                        { label: "Total Tiket", value: stats.total, color: "text-gray-900" },
                        { label: "Terbuka", value: stats.open, color: "text-blue-600" },
                        { label: "Diproses", value: stats.in_progress, color: "text-amber-600" },
                        { label: "Selesai", value: stats.resolved, color: "text-green-600" },
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
                    className="flex flex-wrap gap-2"
                >
                    {[
                        { value: "all", label: "Semua" },
                        { value: "open", label: "Terbuka" },
                        { value: "in_progress", label: "Diproses" },
                        { value: "resolved", label: "Selesai" },
                        { value: "closed", label: "Ditutup" },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterStatus(filter.value)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                filterStatus === filter.value
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </motion.div>

                {/* Tickets List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    {filteredTickets.length === 0 ? (
                        <Card variant="elevated">
                            <CardContent className="py-12 text-center">
                                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="font-medium text-gray-900 mb-1">Belum ada tiket</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Anda belum memiliki tiket bantuan
                                </p>
                                <Button onClick={() => setIsNewTicketOpen(true)}>
                                    Buat Tiket Baru
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={() => openTicketDetail(ticket)}
                            />
                        ))
                    )}
                </motion.div>
            </div>

            {/* New Ticket Modal */}
            <NewTicketModal
                isOpen={isNewTicketOpen}
                onClose={() => setIsNewTicketOpen(false)}
                onSubmit={handleCreateTicket}
            />

            {/* Ticket Detail Modal */}
            <TicketDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                ticket={selectedTicket}
                onSendMessage={handleSendMessage}
            />
        </DashboardLayout>
    );
}
