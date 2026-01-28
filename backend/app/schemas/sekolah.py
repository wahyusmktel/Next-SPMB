from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.sekolah import Jenjang

# Dinas Schemas
class DinasBase(BaseModel):
    name: str
    kabupaten: str
    provinsi: str
    alamat: str
    telepon: str
    email: str
    website: Optional[str] = None
    logo_dinas: Optional[str] = None
    logo_kabupaten: Optional[str] = None
    signature_url: Optional[str] = None
    kepala_dinas: str
    nip_kepala_dinas: str
    notification_settings: Optional[dict] = None

class DinasCreate(DinasBase):
    pass

class DinasUpdate(BaseModel):
    name: Optional[str] = None
    kabupaten: Optional[str] = None
    provinsi: Optional[str] = None
    alamat: Optional[str] = None
    telepon: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    logo_kabupaten: Optional[str] = None
    signature_url: Optional[str] = None
    kepala_dinas: Optional[str] = None
    nip_kepala_dinas: Optional[str] = None
    notification_settings: Optional[dict] = None

class Dinas(DinasBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Sekolah Schemas
class SekolahBase(BaseModel):
    dinas_id: str
    npsn: str
    name: str
    jenjang: Jenjang
    alamat: str
    kelurahan: str
    kecamatan: str
    telepon: str
    email: str
    website: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    logo: Optional[str] = None
    kepala_sekolah: str
    nip_kepala_sekolah: str
    ketua_spmb: str
    akreditasi: Optional[str] = None
    status: str

class SekolahCreate(SekolahBase):
    pass

class SekolahUpdate(BaseModel):
    dinas_id: Optional[str] = None
    npsn: Optional[str] = None
    name: Optional[str] = None
    jenjang: Optional[Jenjang] = None
    alamat: Optional[str] = None
    kelurahan: Optional[str] = None
    kecamatan: Optional[str] = None
    telepon: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    logo: Optional[str] = None
    kepala_sekolah: Optional[str] = None
    nip_kepala_sekolah: Optional[str] = None
    ketua_spmb: Optional[str] = None
    akreditasi: Optional[str] = None
    status: Optional[str] = None

class Sekolah(SekolahBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
