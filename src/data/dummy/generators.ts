import { generateId, generateShortId } from "@/lib/uuid";
import type {
    User,
    UserRole,
    Dinas,
    Sekolah,
    Jenjang,
    Jalur,
    TahunAjaran,
    Siswa,
    OrangTua,
    Pendaftaran,
    StatusPendaftaran,
    Berkas,
    Prestasi,
    Pengumuman,
    Berita,
    Tiket,
    Notifikasi,
    Kuota,
} from "../types";

// ============================================
// Helper Functions
// ============================================

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// Static Data
// ============================================

const NAMA_DEPAN = [
    "Ahmad", "Muhammad", "Andi", "Budi", "Cahya", "Dian", "Eka", "Fajar",
    "Galih", "Hadi", "Indra", "Joko", "Kartika", "Lestari", "Maya", "Nadia",
    "Oki", "Putri", "Ratna", "Sari", "Tika", "Umar", "Vina", "Wati",
    "Yanti", "Zainal", "Ayu", "Dewi", "Fitri", "Gita", "Hana", "Intan",
];

const NAMA_BELAKANG = [
    "Pratama", "Wijaya", "Kusuma", "Sari", "Putri", "Wati", "Rahayu",
    "Hidayat", "Nugraha", "Saputra", "Permana", "Santoso", "Wibowo",
    "Suryanto", "Hartono", "Kurniawan", "Setiawan", "Gunawan", "Firmansyah",
];

const KABUPATEN = [
    "Bandung", "Bogor", "Bekasi", "Cirebon", "Garut", "Karawang",
    "Kuningan", "Majalengka", "Purwakarta", "Subang", "Sukabumi", "Sumedang",
];

const KECAMATAN = [
    "Sukajadi", "Coblong", "Bandung Wetan", "Cicendo", "Andir",
    "Lengkong", "Regol", "Batununggal", "Kiaracondong", "Antapani",
];

const KELURAHAN = [
    "Cipaganti", "Lebak Siliwangi", "Sekeloa", "Pasteur", "Sukabungah",
    "Citarum", "Cihapit", "Malabar", "Kebon Pisang", "Antapani Kidul",
];

// ============================================
// Dummy Data Generators  
// ============================================

export function generateDummyDinas(count: number = 5): Dinas[] {
    return Array.from({ length: count }, (_, i) => {
        const kabupaten = KABUPATEN[i % KABUPATEN.length];
        return {
            id: generateId(),
            name: `Dinas Pendidikan Kabupaten ${kabupaten}`,
            kabupaten,
            provinsi: "Jawa Barat",
            alamat: `Jl. Merdeka No. ${randomNumber(1, 100)}, ${kabupaten}`,
            telepon: `022-${randomNumber(1000000, 9999999)}`,
            email: `dinas.pendidikan@${kabupaten.toLowerCase().replace(/\s/g, "")}.go.id`,
            website: `https://disdik.${kabupaten.toLowerCase().replace(/\s/g, "")}.go.id`,
            logoDinas: "/images/logo-dinas.png",
            logoKabupaten: "/images/logo-kabupaten.png",
            kepalaDinas: `Dr. ${randomElement(NAMA_DEPAN)} ${randomElement(NAMA_BELAKANG)}, M.Pd`,
            nipKepalaDinas: `19${randomNumber(60, 80)}${randomNumber(10, 12)}${randomNumber(10, 28)}${randomNumber(100000, 999999)}`,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date(),
        };
    });
}

