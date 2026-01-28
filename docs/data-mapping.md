# Data Mapping Report: SPMB Data Migration

This document outlines the entities, fields, and UI interactions identified in the Next.js project to be migrated from dummy data to a real Python (FastAPI) + MySQL backend.

## 1. Core Entities

### User (Pengguna)
- **Role**: `super_admin`, `admin_dinas`, `admin_sekolah`, `siswa`
- **Fields**: `id`, `email`, `name`, `role`, `avatar`, `phone`, `isActive`, `lastLoginAt`.
- **UI Actions**: Login, Logout, Profile Update, Password Change.

### Dinas (Dinas Pendidikan)
- **Fields**: `id`, `name`, `kabupaten`, `provinsi`, `alamat`, `telepon`, `email`, `website`, `logoDinas`, `logoKabupaten`, `kepalaDinas`, `nipKepalaDinas`.
- **UI Actions**: List (Super Admin), Detail, Update.

### Sekolah (School)
- **Fields**: `id`, `dinasId`, `npsn`, `name`, `jenjang` (SD/SMP), `alamat`, `kelurahan`, `kecamatan`, `telepon`, `email`, `koordinat`, `logo`, `kepalaSekolah`, `nipKepalaSekolah`, `ketuaSpmb`, `akreditasi`, `status` (negeri/swasta).
- **UI Actions**: List (Dinas/Super Admin), Detail (Siswa), Create/Update/Delete (Dinas/Super Admin).

### Siswa (Student)
- **Fields**: `id`, `userId`, `nisn`, `nik`, `namaLengkap`, `tempatLahir`, `tanggalLahir`, `jenisKelamin`, `agama`, `alamat`, `rt`, `rw`, `kelurahan`, `kecamatan`, `kabupaten`, `provinsi`, `kodePos`, `koordinatRumah`, `telepon`, `email`, `asalSekolah`, `npsnAsalSekolah`.
- **UI Actions**: Profile Setup (Siswa), Detail (Admin), Update.

### Pendaftaran (Registration)
- **Fields**: `id`, `siswaId`, `sekolahId`, `jalurId`, `tahunAjaranId`, `noPendaftaran`, `status` (draft, submitted, verifikasi, etc.), `jarakKeSekolah`, `nilaiRata`, `skorZonasi`, `submittedAt`, `verifiedAt`.
- **UI Actions**: Create (Siswa), List (Siswa/Admin), Detail, Update Status (Admin), Delete (Siswa - if draft).

### Jalur (Registration Path)
- **Fields**: `id`, `name`, `type` (zonasi, prestasi, afirmasi, perpindahan), `description`, `persyaratan` (JSON/Array), `berkasWajib` (JSON/Array), `radiusZonasi`, `isActive`, `order`.
- **UI Actions**: List (Siswa), CRUD (Dinas/Super Admin).

### TahunAjaran (Academic Year)
- **Fields**: `id`, `tahun`, `isActive`, `tanggalMulaiPendaftaran`, `tanggalAkhirPendaftaran`, `tanggalSeleksi`, `tanggalPengumuman`, `tanggalDaftarUlang`, `tanggalAkhirDaftarUlang`.
- **UI Actions**: List, CRUD (Super Admin).

### Kuota (Quota)
- **Fields**: `id`, `sekolahId`, `jalurId`, `tahunAjaran`, `kuota`, `terisi`.
- **UI Actions**: List (Siswa/Admin), Update (Admin Sekolah/Dinas).

### Pengumuman (Announcement)
- **Fields**: `id`, `dinasId`, `sekolahId`, `judul`, `isi`, `tipe` (info, warning, urgent), `isPublished`, `publishedAt`, `createdBy`.
- **UI Actions**: List, Detail, CRUD (Admin).

### Berita (News)
- **Fields**: `id`, `dinasId`, `sekolahId`, `judul`, `slug`, `ringkasan`, `isi`, `gambar`, `isPublished`, `publishedAt`, `createdBy`.
- **UI Actions**: List, Detail, CRUD (Admin).

---

## 2. UI Action Matrix

| Entity | List | Detail | Create | Update | Delete | Search/Filter | Pagination |
|--------|------|--------|--------|--------|--------|---------------|------------|
| User | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Dinas | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Sekolah| Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Siswa | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Pendaftaran | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Jalur | Yes | Yes | Yes | Yes | Yes | No | No |
| Tahun Ajaran | Yes | Yes | Yes | Yes | Yes | No | No |
| Kuota | Yes | No | Yes | Yes | Yes | Yes | Yes |
| Pengumuman | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Berita | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

## 3. Implementation Priorities

1. **User & Auth**: Essential for personalized views and role-based access.
2. **Dinas & Sekolah**: Master data required for pendaftaran.
3. **Siswa & Pendaftaran**: Core business logic.
4. **Jalur & Tahun Ajaran**: Configuration data.
5. **Pengumuman & Berita**: Informational content.
