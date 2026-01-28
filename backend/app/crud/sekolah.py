from typing import Optional
from sqlalchemy.orm import Session
from app.models.sekolah import Sekolah
from app.schemas import sekolah as schema_sekolah
import uuid

def get_sekolah(db: Session, sekolah_id: str):
    return db.query(Sekolah).filter(Sekolah.id == sekolah_id).first()

def get_sekolah_list(db: Session, skip: int = 0, limit: int = 100, dinas_id: Optional[str] = None):
    query = db.query(Sekolah)
    if dinas_id:
        query = query.filter(Sekolah.dinas_id == dinas_id)
    return query.offset(skip).limit(limit).all()

def create_sekolah(db: Session, sekolah: schema_sekolah.SekolahCreate):
    db_sekolah = Sekolah(
        id=str(uuid.uuid4()),
        **sekolah.model_dump()
    )
    db.add(db_sekolah)
    db.commit()
    db.refresh(db_sekolah)
    return db_sekolah

def update_sekolah(db: Session, sekolah_id: str, sekolah_in: schema_sekolah.SekolahUpdate):
    db_sekolah = db.query(Sekolah).filter(Sekolah.id == sekolah_id).first()
    if not db_sekolah:
        return None
    
    update_data = sekolah_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sekolah, field, value)
    
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