export function generateDummySekolah(dinasId: string, jenjang: Jenjang, count: number = 10): Sekolah[] {
    const prefix = jenjang === "SD" ? "SDN" : "SMPN";

    return Array.from({ length: count }, (_, i) => {
        const kecamatan = randomElement(KECAMATAN);
        const kelurahan = randomElement(KELURAHAN);

        return {
            id: generateId(),
            dinasId,
            npsn: `${randomNumber(10000000, 99999999)}`,
            name: `${prefix} ${i + 1} ${kecamatan}`,
            jenjang,
            alamat: `Jl. Pendidikan No. ${randomNumber(1, 200)}, ${kelurahan}`,
            kelurahan,
            kecamatan,
            telepon: `022-${randomNumber(1000000, 9999999)}`,
            email: `${prefix.toLowerCase()}${i + 1}.${kecamatan.toLowerCase().replace(/\s/g, "")}@edu.id`,
            koordinat: {
                lat: -6.9 + Math.random() * 0.2,
                lng: 107.5 + Math.random() * 0.2,
            },
            logo: "/images/logo-sekolah.png",
            kepalaSekolah: `${randomElement(NAMA_DEPAN)} ${randomElement(NAMA_BELAKANG)}, S.Pd`,
            nipKepalaSekolah: `19${randomNumber(65, 85)}${randomNumber(10, 12)}${randomNumber(10, 28)}${randomNumber(100000, 999999)}`,
            ketuaSpmb: `${randomElement(NAMA_DEPAN)} ${randomElement(NAMA_BELAKANG)}, S.Pd`,
            akreditasi: randomElement(["A", "A", "A", "B", "B"]),
            status: randomElement(["negeri", "negeri", "negeri", "swasta"]) as "negeri" | "swasta",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date(),
        };
    });
}

export function generateDummyJalur(): Jalur[] {
    return [
        {
            id: generateId(),
            name: "Jalur Zonasi",
            type: "zonasi",
            description: "Pendaftaran berdasarkan jarak tempat tinggal ke sekolah",
            persyaratan: [
                "Berdomisili di wilayah zonasi sekolah",
                "Memiliki Kartu Keluarga yang masih berlaku",
                "Usia sesuai ketentuan jenjang sekolah",
            ],
            berkasWajib: [
                "Kartu Keluarga",
                "Akta Kelahiran",
                "Ijazah/Surat Keterangan Lulus",
                "Foto 3x4",
            ],
            radiusZonasi: 3, // 3 km
            isActive: true,
            order: 1,
        },
        {
            id: generateId(),
            name: "Jalur Prestasi",
            type: "prestasi",
            description: "Pendaftaran berdasarkan prestasi akademik dan non-akademik",
            persyaratan: [
                "Memiliki prestasi akademik atau non-akademik yang diakui",
                "Prestasi diraih dalam 2 tahun terakhir",
                "Memiliki sertifikat/piagam penghargaan",
            ],
            berkasWajib: [
                "Kartu Keluarga",
                "Akta Kelahiran",
                "Ijazah/Surat Keterangan Lulus",
                "Sertifikat Prestasi",
                "Foto 3x4",
            ],
            isActive: true,
            order: 2,
        },
        {
            id: generateId(),
            name: "Jalur Afirmasi",
            type: "afirmasi",
            description: "Pendaftaran untuk calon peserta didik dari keluarga tidak mampu",
            persyaratan: [
                "Terdaftar dalam DTKS (Data Terpadu Kesejahteraan Sosial)",
                "Memiliki Kartu Indonesia Pintar (KIP)",
                "Atau memiliki surat keterangan tidak mampu dari kelurahan",
            ],
            berkasWajib: [
                "Kartu Keluarga",
                "Akta Kelahiran",
                "Ijazah/Surat Keterangan Lulus",
                "Kartu Indonesia Pintar / SKTM",
                "Foto 3x4",
            ],
            isActive: true,
            order: 3,
        },
        {
            id: generateId(),
            name: "Jalur Perpindahan Orang Tua",
            type: "perpindahan",
            description: "Pendaftaran untuk anak yang mengikuti perpindahan tugas orang tua",
            persyaratan: [
                "Orang tua/wali memiliki surat tugas perpindahan",
                "Perpindahan dilakukan dalam tahun berjalan",
                "Alamat baru sesuai dengan wilayah sekolah tujuan",
            ],
            berkasWajib: [
                "Kartu Keluarga",
                "Akta Kelahiran",
                "Ijazah/Surat Keterangan Lulus",
                "Surat Tugas Perpindahan",
                "Foto 3x4",
            ],
            isActive: true,
            order: 4,
        },
    ];
}

