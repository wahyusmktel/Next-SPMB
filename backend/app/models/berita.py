from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.sql import func
from app.db.session import Base

class Berita(Base):
    __tablename__ = "berita"

    id = Column(String(36), primary_key=True, index=True)
    dinas_id = Column(String(36), ForeignKey("dinas.id"), nullable=True)
    sekolah_id = Column(String(36), ForeignKey("sekolah.id"), nullable=True)
    judul = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    ringkasan = Column(Text, nullable=True)
    isi = Column(Text, nullable=False)
    gambar = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=True)
    published_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String(36), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
