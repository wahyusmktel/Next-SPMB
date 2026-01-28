from sqlalchemy.orm import Session
from app.models.pengumuman import Pengumuman
from app.models.berita import Berita
import uuid

def get_pengumuman_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Pengumuman).filter(Pengumuman.is_published == True).order_by(Pengumuman.created_at.desc()).offset(skip).limit(limit).all()

def get_berita_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Berita).filter(Berita.is_published == True).order_by(Berita.created_at.desc()).offset(skip).limit(limit).all()

def get_berita_by_slug(db: Session, slug: str):
    return db.query(Berita).filter(Berita.slug == slug).first()