export function generateDummyTahunAjaran(): TahunAjaran {
    return {
        id: generateId(),
        tahun: "2026/2027",
        isActive: true,
        tanggalMulaiPendaftaran: new Date("2026-01-15"),
        tanggalAkhirPendaftaran: new Date("2026-02-28"),
        tanggalSeleksi: new Date("2026-03-10"),
        tanggalPengumuman: new Date("2026-03-15"),
        tanggalDaftarUlang: new Date("2026-03-20"),
        tanggalAkhirDaftarUlang: new Date("2026-03-31"),
    };
}

export function generateDummySiswa(count: number = 100): Siswa[] {
    return Array.from({ length: count }, () => {
        const jenisKelamin = randomElement(["L", "P"] as const);
        const namaDepan = randomElement(NAMA_DEPAN);
        const namaBelakang = randomElement(NAMA_BELAKANG);
        const tahunLahir = randomNumber(2013, 2016);

        return {
            id: generateId(),
            userId: generateId(),
            nisn: `${randomNumber(1000000000, 9999999999)}`,
            nik: `32${randomNumber(10, 99)}${randomNumber(10, 99)}${randomNumber(100000, 999999)}${randomNumber(1000, 9999)}`,
            namaLengkap: `${namaDepan} ${namaBelakang}`,
            tempatLahir: randomElement(KABUPATEN),
            tanggalLahir: new Date(tahunLahir, randomNumber(0, 11), randomNumber(1, 28)),
            jenisKelamin,
            agama: randomElement(["Islam", "Kristen", "Katolik", "Hindu", "Buddha"] as const),
            alamat: `Jl. ${randomElement(["Merdeka", "Sudirman", "Gatot Subroto", "Ahmad Yani", "Diponegoro"])} No. ${randomNumber(1, 200)}`,
            rt: `${randomNumber(1, 20)}`.padStart(3, "0"),
            rw: `${randomNumber(1, 15)}`.padStart(3, "0"),
            kelurahan: randomElement(KELURAHAN),
            kecamatan: randomElement(KECAMATAN),
            kabupaten: randomElement(KABUPATEN),
            provinsi: "Jawa Barat",
            kodePos: `40${randomNumber(100, 999)}`,
            koordinatRumah: {
                lat: -6.9 + Math.random() * 0.2,
                lng: 107.5 + Math.random() * 0.2,
            },
            telepon: `08${randomNumber(100000000, 999999999)}`,
            email: `${namaDepan.toLowerCase()}.${namaBelakang.toLowerCase()}${randomNumber(1, 99)}@gmail.com`,
            asalSekolah: `SD ${randomElement(["Negeri", "Swasta"])} ${randomNumber(1, 20)} ${randomElement(KECAMATAN)}`,
            npsnAsalSekolah: `${randomNumber(10000000, 99999999)}`,
            createdAt: randomDate(new Date("2026-01-15"), new Date("2026-02-15")),
            updatedAt: new Date(),
        };
    });
}

export function generateDummyOrangTua(siswaId: string): OrangTua[] {
    const ayah: OrangTua = {
        id: generateId(),
        siswaId,
        hubungan: "Ayah",
        namaLengkap: `${randomElement(NAMA_DEPAN)} ${randomElement(NAMA_BELAKANG)}`,
        nik: `32${randomNumber(10, 99)}${randomNumber(10, 99)}${randomNumber(100000, 999999)}${randomNumber(1000, 9999)}`,
        tempatLahir: randomElement(KABUPATEN),
        tanggalLahir: new Date(randomNumber(1970, 1990), randomNumber(0, 11), randomNumber(1, 28)),
        pendidikan: randomElement(["SMA/Sederajat", "D3", "S1", "S2", "S3"]),
        pekerjaan: randomElement(["PNS", "Wiraswasta", "Karyawan Swasta", "TNI/Polri", "Guru", "Dokter"]),
        penghasilan: randomElement(["< 1 Juta", "1-3 Juta", "3-5 Juta", "5-10 Juta", "> 10 Juta"]),
        telepon: `08${randomNumber(100000000, 999999999)}`,
        alamat: `Jl. ${randomElement(["Merdeka", "Sudirman", "Ahmad Yani"])} No. ${randomNumber(1, 200)}`,
        isWali: false,
    };

    const ibu: OrangTua = {
        id: generateId(),
        siswaId,
        hubungan: "Ibu",
        namaLengkap: `${randomElement(["Siti", "Dewi", "Sri", "Rina", "Yanti", "Wati"])} ${randomElement(NAMA_BELAKANG)}`,
        nik: `32${randomNumber(10, 99)}${randomNumber(10, 99)}${randomNumber(100000, 999999)}${randomNumber(1000, 9999)}`,
        tempatLahir: randomElement(KABUPATEN),
        tanggalLahir: new Date(randomNumber(1975, 1992), randomNumber(0, 11), randomNumber(1, 28)),
        pendidikan: randomElement(["SMA/Sederajat", "D3", "S1", "S2"]),
        pekerjaan: randomElement(["Ibu Rumah Tangga", "PNS", "Wiraswasta", "Karyawan Swasta", "Guru"]),
        penghasilan: randomElement(["Tidak Bekerja", "< 1 Juta", "1-3 Juta", "3-5 Juta"]),
        telepon: `08${randomNumber(100000000, 999999999)}`,
        alamat: `Jl. ${randomElement(["Merdeka", "Sudirman", "Ahmad Yani"])} No. ${randomNumber(1, 200)}`,
        isWali: false,
    };

    return [ayah, ibu];
}

