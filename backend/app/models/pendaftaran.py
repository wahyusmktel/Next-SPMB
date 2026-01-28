from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Pendaftaran(Base):
    __tablename__ = "pendaftaran"

    id = Column(String(36), primary_key=True, index=True)
    siswa_id = Column(String(36), ForeignKey("siswa.id"), nullable=False)
    sekolah_id = Column(String(36), ForeignKey("sekolah.id"), nullable=False)
    jalur_id = Column(String(36), ForeignKey("jalur.id"), nullable=False)
    tahun_ajaran_id = Column(String(36), ForeignKey("tahun_ajaran.id"), nullable=False)
    no_pendaftaran = Column(String(50), unique=True, index=True, nullable=False)
    status = Column(String(30), default="draft") # draft, submitted, verifikasi, etc.
    jarak_ke_sekolah = Column(Float, nullable=True)
    nilai_rata = Column(Float, nullable=True)
    skor_zonasi = Column(Float, nullable=True)
    skor_prestasi = Column(Float, nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verified_by = Column(String(36), nullable=True)
    reject_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    siswa = relationship("Siswa", backref="pendaftaran")
    sekolah = relationship("Sekolah", backref="pendaftar")
    jalur = relationship("Jalur", backref="pendaftaran")
    tahun_ajaran = relationship("TahunAjaran", backref="pendaftaran")
