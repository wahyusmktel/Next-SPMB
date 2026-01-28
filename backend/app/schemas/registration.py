from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Jalur Schemas
class JalurBase(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    persyaratan: Optional[List[str]] = None
    berkas_wajib: Optional[List[str]] = None
    radius_zonasi: Optional[int] = None
    is_active: bool = True
    order: int = 0

class Jalur(JalurBase):
    id: str
    class Config:
        from_attributes = True

# TahunAjaran Schemas
class TahunAjaranBase(BaseModel):
    tahun: str
    is_active: bool = True
    tanggal_mulai_pendaftaran: datetime
    tanggal_akhir_pendaftaran: datetime
    tanggal_seleksi: datetime
    tanggal_pengumuman: datetime
    tanggal_daftar_ulang: datetime
    tanggal_akhir_daftar_ulang: datetime

class TahunAjaranUpdate(BaseModel):
    tahun: Optional[str] = None
    is_active: Optional[bool] = None
    tanggal_mulai_pendaftaran: Optional[datetime] = None
    tanggal_akhir_pendaftaran: Optional[datetime] = None
    tanggal_seleksi: Optional[datetime] = None
    tanggal_pengumuman: Optional[datetime] = None
    tanggal_daftar_ulang: Optional[datetime] = None
    tanggal_akhir_daftar_ulang: Optional[datetime] = None

class TahunAjaran(TahunAjaranBase):
    id: str
    class Config:
        from_attributes = True

# Pendaftaran Schemas
class PendaftaranBase(BaseModel):
    siswa_id: str
    sekolah_id: str
    jalur_id: str
    tahun_ajaran_id: str
    no_pendaftaran: str
    status: str = "draft"
    jarak_ke_sekolah: Optional[float] = None
    nilai_rata: Optional[float] = None
    skor_zonasi: Optional[float] = None
    skor_prestasi: Optional[float] = None

class PendaftaranCreate(BaseModel):
    sekolah_id: str
    jalur_id: str
    tahun_ajaran_id: str

class PendaftaranUpdate(BaseModel):
    status: Optional[str] = None
    reject_reason: Optional[str] = None

class Pendaftaran(PendaftaranBase):
    id: str
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None

    class Config:
        from_attributes = True
