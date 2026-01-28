from sqlalchemy import Column, String, Integer, ForeignKey
from app.db.session import Base

class Kuota(Base):
    __tablename__ = "kuota"

    id = Column(String(36), primary_key=True, index=True)
    sekolah_id = Column(String(36), ForeignKey("sekolah.id"), nullable=False)
    jalur_id = Column(String(36), ForeignKey("jalur.id"), nullable=False)
    tahun_ajaran = Column(String(20), nullable=False)
    kuota = Column(Integer, nullable=False)
    terisi = Column(Integer, default=0)
