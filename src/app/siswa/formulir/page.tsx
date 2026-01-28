"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Users,
    MapPin,
    FileText,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    Upload,
    Trash2,
    AlertCircle,
    Info,
    X,
    Map,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Badge } from "@/components/ui";
import { useDataStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================
// Step Indicator
// ============================================

interface Step {
    id: number;
    title: string;
    icon: React.ElementType;
}

function StepIndicator({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={false}
                            animate={{
                                scale: currentStep === step.id ? 1.1 : 1,
                                backgroundColor: currentStep >= step.id ? "#296374" : "#e5e7eb",
                            }}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                currentStep >= step.id ? "text-white" : "text-gray-400"
                            )}
                        >
                            {currentStep > step.id ? (
                                <CheckCircle2 className="h-6 w-6" />
                            ) : (
                                <step.icon className="h-5 w-5" />
                            )}
                        </motion.div>
                        <span
                            className={cn(
                                "text-xs mt-2 font-medium text-center max-w-[80px]",
                                currentStep >= step.id ? "text-primary" : "text-gray-400"
                            )}
                        >
                            {step.title}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                "flex-1 h-1 mx-2 rounded-full transition-colors",
                                currentStep > step.id ? "bg-primary" : "bg-gray-200"
                            )}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

// ============================================
// Step 1: Data Siswa
// ============================================

interface DataSiswaProps {
    data: Record<string, string>;
    updateData: (field: string, value: string) => void;
    errors: Record<string, string>;
}

