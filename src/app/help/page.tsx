"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    HelpCircle,
    Search,
    MessageCircle,
    Book,
    FileText,
    ChevronRight,
    Phone,
    Mail,
    Clock,
    ExternalLink,
    ChevronDown,
    GraduationCap,
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

// ============================================
// FAQ Accordion
// ============================================

interface FAQItem {
    question: string;
    answer: string;
}

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: "Bagaimana cara melakukan pendaftaran?",
            answer: "Pendaftaran dapat dilakukan secara online melalui website SPMB. Klik tombol 'Daftar Sekarang' pada halaman utama, lalu lengkapi formulir pendaftaran dengan data yang valid. Pastikan semua dokumen yang diperlukan sudah siap dalam format digital (JPG/PDF).",
        },
        {
            question: "Apa saja dokumen yang diperlukan untuk mendaftar?",
            answer: "Dokumen yang diperlukan antara lain: Kartu Keluarga, Akta Kelahiran, Ijazah atau Surat Keterangan Lulus, Pas Foto terbaru (3x4), dan dokumen pendukung sesuai jalur yang dipilih (sertifikat prestasi untuk jalur prestasi, SKTM untuk jalur afirmasi, dll).",
        },
        {
            question: "Bagaimana cara mengetahui status pendaftaran?",
            answer: "Status pendaftaran dapat dilihat di halaman 'Status Pendaftaran' setelah login. Anda juga akan menerima notifikasi melalui email dan WhatsApp setiap kali ada perubahan status pendaftaran.",
        },
        {
            question: "Berapa jarak maksimal untuk jalur zonasi?",
            answer: "Jarak maksimal untuk jalur zonasi berbeda-beda di setiap sekolah. Informasi lengkap dapat dilihat pada halaman detail sekolah. Jarak dihitung dari koordinat alamat rumah yang terdaftar di Kartu Keluarga ke sekolah tujuan.",
        },
        {
            question: "Apakah bisa mendaftar ke lebih dari satu sekolah?",
            answer: "Ya, pendaftar dapat memilih satu sekolah pilihan utama dan satu sekolah pilihan cadangan. Namun, hanya boleh memilih satu jalur pendaftaran.",
        },
        {
            question: "Bagaimana jika ada kesalahan data yang sudah disubmit?",
            answer: "Jika pendaftaran belum diverifikasi, Anda dapat mengedit data melalui halaman 'Formulir'. Jika sudah diverifikasi, silakan hubungi admin sekolah melalui fitur 'Tiket Bantuan'.",
        },
    ];

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Pertanyaan Umum (FAQ)
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 text-gray-400 transition-transform",
                                        openIndex === index && "rotate-180"
                                    )}
                                />
                            </button>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4"
                                >
                                    <p className="text-sm text-gray-600">{faq.answer}</p>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Quick Links
// ============================================

function QuickLinks() {
    const links = [
        { icon: Book, label: "Panduan Pendaftaran", href: "#", color: "bg-blue-100 text-blue-600" },
        { icon: FileText, label: "Syarat & Ketentuan", href: "#", color: "bg-green-100 text-green-600" },
        { icon: MessageCircle, label: "Hubungi Kami", href: "#contact", color: "bg-purple-100 text-purple-600" },
    ];

    return (
        <div className="grid sm:grid-cols-3 gap-4">
            {links.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
                >
                    <div className={cn("p-2 rounded-lg", link.color)}>
                        <link.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </a>
            ))}
        </div>
    );
}

// ============================================
// Contact Section
// ============================================

function ContactSection() {
    return (
        <Card variant="elevated" id="contact">
            <CardHeader>
                <CardTitle className="text-lg">Hubungi Kami</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Telepon</p>
                                <p className="font-medium text-gray-900">022-1234567</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Senin - Jumat, 08:00 - 16:00 WIB</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="font-medium text-gray-900">spmb@dinas.edu.id</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Respon dalam 1x24 jam kerja</p>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-primary mb-1">Jam Operasional</p>
                            <p className="text-sm text-gray-600">
                                Senin - Kamis: 08:00 - 16:00 WIB<br />
                                Jumat: 08:00 - 15:30 WIB
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// Main Help Page
// ============================================

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white">SPMB</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-white mb-2">Pusat Bantuan</h1>
                    <p className="text-white/80 mb-8">
                        Temukan jawaban untuk pertanyaan Anda tentang SPMB
                    </p>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari bantuan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <QuickLinks />
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <FAQSection />
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ContactSection />
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center pt-4"
                >
                    <Link href="/">
                        <Button variant="outline">
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
