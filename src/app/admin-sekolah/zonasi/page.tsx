"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, School, Info, Ruler, Target } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, Badge } from "@/components/ui";

// Dynamic import for Leaflet (SSR disabled)
const ZonasiMap = dynamic(() => import("@/components/map/ZonasiMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Memuat peta...</p>
            </div>
        </div>
    ),
});

// ============================================
// Main Page
// ============================================

export default function PetaZonasiPage() {
    const [radiusPrimer, setRadiusPrimer] = useState(3);
    const [radiusSekunder, setRadiusSekunder] = useState(5);

    const schoolData = {
        nama: "SDN 1 Sukajadi",
        npsn: "20200001",
        alamat: "Jl. Sukajadi No. 123, Kec. Sukajadi, Kota Bandung",
        koordinat: [-6.8881, 107.6024] as [number, number],
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                    <Link href="/admin-sekolah/kuota">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Peta Zonasi</h1>
                        <p className="text-gray-500 mt-1">Visualisasi area zonasi sekolah</p>
                    </div>
                </motion.div>

                {/* Map Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card variant="elevated">
                        <CardContent className="p-0 overflow-hidden">
                            <ZonasiMap
                                center={schoolData.koordinat}
                                schoolName={schoolData.nama}
                                radiusPrimer={radiusPrimer}
                                radiusSekunder={radiusSekunder}
                                className="h-[500px]"
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    {/* School Info */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <School className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Informasi Sekolah</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Nama Sekolah</p>
                                        <p className="font-medium text-gray-900">{schoolData.nama}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">NPSN</p>
                                        <p className="font-medium text-gray-900">{schoolData.npsn}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Alamat</p>
                                        <p className="font-medium text-gray-900">{schoolData.alamat}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Primary Zone */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Target className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Zona Primer</h3>
                                        <Badge variant="info" size="sm">Prioritas 1</Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Radius</span>
                                        <span className="text-2xl font-bold text-blue-600">{radiusPrimer} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="0.5"
                                        value={radiusPrimer}
                                        onChange={(e) => setRadiusPrimer(Number(e.target.value))}
                                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Calon siswa dalam zona ini mendapat prioritas tertinggi
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Secondary Zone */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Ruler className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Zona Sekunder</h3>
                                        <Badge variant="warning" size="sm">Prioritas 2</Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Radius</span>
                                        <span className="text-2xl font-bold text-amber-600">{radiusSekunder} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="3"
                                        max="10"
                                        step="0.5"
                                        value={radiusSekunder}
                                        onChange={(e) => setRadiusSekunder(Number(e.target.value))}
                                        className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Calon siswa dalam zona ini mendapat prioritas kedua
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Legend */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="h-5 w-5 text-gray-400" />
                                <h3 className="font-semibold text-gray-900">Keterangan Peta</h3>
                            </div>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                                    <span className="text-sm text-gray-600">Zona Primer (Prioritas Tinggi)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-dashed border-amber-600" />
                                    <span className="text-sm text-gray-600">Zona Sekunder (Prioritas Sedang)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-gray-600">Lokasi Sekolah</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
