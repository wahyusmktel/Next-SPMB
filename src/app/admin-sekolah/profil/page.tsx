"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    School,
    Save,
    Upload,
    Mail,
    Phone,
    MapPin,
    Globe,
    Image,
    User,
    Award,
    Calendar,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui";
import { CardSkeleton } from "@/components/skeletons";
import { useDataStore } from "@/lib/store";

// ============================================
// Main Page
// ============================================

export default function ProfilSekolahPage() {
    const { initialize, isInitialized, isLoading } = useDataStore();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const schoolData = {
        nama: "SDN 1 Sukajadi",
        npsn: "20200001",
        jenjang: "SD",
        status: "Negeri",
        akreditasi: "A",
        alamat: "Jl. Sukajadi No. 123",
        kelurahan: "Sukajadi",
        kecamatan: "Sukajadi",
        kota: "Kota Bandung",
        provinsi: "Jawa Barat",
        kodePos: "40162",
        telepon: "022-1234567",
        email: "sdn1sukajadi@edu.id",
        website: "https://sdn1sukajadi.sch.id",
        kepalaSekolah: "Drs. Ahmad Subarjo, M.Pd.",
        nipKepala: "196505121990031003",
        ketuaSpmb: "Hj. Siti Aminah, S.Pd.",
        koordinat: { lat: -6.8881, lng: 107.6024 },
    };

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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profil Sekolah</h1>
                        <p className="text-gray-500 mt-1">Kelola informasi sekolah</p>
                    </div>
                    <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Batal" : "Edit Profil"}
                    </Button>
                </motion.div>

                {/* School Header Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card variant="elevated">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                        <School className="h-16 w-16 text-primary" />
                                    </div>
                                    {isEditing && (
                                        <Button variant="outline" size="sm" className="w-full mt-3">
                                            <Upload className="h-4 w-4 mr-2" /> Ganti Logo
                                        </Button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{schoolData.nama}</h2>
                                            <p className="text-gray-500">NPSN: {schoolData.npsn}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="info">{schoolData.jenjang}</Badge>
                                            <Badge variant="success">{schoolData.status}</Badge>
                                            <Badge variant="warning">
                                                <Award className="h-3 w-3 mr-1" />
                                                Akreditasi {schoolData.akreditasi}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Alamat</p>
                                                <p className="text-sm font-medium">{schoolData.alamat}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Telepon</p>
                                                <p className="text-sm font-medium">{schoolData.telepon}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Email</p>
                                                <p className="text-sm font-medium">{schoolData.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Globe className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Website</p>
                                                <p className="text-sm font-medium">{schoolData.website}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detail Information */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Address Info */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Informasi Alamat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <Input label="Alamat Lengkap" defaultValue={schoolData.alamat} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Kelurahan" defaultValue={schoolData.kelurahan} />
                                            <Input label="Kecamatan" defaultValue={schoolData.kecamatan} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Kota" defaultValue={schoolData.kota} />
                                            <Input label="Kode Pos" defaultValue={schoolData.kodePos} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        {[
                                            { label: "Alamat", value: schoolData.alamat },
                                            { label: "Kelurahan", value: schoolData.kelurahan },
                                            { label: "Kecamatan", value: schoolData.kecamatan },
                                            { label: "Kota", value: schoolData.kota },
                                            { label: "Provinsi", value: schoolData.provinsi },
                                            { label: "Kode Pos", value: schoolData.kodePos },
                                        ].map((item) => (
                                            <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                                <span className="text-gray-500">{item.label}</span>
                                                <span className="font-medium text-gray-900">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* School Officials */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Pejabat Sekolah
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <Input label="Nama Kepala Sekolah" defaultValue={schoolData.kepalaSekolah} />
                                        <Input label="NIP Kepala Sekolah" defaultValue={schoolData.nipKepala} />
                                        <Input label="Ketua Panitia SPMB" defaultValue={schoolData.ketuaSpmb} />
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-400 mb-1">Kepala Sekolah</p>
                                            <p className="font-medium text-gray-900">{schoolData.kepalaSekolah}</p>
                                            <p className="text-sm text-gray-500">NIP: {schoolData.nipKepala}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-400 mb-1">Ketua Panitia SPMB</p>
                                            <p className="font-medium text-gray-900">{schoolData.ketuaSpmb}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Digital Signature */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="text-lg">Tanda Tangan Digital</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                    <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 mb-2">TTD Kepala Sekolah</p>
                                    <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" /> Upload
                                    </Button>
                                </div>
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                    <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 mb-2">Stempel Sekolah</p>
                                    <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" /> Upload
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Save Button */}
                {isEditing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                        <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => setIsEditing(false)}>
                            Simpan Perubahan
                        </Button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
