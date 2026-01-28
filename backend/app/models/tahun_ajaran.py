from sqlalchemy import Column, String, Boolean, DateTime
from app.db.session import Base

class TahunAjaran(Base):
    __tablename__ = "tahun_ajaran"

    id = Column(String(36), primary_key=True, index=True)
    tahun = Column(String(20), nullable=False) # 2026/2027
    is_active = Column(Boolean, default=True)
    tanggal_mulai_pendaftaran = Column(DateTime, nullable=False)
    tanggal_akhir_pendaftaran = Column(DateTime, nullable=False)
    tanggal_seleksi = Column(DateTime, nullable=False)
    tanggal_pengumuman = Column(DateTime, nullable=False)
    tanggal_daftar_ulang = Column(DateTime, nullable=False)
    tanggal_akhir_daftar_ulang = Column(DateTime, nullable=False)
