"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Save,
    Upload,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Globe,
    Image,
    Clock,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";
import { api } from "@/lib/api";
import { useToastStore } from "@/lib/toast-store";
import { Sekolah, Dinas, Jalur, TahunAjaran } from "@/data/types";

// ============================================
// Settings Page
// ============================================

export default function SettingsPage() {
    const { initialize, isInitialized, isLoading, dinas, tahunAjaran } = useDataStore();
    const { success, error } = useToastStore();
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState<string | null>(null);

    // Form States
    const [dinasForm, setDinasForm] = useState<any>(null);
    const [scheduleForm, setScheduleForm] = useState<any>(null);
    const [notificationForm, setNotificationForm] = useState<any>({
        email_confirmation: true,
        file_verification: true,
        selection_result: true,
        re_registration_reminder: true,
        whatsapp_notif: false,
    });

    const activeDinas = dinas && dinas.length > 0 ? dinas[0] : null;

    useEffect(() => {
        if (activeDinas) {
            setDinasForm({
                name: activeDinas.name,
                kabupaten: activeDinas.kabupaten,
                provinsi: activeDinas.provinsi,
                alamat: activeDinas.alamat,
                telepon: activeDinas.telepon,
                email: activeDinas.email,
                website: activeDinas.website,
            });
            if (activeDinas.notification_settings) {
                setNotificationForm(activeDinas.notification_settings);
            }
        }
    }, [activeDinas]);

    useEffect(() => {
        if (tahunAjaran) {
            setScheduleForm({
                tanggal_mulai_pendaftaran: tahunAjaran.tanggal_mulai_pendaftaran?.split("T")[0],
                tanggal_akhir_pendaftaran: tahunAjaran.tanggal_akhir_pendaftaran?.split("T")[0],
                tanggal_seleksi: tahunAjaran.tanggal_seleksi?.split("T")[0],
                tanggal_pengumuman: tahunAjaran.tanggal_pengumuman?.split("T")[0],
                tanggal_daftar_ulang: tahunAjaran.tanggal_daftar_ulang?.split("T")[0],
                tanggal_akhir_daftar_ulang: tahunAjaran.tanggal_akhir_daftar_ulang?.split("T")[0],
            });
        }
    }, [tahunAjaran]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'signature') => {
        const file = event.target.files?.[0];
        if (!file || !activeDinas) return;

        setIsUploading(type);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await api.post<{ url: string }>("/upload/", formData);

            // Update the dinas record with the new URL
            const payload = type === 'logo'
                ? { logo_dinas: result.url }
                : { signature_url: result.url }; // Assuming signature_url exists or using a generic one

            await api.put(`/dinas/${activeDinas.id}`, payload);
            success(`${type === 'logo' ? 'Logo' : 'Tanda Tangan'} berhasil diunggah!`);
            await initialize();
        } catch (err: any) {
            error(`Gagal mengunggah ${type}: ${err.message}`);
        } finally {
            setIsUploading(null);
        }
    };

    const tabs = [
        { id: "general", label: "Umum" },
        { id: "jadwal", label: "Jadwal SPMB" },
        { id: "notifikasi", label: "Notifikasi" },
    ];

    if (!isInitialized || isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <CardSkeleton lines={8} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
                    <p className="text-gray-500 mt-1">Konfigurasi sistem SPMB</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
                                ? "bg-primary text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* General Settings */}
                {activeTab === "general" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    Informasi Dinas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nama Dinas"
                                        value={dinasForm?.name || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, name: e.target.value })}
                                    />
                                    <Input
                                        label="Kabupaten/Kota"
                                        value={dinasForm?.kabupaten || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, kabupaten: e.target.value })}
                                    />
                                    <Input
                                        label="Provinsi"
                                        value={dinasForm?.provinsi || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, provinsi: e.target.value })}
                                    />
                                    <Input
                                        label="Alamat"
                                        value={dinasForm?.alamat || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, alamat: e.target.value })}
                                    />
                                    <Input
                                        label="Telepon"
                                        leftIcon={<Phone className="h-4 w-4" />}
                                        value={dinasForm?.telepon || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, telepon: e.target.value })}
                                    />
                                    <Input
                                        label="Email"
                                        leftIcon={<Mail className="h-4 w-4" />}
                                        value={dinasForm?.email || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, email: e.target.value })}
                                    />
                                    <Input
                                        label="Website"
                                        leftIcon={<Globe className="h-4 w-4" />}
                                        value={dinasForm?.website || ""}
                                        onChange={(e) => setDinasForm({ ...dinasForm, website: e.target.value })}
                                    />
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Logo & Tanda Tangan</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center relative">
                                            {activeDinas?.logo_dinas ? (
                                                <img
                                                    src={activeDinas.logo_dinas.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${activeDinas.logo_dinas}` : activeDinas.logo_dinas}
                                                    alt="Logo"
                                                    className="h-16 mx-auto mb-2 object-contain"
                                                />
                                            ) : (
                                                <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            )}
                                            <p className="text-sm text-gray-500">Logo Dinas</p>
                                            <label className="mt-2 inline-block">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, 'logo')}
                                                    disabled={isUploading === 'logo'}
                                                />
                                                <Button variant="outline" size="sm" className="text-xs pointer-events-none" isLoading={isUploading === 'logo'}>
                                                    <Upload className="h-3 w-3 mr-2" /> {activeDinas?.logo_dinas ? 'Ganti Logo' : 'Upload Logo'}
                                                </Button>
                                            </label>
                                        </div>
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                            {activeDinas?.signature_url ? (
                                                <img
                                                    src={activeDinas.signature_url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${activeDinas.signature_url}` : activeDinas.signature_url}
                                                    alt="Tanda Tangan"
                                                    className="h-16 mx-auto mb-2 object-contain"
                                                />
                                            ) : (
                                                <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            )}
                                            <p className="text-sm text-gray-500">Tanda Tangan Digital</p>
                                            <label className="mt-2 inline-block">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, 'signature')}
                                                    disabled={isUploading === 'signature'}
                                                />
                                                <Button variant="outline" size="sm" className="text-xs pointer-events-none" isLoading={isUploading === 'signature'}>
                                                    <Upload className="h-3 w-3 mr-2" /> {activeDinas?.signature_url ? 'Ganti TTD' : 'Upload Baru'}
                                                </Button>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        leftIcon={<Save className="h-4 w-4" />}
                                        onClick={async () => {
                                            if (!activeDinas) return;
                                            setIsSaving(true);
                                            try {
                                                await api.put(`/dinas/${activeDinas.id}`, dinasForm);
                                                success("Informasi Dinas berhasil diperbarui!");
                                                await initialize();
                                            } catch (err: any) {
                                                error(`Gagal memperbarui informasi dinas: ${err.message}`);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }}
                                        isLoading={isSaving}
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Jadwal SPMB */}
                {activeTab === "jadwal" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Jadwal SPMB 2026/2027
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Mulai Pendaftaran"
                                        value={scheduleForm?.tanggal_mulai_pendaftaran || ""}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tanggal_mulai_pendaftaran: e.target.value })}
                                    />
                                    <Input
                                        type="date"
                                        label="Akhir Pendaftaran"
                                        value={scheduleForm?.tanggal_akhir_pendaftaran || ""}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tanggal_akhir_pendaftaran: e.target.value })}
                                    />
                                    <Input
                                        type="date"
                                        label="Tanggal Seleksi"
                                        value={scheduleForm?.tanggal_seleksi || ""}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tanggal_seleksi: e.target.value })}
                                    />
                                    <Input
                                        type="date"
                                        label="Tanggal Pengumuman"
                                        value={scheduleForm?.tanggal_pengumuman || ""}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tanggal_pengumuman: e.target.value })}
                                    />
                                    <Input
                                        type="date"
                                        label="Mulai Daftar Ulang"
                                        value={scheduleForm?.tanggal_daftar_ulang || ""}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tanggal_daftar_ulang: e.target.value })}
                                    />
                                    <Input
                                        type="date"
                                        label="Akhir Daftar Ulang"
                                        value={scheduleForm?.tanggal_akhir_daftar_ulang || ""}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tanggal_akhir_daftar_ulang: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button
                                        leftIcon={<Save className="h-4 w-4" />}
                                        onClick={async () => {
                                            if (!tahunAjaran) return;
                                            setIsSaving(true);
                                            try {
                                                await api.put(`/config/tahun-ajaran/${tahunAjaran.id}`, scheduleForm);
                                                success("Jadwal SPMB berhasil diperbarui!");
                                                await initialize();
                                            } catch (err: any) {
                                                error(`Gagal memperbarui jadwal: ${err.message}`);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }}
                                        isLoading={isSaving}
                                    >
                                        Simpan Jadwal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Notifikasi */}
                {activeTab === "notifikasi" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    Pengaturan Notifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { key: "email_confirmation", label: "Email konfirmasi pendaftaran" },
                                    { key: "file_verification", label: "Notifikasi verifikasi berkas" },
                                    { key: "selection_result", label: "Pengumuman hasil seleksi" },
                                    { key: "re_registration_reminder", label: "Reminder daftar ulang" },
                                    { key: "whatsapp_notif", label: "WhatsApp notifikasi" },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-900">{item.label}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notificationForm[item.key]}
                                                onChange={(e) => setNotificationForm({ ...notificationForm, [item.key]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        leftIcon={<Save className="h-4 w-4" />}
                                        onClick={async () => {
                                            if (!activeDinas) return;
                                            setIsSaving(true);
                                            try {
                                                await api.put(`/dinas/${activeDinas.id}`, {
                                                    notification_settings: notificationForm
                                                });
                                                success("Pengaturan notifikasi berhasil diperbarui!");
                                                await initialize();
                                            } catch (err: any) {
                                                error(`Gagal memperbarui pengaturan notifikasi: ${err.message}`);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }}
                                        isLoading={isSaving}
                                    >
                                        Simpan Pengaturan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
