from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import date, datetime

class SiswaBase(BaseModel):
    nisn: str
    nik: str
    nama_lengkap: str
    tempat_lahir: str
    tanggal_lahir: date
    jenis_kelamin: str
    agama: str
    alamat: str
    rt: Optional[str] = None
    rw: Optional[str] = None
    kelurahan: str
    kecamatan: str
    kabupaten: str
    provinsi: str
    kode_pos: Optional[str] = None
    koordinat_rumah: Optional[Any] = None
    telepon: Optional[str] = None
    email: EmailStr
    asal_sekolah: Optional[str] = None
    npsn_asal_sekolah: Optional[str] = None

class SiswaCreate(SiswaBase):
    pass

class SiswaUpdate(BaseModel):
    nama_lengkap: Optional[str] = None
    alamat: Optional[str] = None
    telepon: Optional[str] = None
    # Add other fields as needed

class Siswa(SiswaBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