export function generateDummyPendaftaran(
    siswaId: string,
    sekolahId: string,
    jalurId: string,
    tahunAjaranId: string
): Pendaftaran {
    const status = randomElement([
        "draft", "submitted", "verifikasi", "terverifikasi", "diterima", "ditolak"
    ] as StatusPendaftaran[]);

    return {
        id: generateId(),
        siswaId,
        sekolahId,
        jalurId,
        tahunAjaranId,
        noPendaftaran: `SPMB-${new Date().getFullYear()}-${generateShortId().toUpperCase()}`,
        status,
        jarakKeSekolah: Math.random() * 5,
        nilaiRata: randomNumber(70, 100),
        skorZonasi: randomNumber(0, 100),
        createdAt: randomDate(new Date("2026-01-15"), new Date("2026-02-15")),
        updatedAt: new Date(),
        submittedAt: status !== "draft" ? randomDate(new Date("2026-01-20"), new Date("2026-02-20")) : undefined,
        verifiedAt: ["terverifikasi", "diterima", "ditolak"].includes(status)
            ? randomDate(new Date("2026-02-15"), new Date("2026-02-28"))
            : undefined,
    };
}

export function generateDummyPengumuman(dinasId?: string, sekolahId?: string, count: number = 5): Pengumuman[] {
    const titles = [
        "Jadwal Pendaftaran SPMB Tahun Ajaran 2026/2027",
        "Persyaratan Dokumen Pendaftaran",
        "Pengumuman Hasil Seleksi Tahap 1",
        "Informasi Daftar Ulang",
        "Perubahan Jadwal Seleksi",
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        dinasId,
        sekolahId,
        judul: titles[i % titles.length],
        isi: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
        tipe: randomElement(["info", "warning", "urgent"] as const),
        isPublished: true,
        publishedAt: randomDate(new Date("2026-01-01"), new Date()),
        createdBy: generateId(),
        createdAt: randomDate(new Date("2026-01-01"), new Date()),
        updatedAt: new Date(),
    }));
}

export function generateDummyBerita(dinasId?: string, sekolahId?: string, count: number = 5): Berita[] {
    const titles = [
        "Pendaftaran SPMB Resmi Dibuka",
        "Tips Memilih Sekolah yang Tepat untuk Anak",
        "Sosialisasi Sistem Zonasi Tahun Ini",
        "Prestasi Siswa dalam Olimpiade Sains",
        "Kunjungan Kepala Dinas ke Sekolah-Sekolah",
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        dinasId,
        sekolahId,
        judul: titles[i % titles.length],
        slug: titles[i % titles.length].toLowerCase().replace(/\s+/g, "-"),
        ringkasan: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
        isi: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        gambar: `/images/news-${(i % 3) + 1}.jpg`,
        isPublished: true,
        publishedAt: randomDate(new Date("2026-01-01"), new Date()),
        createdBy: generateId(),
        createdAt: randomDate(new Date("2026-01-01"), new Date()),
        updatedAt: new Date(),
    }));
}

