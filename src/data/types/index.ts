// Core Entity Types for SPMB Application

// ============================================
// User & Authentication Types
// ============================================

export type UserRole = "super_admin" | "admin_dinas" | "admin_sekolah" | "siswa";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    isActive: boolean;
}

export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

// ============================================
// Dinas (District Education Office) Types
// ============================================

export interface Dinas {
    id: string;
    name: string;
    kabupaten: string;
    provinsi: string;
    alamat: string;
    telepon: string;
    email: string;
    website?: string;
    logoDinas: string;
    logoKabupaten: string;
    kepalaDinas: string;
    nipKepalaDinas: string;
    ttdDigital?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// School Types
// ============================================

export type Jenjang = "SD" | "SMP";

export interface Sekolah {
    id: string;
    dinasId: string;
    npsn: string;
    name: string;
    jenjang: Jenjang;
    alamat: string;
    kelurahan: string;
    kecamatan: string;
    telepon: string;
    email: string;
    website?: string;
    koordinat: {
        lat: number;
        lng: number;
    };
    logo: string;
    kepalaSekolah: string;
    nipKepalaSekolah: string;
    ketuaSpmb: string;
    ttdDigital?: string;
    akreditasi: string;
    status: "negeri" | "swasta";
    createdAt: Date;
    updatedAt: Date;
}

export interface Kuota {
    id: string;
    sekolahId: string;
    jalurId: string;
    tahunAjaran: string;
    kuota: number;
    terisi: number;
}

// ============================================
// Registration Path Types
// ============================================

export type JalurType = "zonasi" | "prestasi" | "perpindahan" | "afirmasi";

export interface Jalur {
    id: string;
    name: string;
    type: JalurType;
    description: string;
    persyaratan: string[];
    berkasWajib: string[];
    radiusZonasi?: number; // in km, only for zonasi
    isActive: boolean;
    order: number;
}

// ============================================
// Academic Period Types
// ============================================

export interface TahunAjaran {
    id: string;
    tahun: string; // e.g., "2026/2027"
    isActive: boolean;
    tanggalMulaiPendaftaran: Date;
    tanggalAkhirPendaftaran: Date;
    tanggalSeleksi: Date;
    tanggalPengumuman: Date;
    tanggalDaftarUlang: Date;
    tanggalAkhirDaftarUlang: Date;
}

// ============================================
// Student & Guardian Types
// ============================================

export type JenisKelamin = "L" | "P";
export type Agama = "Islam" | "Kristen" | "Katolik" | "Hindu" | "Buddha" | "Konghucu";
export type HubunganWali = "Ayah" | "Ibu" | "Kakek" | "Nenek" | "Paman" | "Bibi" | "Lainnya";

export interface Siswa {
    id: string;
    userId: string;
    nisn: string;
    nik: string;
    namaLengkap: string;
    tempatLahir: string;
    tanggalLahir: Date;
    jenisKelamin: JenisKelamin;
    agama: Agama;
    alamat: string;
    rt: string;
    rw: string;
    kelurahan: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    kodePos: string;
    koordinatRumah?: {
        lat: number;
        lng: number;
    };
    telepon?: string;
    email: string;
    foto?: string;
    asalSekolah?: string;
    npsnAsalSekolah?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrangTua {
    id: string;
    siswaId: string;
    hubungan: HubunganWali;
    namaLengkap: string;
    nik: string;
    tempatLahir: string;
    tanggalLahir: Date;
    pendidikan: string;
    pekerjaan: string;
    penghasilan: string;
    telepon: string;
    email?: string;
    alamat: string;
    isWali: boolean;
}

// ============================================
// Registration Types
// ============================================

export type StatusPendaftaran =
    | "draft"
    | "submitted"
    | "verifikasi"
    | "terverifikasi"
    | "diterima"
    | "ditolak"
    | "daftar_ulang"
    | "selesai";

export interface Pendaftaran {
    id: string;
    siswaId: string;
    sekolahId: string;
    jalurId: string;
    tahunAjaranId: string;
    noPendaftaran: string;
    status: StatusPendaftaran;
    jarakKeSekolah?: number; // in km
    nilaiRata?: number;
    skorZonasi?: number;
    skorPrestasi?: number;
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectReason?: string;
}

// ============================================
// Document Types
// ============================================

export type StatusBerkas = "pending" | "approved" | "rejected";

export interface Berkas {
    id: string;
    pendaftaranId: string;
    jenisBerkas: string;
    namaFile: string;
    urlFile: string;
    ukuranFile: number;
    status: StatusBerkas;
    catatan?: string;
    verifiedAt?: Date;
    verifiedBy?: string;
}

// ============================================
// Achievement Types
// ============================================

export type TingkatPrestasi = "kecamatan" | "kabupaten" | "provinsi" | "nasional" | "internasional";
export type JenisPrestasi = "akademik" | "non_akademik";

export interface Prestasi {
    id: string;
    siswaId: string;
    nama: string;
    jenis: JenisPrestasi;
    tingkat: TingkatPrestasi;
    peringkat: number;
    tahun: number;
    penyelenggara: string;
    bukti?: string;
    skor: number; // calculated score based on tingkat and peringkat
}

// ============================================
// Announcement & News Types
// ============================================

export type TipePengumuman = "info" | "warning" | "urgent";

export interface Pengumuman {
    id: string;
    dinasId?: string;
    sekolahId?: string;
    judul: string;
    isi: string;
    tipe: TipePengumuman;
    isPublished: boolean;
    publishedAt?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Berita {
    id: string;
    dinasId?: string;
    sekolahId?: string;
    judul: string;
    slug: string;
    ringkasan: string;
    isi: string;
    gambar?: string;
    isPublished: boolean;
    publishedAt?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Ticket Types
// ============================================

export type StatusTiket = "open" | "in_progress" | "resolved" | "closed";
export type PrioritasTiket = "low" | "medium" | "high";

export interface Tiket {
    id: string;
    nomor: string;
    pengirimId: string;
    penerimaId?: string; // admin yang menangani
    sekolahId?: string;
    dinasId?: string;
    subjek: string;
    pesan: string;
    prioritas: PrioritasTiket;
    status: StatusTiket;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
}

export interface BalasanTiket {
    id: string;
    tiketId: string;
    userId: string;
    pesan: string;
    createdAt: Date;
}

// ============================================
// Notification Types
// ============================================

export type TipeNotifikasi =
    | "pendaftaran"
    | "verifikasi"
    | "pengumuman"
    | "daftar_ulang"
    | "tiket"
    | "sistem";

export interface Notifikasi {
    id: string;
    userId: string;
    tipe: TipeNotifikasi;
    judul: string;
    pesan: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
}

// ============================================
// Digital Signature Types
// ============================================

export interface TandaTanganDigital {
    id: string;
    dokumentId: string;
    dokumentType: "pendaftaran" | "surat_keterangan" | "rekapitulasi" | "pakta_integritas";
    hash: string;
    qrCode: string;
    signedBy: string;
    signedAt: Date;
    isValid: boolean;
}

// ============================================
// Statistics Types
// ============================================

export interface StatistikPendaftaran {
    total: number;
    perJalur: Record<string, number>;
    perStatus: Record<StatusPendaftaran, number>;
    perJenjang: Record<Jenjang, number>;
    perHari: { tanggal: string; jumlah: number }[];
}

export interface StatistikSekolah {
    sekolahId: string;
    totalPendaftar: number;
    diterima: number;
    ditolak: number;
    menunggu: number;
    kuotaTerisi: number;
    kuotaTotal: number;
}

// ============================================
// Form Configuration Types
// ============================================

export interface FormField {
    id: string;
    name: string;
    label: string;
    type: "text" | "number" | "email" | "tel" | "date" | "select" | "textarea" | "file" | "checkbox";
    required: boolean;
    options?: { value: string; label: string }[];
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
    };
    order: number;
}

export interface KonfigurasiFormulir {
    id: string;
    dinasId: string;
    tahunAjaranId: string;
    fields: FormField[];
}
