from sqlalchemy.orm import Session
from app.models.siswa import Siswa
from app.schemas.user import UserCreate
from app.crud import user as crud_user
import uuid

def get_siswa(db: Session, siswa_id: str):
    return db.query(Siswa).filter(Siswa.id == siswa_id).first()

def get_siswa_by_user_id(db: Session, user_id: str):
    return db.query(Siswa).filter(Siswa.user_id == user_id).first()

def create_siswa(db: Session, siswa_data: dict, user_id: str):
    db_siswa = Siswa(
        id=str(uuid.uuid4()),
        user_id=user_id,
        **siswa_data
    )
    db.add(db_siswa)
    db.commit()
    db.refresh(db_siswa)
    return db_siswa

from typing import Optional
from app.models.pendaftaran import Pendaftaran
from app.models.sekolah import Sekolah

def get_siswa_list(db: Session, skip: int = 0, limit: int = 100, dinas_id: Optional[str] = None, sekolah_id: Optional[str] = None):
    query = db.query(Siswa)
    if sekolah_id:
        query = query.join(Pendaftaran).filter(Pendaftaran.sekolah_id == sekolah_id)
    elif dinas_id:
        query = query.join(Pendaftaran).join(Sekolah).filter(Sekolah.dinas_id == dinas_id)
    return query.offset(skip).limit(limit).all()