export function generateDummyUser(role: UserRole, name?: string): User {
    const defaultName = name || `${randomElement(NAMA_DEPAN)} ${randomElement(NAMA_BELAKANG)}`;
    const email = `${defaultName.toLowerCase().replace(/\s/g, ".")}@${role === "siswa" ? "gmail.com" : "edu.id"
        }`;

    return {
        id: generateId(),
        email,
        name: defaultName,
        role,
        phone: `08${randomNumber(100000000, 999999999)}`,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
        lastLoginAt: randomDate(new Date("2026-01-01"), new Date()),
        isActive: true,
    };
}

export function generateDummyKuota(sekolahId: string, jalurIds: string[]): Kuota[] {
    return jalurIds.map((jalurId, i) => {
        const kuota = [150, 50, 30, 20][i] || 30;
        return {
            id: generateId(),
            sekolahId,
            jalurId,
            tahunAjaran: "2026/2027",
            kuota,
            terisi: randomNumber(0, Math.floor(kuota * 0.7)),
        };
    });
}

// ============================================
// Complete Data Store Generator
// ============================================

export interface DummyDataStore {
    users: User[];
    dinas: Dinas[];
    sekolah: Sekolah[];
    jalur: Jalur[];
    tahunAjaran: TahunAjaran;
    siswa: Siswa[];
    orangTua: OrangTua[];
    pendaftaran: Pendaftaran[];
    kuota: Kuota[];
    pengumuman: Pengumuman[];
    berita: Berita[];
}

export function generateCompleteDataStore(): DummyDataStore {
    // Generate Dinas
    const dinas = generateDummyDinas(3);

    // Generate Jalur (same for all)
    const jalur = generateDummyJalur();
    const jalurIds = jalur.map(j => j.id);

    // Generate Tahun Ajaran
    const tahunAjaran = generateDummyTahunAjaran();

    // Generate Sekolah for each Dinas
    const sekolah: Sekolah[] = [];
    dinas.forEach(d => {
        sekolah.push(...generateDummySekolah(d.id, "SD", 5));
        sekolah.push(...generateDummySekolah(d.id, "SMP", 5));
    });

    // Generate Kuota for each Sekolah
    const kuota: Kuota[] = [];
    sekolah.forEach(s => {
        kuota.push(...generateDummyKuota(s.id, jalurIds));
    });

    // Generate Siswa
    const siswa = generateDummySiswa(200);

    // Generate Orang Tua for each Siswa
    const orangTua: OrangTua[] = [];
    siswa.forEach(s => {
        orangTua.push(...generateDummyOrangTua(s.id));
    });

    // Generate Pendaftaran (70% of siswa)
    const pendaftaran: Pendaftaran[] = [];
    siswa.slice(0, 140).forEach(s => {
        const targetSekolah = randomElement(sekolah);
        const targetJalur = randomElement(jalur);
        pendaftaran.push(generateDummyPendaftaran(s.id, targetSekolah.id, targetJalur.id, tahunAjaran.id));
    });

    // Generate Users
    const users: User[] = [
        generateDummyUser("super_admin", "Super Admin"),
        ...dinas.map(d => generateDummyUser("admin_dinas", `Admin ${d.kabupaten}`)),
        ...sekolah.slice(0, 10).map(s => generateDummyUser("admin_sekolah", `Admin ${s.name}`)),
        ...siswa.slice(0, 50).map(s => ({ ...generateDummyUser("siswa", s.namaLengkap), id: s.userId })),
    ];

    // Generate Pengumuman and Berita
    const pengumuman: Pengumuman[] = [
        ...generateDummyPengumuman(dinas[0].id, undefined, 3),
        ...generateDummyPengumuman(undefined, sekolah[0].id, 2),
    ];

    const berita: Berita[] = [
        ...generateDummyBerita(dinas[0].id, undefined, 3),
        ...generateDummyBerita(undefined, sekolah[0].id, 2),
    ];

    return {
        users,
        dinas,
        sekolah,
        jalur,
        tahunAjaran,
        siswa,
        orangTua,
        pendaftaran,
        kuota,
        pengumuman,
        berita,
    };
}
