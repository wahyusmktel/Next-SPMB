from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.crud import common as crud_common
from app.schemas import registration as schema_reg # Reuse or create new schemas

# Since I don't have schemas for Pengumuman/Berita yet, I'll define them here or usually in schemas/
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PengumumanBase(BaseModel):
    judul: str
    isi: str
    tipe: str
    is_published: bool = True

class Pengumuman(PengumumanBase):
    id: str
    published_at: datetime
    class Config:
        from_attributes = True

class BeritaBase(BaseModel):
    judul: str
    slug: str
    ringkasan: Optional[str] = None
    isi: str
    gambar: Optional[str] = None
    is_published: bool = True

class Berita(BeritaBase):
    id: str
    published_at: datetime
    class Config:
        from_attributes = True

router = APIRouter()

@router.get("/pengumuman", response_model=List[Pengumuman])
def read_pengumuman_list(db: Session = Depends(deps.get_db)):
    return crud_common.get_pengumuman_list(db)

@router.get("/berita", response_model=List[Berita])
def read_berita_list(db: Session = Depends(deps.get_db)):
    return crud_common.get_berita_list(db)
