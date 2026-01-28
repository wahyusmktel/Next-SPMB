from sqlalchemy.orm import Session
from app.models.sekolah import Sekolah
from app.schemas.sekolah import SekolahCreate
import uuid

def get_sekolah(db: Session, sekolah_id: str):
    return db.query(Sekolah).filter(Sekolah.id == sekolah_id).first()

def get_sekolah_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Sekolah).offset(skip).limit(limit).all()

def create_sekolah(db: Session, sekolah: SekolahCreate):
    db_sekolah = Sekolah(
        id=str(uuid.uuid4()),
        **sekolah.model_dump()
    )
    db.add(db_sekolah)
    db.commit()
    db.refresh(db_sekolah)
    return db_sekolah

def delete_sekolah(db: Session, sekolah_id: str):
    db_sekolah = db.query(Sekolah).filter(Sekolah.id == sekolah_id).first()
    if db_sekolah:
        db.delete(db_sekolah)
        db.commit()
    return db_sekolah
