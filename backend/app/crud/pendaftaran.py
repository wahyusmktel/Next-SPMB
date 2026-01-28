from sqlalchemy.orm import Session
from app.models.pendaftaran import Pendaftaran
from app.schemas.registration import PendaftaranCreate
import uuid
from datetime import datetime

def get_pendaftaran(db: Session, pendaftaran_id: str):
    return db.query(Pendaftaran).filter(Pendaftaran.id == pendaftaran_id).first()

from typing import Optional
from app.models.sekolah import Sekolah

def get_pendaftaran_list(db: Session, skip: int = 0, limit: int = 100, dinas_id: Optional[str] = None, sekolah_id: Optional[str] = None):
    query = db.query(Pendaftaran)
    if sekolah_id:
        query = query.filter(Pendaftaran.sekolah_id == sekolah_id)
    elif dinas_id:
        query = query.join(Sekolah).filter(Sekolah.dinas_id == dinas_id)
    return query.offset(skip).limit(limit).all()

def create_pendaftaran(db: Session, pendaftaran: PendaftaranCreate, siswa_id: str):
    db_pendaftaran = Pendaftaran(
        id=str(uuid.uuid4()),
        siswa_id=siswa_id,
        no_pendaftaran=f"SPMB-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}",
        **pendaftaran.model_dump()
    )
    db.add(db_pendaftaran)
    db.commit()
    db.refresh(db_pendaftaran)
    return db_pendaftaran