function DataSiswaStep({ data, updateData, errors }: DataSiswaProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                    <strong>Penting:</strong> Pastikan data yang diisi sesuai dengan dokumen resmi (Akta Kelahiran, Kartu Keluarga).
                    Data yang tidak sesuai dapat menyebabkan pendaftaran ditolak.
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Input
                    label="Nama Lengkap"
                    placeholder="Sesuai akta kelahiran"
                    value={data.namaLengkap || ""}
                    onChange={(e) => updateData("namaLengkap", e.target.value)}
                    error={errors.namaLengkap}
                    required
                />
                <Input
                    label="NIK"
                    placeholder="16 digit NIK"
                    value={data.nik || ""}
                    onChange={(e) => updateData("nik", e.target.value.replace(/\D/g, "").slice(0, 16))}
                    error={errors.nik}
                    required
                />
                <Input
                    label="NISN"
                    placeholder="10 digit NISN"
                    value={data.nisn || ""}
                    onChange={(e) => updateData("nisn", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    error={errors.nisn}
                    required
                />
                <Select
                    label="Jenis Kelamin"
                    placeholder="Pilih jenis kelamin"
                    options={[
                        { value: "L", label: "Laki-laki" },
                        { value: "P", label: "Perempuan" },
                    ]}
                    value={data.jenisKelamin || ""}
                    onChange={(value) => updateData("jenisKelamin", value)}
                    error={errors.jenisKelamin}
                />
                <Input
                    label="Tempat Lahir"
                    placeholder="Kota/Kabupaten"
                    value={data.tempatLahir || ""}
                    onChange={(e) => updateData("tempatLahir", e.target.value)}
                    error={errors.tempatLahir}
                    required
                />
                <Input
                    type="date"
                    label="Tanggal Lahir"
                    value={data.tanggalLahir || ""}
                    onChange={(e) => updateData("tanggalLahir", e.target.value)}
                    error={errors.tanggalLahir}
                    required
                />
                <Input
                    label="Agama"
                    placeholder="Agama"
                    value={data.agama || ""}
                    onChange={(e) => updateData("agama", e.target.value)}
                    error={errors.agama}
                    required
                />
                <Input
                    label="Nomor HP"
                    placeholder="08xxxxxxxxxx"
                    value={data.phone || ""}
                    onChange={(e) => updateData("phone", e.target.value)}
                    error={errors.phone}
                    required
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Alamat Domisili</h3>
                <Input
                    label="Alamat Lengkap"
                    placeholder="Jalan, nomor rumah, RT/RW"
                    value={data.alamat || ""}
                    onChange={(e) => updateData("alamat", e.target.value)}
                    error={errors.alamat}
                    required
                />
                <div className="grid md:grid-cols-3 gap-4">
                    <Input
                        label="Kelurahan/Desa"
                        placeholder="Kelurahan"
                        value={data.kelurahan || ""}
                        onChange={(e) => updateData("kelurahan", e.target.value)}
                        error={errors.kelurahan}
                        required
                    />
                    <Input
                        label="Kecamatan"
                        placeholder="Kecamatan"
                        value={data.kecamatan || ""}
                        onChange={(e) => updateData("kecamatan", e.target.value)}
                        error={errors.kecamatan}
                        required
                    />
                    <Input
                        label="Kode Pos"
                        placeholder="Kode pos"
                        value={data.kodePos || ""}
                        onChange={(e) => updateData("kodePos", e.target.value.replace(/\D/g, "").slice(0, 5))}
                        error={errors.kodePos}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Riwayat Pendidikan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Asal Sekolah"
                        placeholder="Nama sekolah asal"
                        value={data.asalSekolah || ""}
                        onChange={(e) => updateData("asalSekolah", e.target.value)}
                        error={errors.asalSekolah}
                        required
                    />
                    <Input
                        label="NPSN Sekolah Asal"
                        placeholder="8 digit NPSN"
                        value={data.npsnAsal || ""}
                        onChange={(e) => updateData("npsnAsal", e.target.value.replace(/\D/g, "").slice(0, 8))}
                        error={errors.npsnAsal}
                    />
                    <Input
                        label="Tahun Lulus"
                        placeholder="2025"
                        value={data.tahunLulus || ""}
                        onChange={(e) => updateData("tahunLulus", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        error={errors.tahunLulus}
                        required
                    />
                    <Input
                        label="No. Ijazah"
                        placeholder="Nomor ijazah"
                        value={data.noIjazah || ""}
                        onChange={(e) => updateData("noIjazah", e.target.value)}
                        error={errors.noIjazah}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// Step 2: Data Orang Tua
// ============================================

function DataOrangTuaStep({ data, updateData, errors }: DataSiswaProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            {/* Ayah */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Data Ayah</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Nama Lengkap Ayah"
                        placeholder="Nama ayah"
                        value={data.namaAyah || ""}
                        onChange={(e) => updateData("namaAyah", e.target.value)}
                        error={errors.namaAyah}
                        required
                    />
                    <Input
                        label="NIK Ayah"
                        placeholder="16 digit NIK"
                        value={data.nikAyah || ""}
                        onChange={(e) => updateData("nikAyah", e.target.value.replace(/\D/g, "").slice(0, 16))}
                        error={errors.nikAyah}
                        required
                    />
                    <Input
                        label="Pekerjaan"
                        placeholder="Pekerjaan ayah"
                        value={data.pekerjaanAyah || ""}
                        onChange={(e) => updateData("pekerjaanAyah", e.target.value)}
                        error={errors.pekerjaanAyah}
                        required
                    />
                    <Select
                        label="Pendidikan Terakhir"
                        placeholder="Pilih pendidikan"
                        options={[
                            { value: "SD", label: "SD/Sederajat" },
                            { value: "SMP", label: "SMP/Sederajat" },
                            { value: "SMA", label: "SMA/Sederajat" },
                            { value: "D3", label: "D3" },
                            { value: "S1", label: "S1" },
                            { value: "S2", label: "S2" },
                            { value: "S3", label: "S3" },
                        ]}
                        value={data.pendidikanAyah || ""}
                        onChange={(value) => updateData("pendidikanAyah", value)}
                        error={errors.pendidikanAyah}
                    />
                    <Input
                        label="Nomor HP Ayah"
                        placeholder="08xxxxxxxxxx"
                        value={data.hpAyah || ""}
                        onChange={(e) => updateData("hpAyah", e.target.value)}
                        error={errors.hpAyah}
                        required
                    />
                    <Select
                        label="Penghasilan per Bulan"
                        placeholder="Pilih rentang penghasilan"
                        options={[
                            { value: "0-1jt", label: "< Rp 1.000.000" },
                            { value: "1-3jt", label: "Rp 1.000.000 - 3.000.000" },
                            { value: "3-5jt", label: "Rp 3.000.000 - 5.000.000" },
                            { value: "5-10jt", label: "Rp 5.000.000 - 10.000.000" },
                            { value: ">10jt", label: "> Rp 10.000.000" },
                        ]}
                        value={data.penghasilanAyah || ""}
                        onChange={(value) => updateData("penghasilanAyah", value)}
                        error={errors.penghasilanAyah}
                    />
                </div>
            </div>

            {/* Ibu */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Data Ibu</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Nama Lengkap Ibu"
                        placeholder="Nama ibu"
                        value={data.namaIbu || ""}
                        onChange={(e) => updateData("namaIbu", e.target.value)}
                        error={errors.namaIbu}
                        required
                    />
                    <Input
                        label="NIK Ibu"
                        placeholder="16 digit NIK"
                        value={data.nikIbu || ""}
                        onChange={(e) => updateData("nikIbu", e.target.value.replace(/\D/g, "").slice(0, 16))}
                        error={errors.nikIbu}
                        required
                    />
                    <Input
                        label="Pekerjaan"
                        placeholder="Pekerjaan ibu"
                        value={data.pekerjaanIbu || ""}
                        onChange={(e) => updateData("pekerjaanIbu", e.target.value)}
                        error={errors.pekerjaanIbu}
                        required
                    />
                    <Select
                        label="Pendidikan Terakhir"
                        placeholder="Pilih pendidikan"
                        options={[
                            { value: "SD", label: "SD/Sederajat" },
                            { value: "SMP", label: "SMP/Sederajat" },
                            { value: "SMA", label: "SMA/Sederajat" },
                            { value: "D3", label: "D3" },
                            { value: "S1", label: "S1" },
                            { value: "S2", label: "S2" },
                            { value: "S3", label: "S3" },
                        ]}
                        value={data.pendidikanIbu || ""}
                        onChange={(value) => updateData("pendidikanIbu", value)}
                        error={errors.pendidikanIbu}
                    />
                    <Input
                        label="Nomor HP Ibu"
                        placeholder="08xxxxxxxxxx"
                        value={data.hpIbu || ""}
                        onChange={(e) => updateData("hpIbu", e.target.value)}
                        error={errors.hpIbu}
                        required
                    />
                    <Select
                        label="Penghasilan per Bulan"
                        placeholder="Pilih rentang penghasilan"
                        options={[
                            { value: "0-1jt", label: "< Rp 1.000.000" },
                            { value: "1-3jt", label: "Rp 1.000.000 - 3.000.000" },
                            { value: "3-5jt", label: "Rp 3.000.000 - 5.000.000" },
                            { value: "5-10jt", label: "Rp 5.000.000 - 10.000.000" },
                            { value: ">10jt", label: "> Rp 10.000.000" },
                        ]}
                        value={data.penghasilanIbu || ""}
                        onChange={(value) => updateData("penghasilanIbu", value)}
                        error={errors.penghasilanIbu}
                    />
                </div>
            </div>

            {/* Wali (Optional) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-tertiary" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Data Wali (Opsional)</h3>
                    </div>
                    <Badge variant="outline">Jika berbeda dengan orang tua</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Nama Lengkap Wali"
                        placeholder="Nama wali"
                        value={data.namaWali || ""}
                        onChange={(e) => updateData("namaWali", e.target.value)}
                    />
                    <Input
                        label="NIK Wali"
                        placeholder="16 digit NIK"
                        value={data.nikWali || ""}
                        onChange={(e) => updateData("nikWali", e.target.value.replace(/\D/g, "").slice(0, 16))}
                    />
                    <Input
                        label="Hubungan dengan Siswa"
                        placeholder="Contoh: Paman, Kakek"
                        value={data.hubunganWali || ""}
                        onChange={(e) => updateData("hubunganWali", e.target.value)}
                    />
                    <Input
                        label="Nomor HP Wali"
                        placeholder="08xxxxxxxxxx"
                        value={data.hpWali || ""}
                        onChange={(e) => updateData("hpWali", e.target.value)}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// Step 3: Pilih Jalur & Sekolah
// ============================================

function PilihJalurStep({ data, updateData, errors }: DataSiswaProps) {
    const { sekolah } = useDataStore();

    const jalurOptions = [
        {
            value: "zonasi",
            label: "Jalur Zonasi",
            description: "Berdasarkan jarak rumah ke sekolah",
            icon: MapPin,
            color: "primary",
        },
        {
            value: "prestasi",
            label: "Jalur Prestasi",
            description: "Prestasi akademik/non-akademik",
            icon: FileText,
            color: "secondary",
        },
        {
            value: "afirmasi",
            label: "Jalur Afirmasi",
            description: "Keluarga tidak mampu (KIP/PKH)",
            icon: Users,
            color: "tertiary",
        },
        {
            value: "perpindahan",
            label: "Jalur Perpindahan",
            description: "Perpindahan tugas orang tua",
            icon: User,
            color: "primary",
        },
    ];

    const filteredSekolah = sekolah.filter((s) => s.jenjang === (data.jenjang || "SMP"));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            {/* Jenjang Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Jenjang Sekolah <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { value: "SD", label: "Sekolah Dasar", icon: "🏫" },
                        { value: "SMP", label: "Sekolah Menengah Pertama", icon: "🎒" },
                    ].map((option) => (
                        <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                updateData("jenjang", option.value);
                                updateData("sekolahId", "");
                            }}
                            className={cn(
                                "p-4 rounded-xl border-2 text-left transition-all",
                                data.jenjang === option.value
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="text-3xl mb-2">{option.icon}</div>
                            <div className="font-semibold text-gray-900">{option.value}</div>
                            <div className="text-sm text-gray-500">{option.label}</div>
                        </motion.button>
                    ))}
                </div>
                {errors.jenjang && <p className="text-xs text-red-500">{errors.jenjang}</p>}
            </div>

            {/* Jalur Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Jalur Pendaftaran <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                    {jalurOptions.map((jalur) => (
                        <motion.button
                            key={jalur.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateData("jalur", jalur.value)}
                            className={cn(
                                "p-4 rounded-xl border-2 text-left transition-all",
                                data.jalur === jalur.value
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn("p-2 rounded-lg bg-${jalur.color}/10")}>
                                    <jalur.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{jalur.label}</div>
                                    <div className="text-sm text-gray-500">{jalur.description}</div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
                {errors.jalur && <p className="text-xs text-red-500">{errors.jalur}</p>}
            </div>

            {/* Sekolah Selection */}
            <div className="space-y-4">
                <Select
                    label="Pilih Sekolah Tujuan"
                    placeholder="Cari dan pilih sekolah..."
                    searchable
                    options={filteredSekolah.map((s) => ({
                        value: s.id,
                        label: `${s.name} - ${s.kecamatan}`,
                    }))}
                    value={data.sekolahId || ""}
                    onChange={(value) => updateData("sekolahId", value)}
                    error={errors.sekolahId}
                />
            </div>

            {/* Map for Zonasi */}
            {data.jalur === "zonasi" && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Lokasi Rumah (untuk perhitungan zonasi)
                    </label>
                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <Map className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">Klik untuk menandai lokasi rumah</p>
                            <Button variant="outline" size="sm" leftIcon={<MapPin className="h-4 w-4" />}>
                                Buka Peta
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        * Lokasi akan digunakan untuk menghitung jarak ke sekolah tujuan
                    </p>
                </div>
            )}
        </motion.div>
    );
}

// ============================================
// Step 4: Upload Berkas
// ============================================

interface FileUploadProps {
    label: string;
    required?: boolean;
    uploaded?: boolean;
    onUpload: () => void;
    onRemove: () => void;
}

function FileUploadItem({ label, required, uploaded, onUpload, onRemove }: FileUploadProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                uploaded ? "border-green-500 bg-green-50" : "border-dashed border-gray-300"
            )}
        >
            <div className="flex items-center gap-3">
                {uploaded ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                )}
                <div>
                    <span className="font-medium text-gray-700">{label}</span>
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {uploaded && (
                        <span className="block text-xs text-green-600">Berkas terunggah</span>
                    )}
                </div>
            </div>
            {uploaded ? (
                <Button variant="ghost" size="sm" onClick={onRemove}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            ) : (
                <Button variant="outline" size="sm" onClick={onUpload} leftIcon={<Upload className="h-4 w-4" />}>
                    Upload
                </Button>
            )}
        </div>
    );
}

function UploadBerkasStep({ data, updateData }: DataSiswaProps) {
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});

    const requiredDocs = [
        { id: "kk", label: "Kartu Keluarga", required: true },
        { id: "akta", label: "Akta Kelahiran", required: true },
        { id: "ijazah", label: "Ijazah/Surat Keterangan Lulus", required: true },
        { id: "foto", label: "Pas Foto 3x4 (Latar Biru)", required: true },
    ];

    const additionalDocs = [
        { id: "skhun", label: "SKHUN (jika ada)" },
        { id: "prestasi", label: "Sertifikat Prestasi (untuk jalur prestasi)" },
        { id: "kip", label: "Kartu Indonesia Pintar (untuk jalur afirmasi)" },
        { id: "surattugas", label: "Surat Tugas Orang Tua (untuk jalur perpindahan)" },
    ];

    const handleUpload = (docId: string) => {
        // Simulate upload
        setUploadedFiles((prev) => ({ ...prev, [docId]: true }));
    };

    const handleRemove = (docId: string) => {
        setUploadedFiles((prev) => ({ ...prev, [docId]: false }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                    <strong>Format yang diterima:</strong> JPG, PNG, atau PDF (maksimal 2MB per file).
                    Pastikan dokumen jelas dan terbaca.
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Berkas Wajib</h3>
                <div className="space-y-3">
                    {requiredDocs.map((doc) => (
                        <FileUploadItem
                            key={doc.id}
                            label={doc.label}
                            required={doc.required}
                            uploaded={uploadedFiles[doc.id]}
                            onUpload={() => handleUpload(doc.id)}
                            onRemove={() => handleRemove(doc.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Berkas Tambahan</h3>
                <div className="space-y-3">
                    {additionalDocs.map((doc) => (
                        <FileUploadItem
                            key={doc.id}
                            label={doc.label}
                            uploaded={uploadedFiles[doc.id]}
                            onUpload={() => handleUpload(doc.id)}
                            onRemove={() => handleRemove(doc.id)}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// Step 5: Review & Submit
// ============================================

function ReviewStep({ data }: { data: Record<string, string> }) {
    const sections = [
        {
            title: "Data Siswa",
            items: [
                { label: "Nama Lengkap", value: data.namaLengkap },
                { label: "NIK", value: data.nik },
                { label: "NISN", value: data.nisn },
                { label: "TTL", value: `${data.tempatLahir}, ${data.tanggalLahir}` },
                { label: "Jenis Kelamin", value: data.jenisKelamin === "L" ? "Laki-laki" : "Perempuan" },
                { label: "Alamat", value: `${data.alamat}, ${data.kelurahan}, ${data.kecamatan}` },
                { label: "Asal Sekolah", value: data.asalSekolah },
            ],
        },
        {
            title: "Data Orang Tua",
            items: [
                { label: "Nama Ayah", value: data.namaAyah },
                { label: "Pekerjaan Ayah", value: data.pekerjaanAyah },
                { label: "Nama Ibu", value: data.namaIbu },
                { label: "Pekerjaan Ibu", value: data.pekerjaanIbu },
            ],
        },
        {
            title: "Pilihan Pendaftaran",
            items: [
                { label: "Jenjang", value: data.jenjang },
                { label: "Jalur", value: data.jalur?.charAt(0).toUpperCase() + data.jalur?.slice(1) },
                { label: "Sekolah Tujuan", value: "SMPN 1 Sukajadi" },
            ],
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">
                    <strong>Hampir selesai!</strong> Periksa kembali data Anda sebelum mengirim pendaftaran.
                    Data yang sudah dikirim tidak dapat diubah.
                </div>
            </div>

            {sections.map((section) => (
                <Card key={section.title} variant="outline">
                    <CardHeader className="py-3">
                        <CardTitle className="text-base">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid md:grid-cols-2 gap-3">
                            {section.items.map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs text-gray-400">{item.label}</p>
                                    <p className="text-sm font-medium text-gray-900">{item.value || "-"}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card variant="outline">
                <CardContent className="py-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-600">
                            Saya menyatakan bahwa data yang saya isi adalah benar dan saya bersedia menerima
                            sanksi apabila dikemudian hari data tersebut terbukti tidak benar.
                        </span>
                    </label>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ============================================
// Main Form Page
// ============================================

export default function FormulirPage() {
    const { initialize, isInitialized } = useDataStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const steps: Step[] = [
        { id: 1, title: "Data Siswa", icon: User },
        { id: 2, title: "Data Orang Tua", icon: Users },
        { id: 3, title: "Pilih Jalur", icon: MapPin },
        { id: 4, title: "Upload Berkas", icon: FileText },
        { id: 5, title: "Review", icon: CheckCircle2 },
    ];

    const updateData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleNext = () => {
        // Simple validation - in real app would be more comprehensive
        if (currentStep < 5) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate submission
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // Show success or redirect
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-gray-900">
                        Formulir Pendaftaran
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Lengkapi data berikut untuk melakukan pendaftaran
                    </p>
                </motion.div>

                {/* Step Indicator */}
                <StepIndicator steps={steps} currentStep={currentStep} />

                {/* Form Content */}
                <Card variant="elevated" className="mb-6">
                    <CardContent className="p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <DataSiswaStep key="step1" data={formData} updateData={updateData} errors={errors} />
                            )}
                            {currentStep === 2 && (
                                <DataOrangTuaStep key="step2" data={formData} updateData={updateData} errors={errors} />
                            )}
                            {currentStep === 3 && (
                                <PilihJalurStep key="step3" data={formData} updateData={updateData} errors={errors} />
                            )}
                            {currentStep === 4 && (
                                <UploadBerkasStep key="step4" data={formData} updateData={updateData} errors={errors} />
                            )}
                            {currentStep === 5 && <ReviewStep key="step5" data={formData} />}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        leftIcon={<ArrowLeft className="h-5 w-5" />}
                    >
                        Kembali
                    </Button>

                    {currentStep < 5 ? (
                        <Button onClick={handleNext} rightIcon={<ArrowRight className="h-5 w-5" />}>
                            Lanjutkan
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            rightIcon={<CheckCircle2 className="h-5 w-5" />}
                        >
                            Kirim Pendaftaran
                        </Button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
